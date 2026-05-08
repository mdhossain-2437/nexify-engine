import type { PayloadHandler } from 'payload'

interface PlanConfig {
  name: string
  monthlyPriceId: string
  yearlyPriceId: string
  features: string[]
  limits: {
    products: number
    storage: number // MB
    customDomain: boolean
  }
}

const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    name: 'Free',
    monthlyPriceId: '',
    yearlyPriceId: '',
    features: ['Up to 10 products', '1GB storage', 'Basic analytics', 'Subdomain only'],
    limits: { products: 10, storage: 1024, customDomain: false },
  },
  basic: {
    name: 'Basic',
    monthlyPriceId: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || '',
    yearlyPriceId: process.env.STRIPE_BASIC_YEARLY_PRICE_ID || '',
    features: [
      'Up to 100 products',
      '5GB storage',
      'Advanced analytics',
      'Custom domain',
      'Email support',
    ],
    limits: { products: 100, storage: 5120, customDomain: true },
  },
  pro: {
    name: 'Pro',
    monthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
    yearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
    features: [
      'Up to 1,000 products',
      '50GB storage',
      'Real-time analytics',
      'Custom domain',
      'Priority support',
      'API access',
    ],
    limits: { products: 1000, storage: 51200, customDomain: true },
  },
  premium: {
    name: 'Premium',
    monthlyPriceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
    yearlyPriceId: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
    features: [
      'Unlimited products',
      '200GB storage',
      'Real-time analytics',
      'Custom domain',
      'Dedicated support',
      'Full API access',
      'White-label',
    ],
    limits: { products: -1, storage: 204800, customDomain: true },
  },
}

export const subscriptionPlansHandler: PayloadHandler = async (req) => {
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const plans = Object.entries(PLAN_CONFIGS).map(([key, config]) => ({
    id: key,
    name: config.name,
    features: config.features,
    limits: config.limits,
    hasMonthly: !!config.monthlyPriceId,
    hasYearly: !!config.yearlyPriceId,
  }))

  return Response.json({ plans })
}

export const createSubscriptionHandler: PayloadHandler = async (req) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return Response.json({ error: 'Stripe is not configured' }, { status: 503 })
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await req.json?.()) as {
      tenantId: string | number
      plan: string
      interval: 'monthly' | 'yearly'
      successUrl: string
      cancelUrl: string
    } | undefined

    if (!body?.tenantId || !body.plan || !body.interval) {
      return Response.json(
        { error: 'Missing required fields: tenantId, plan, interval' },
        { status: 400 },
      )
    }

    const planConfig = PLAN_CONFIGS[body.plan]
    if (!planConfig) {
      return Response.json({ error: `Unknown plan: ${body.plan}` }, { status: 400 })
    }

    const priceId =
      body.interval === 'yearly' ? planConfig.yearlyPriceId : planConfig.monthlyPriceId
    if (!priceId) {
      return Response.json(
        { error: `Price not configured for ${body.plan} ${body.interval}` },
        { status: 400 },
      )
    }

    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: body.tenantId,
    })

    if (!tenant) {
      return Response.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeSecretKey)

    const user = req.user as unknown as { email?: string; id: string }

    let customerId = (tenant as Record<string, unknown>).stripeCustomerId as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || (tenant as Record<string, unknown>).contactEmail as string || undefined,
        name: (tenant as Record<string, unknown>).name as string,
        metadata: {
          tenantId: String(body.tenantId),
        },
      })
      customerId = customer.id

      await req.payload.update({
        collection: 'tenants',
        id: body.tenantId,
        data: { stripeCustomerId: customerId } as never,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        tenantId: String(body.tenantId),
        plan: body.plan,
      },
      success_url: `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl,
    })

    return Response.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    const message = (err as Error).message || 'Unknown error'
    req.payload.logger.error(`Subscription error: ${message}`)
    return Response.json({ error: message }, { status: 500 })
  }
}

export const manageBillingHandler: PayloadHandler = async (req) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return Response.json({ error: 'Stripe is not configured' }, { status: 503 })
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await req.json?.()) as {
      tenantId: string | number
      returnUrl: string
    } | undefined

    if (!body?.tenantId || !body.returnUrl) {
      return Response.json(
        { error: 'Missing required fields: tenantId, returnUrl' },
        { status: 400 },
      )
    }

    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: body.tenantId,
    })

    const customerId = (tenant as Record<string, unknown>).stripeCustomerId as string | undefined
    if (!customerId) {
      return Response.json({ error: 'No billing account found for this tenant' }, { status: 400 })
    }

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeSecretKey)

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: body.returnUrl,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    const message = (err as Error).message || 'Unknown error'
    req.payload.logger.error(`Billing portal error: ${message}`)
    return Response.json({ error: message }, { status: 500 })
  }
}
