import type { PayloadHandler } from 'payload'

interface LineItem {
  /** Numeric Payload product ID. Required to wire the order line back to the
   *  product collection. */
  productId: number | string
  title: string
  price: number
  quantity: number
  variantIndex?: number | null
}

interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

interface CheckoutBody {
  items: LineItem[]
  tenantId: string | number
  customerEmail: string
  customerId?: string | number | null
  shippingAddress: ShippingAddress
  successUrl: string
  cancelUrl: string
  currency?: string
}

const ALLOWED_CURRENCIES = new Set(['usd', 'eur', 'gbp', 'cad', 'aud', 'inr', 'bdt'])

function parseId(value: unknown): number | string | undefined {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim()) {
    const num = Number(value)
    return Number.isFinite(num) ? num : value
  }
  return undefined
}

export const stripeCheckoutHandler: PayloadHandler = async (req) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return Response.json({ error: 'Stripe is not configured' }, { status: 503 })
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const body = (await req.json?.()) as Partial<CheckoutBody> | undefined
    if (
      !body ||
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      !body.tenantId ||
      !body.customerEmail
    ) {
      return Response.json(
        {
          error:
            'Missing required fields: items[].productId, items[].title, items[].price, items[].quantity, tenantId, customerEmail',
        },
        { status: 400 },
      )
    }

    for (const item of body.items) {
      if (
        !item ||
        item.productId == null ||
        typeof item.title !== 'string' ||
        typeof item.price !== 'number' ||
        typeof item.quantity !== 'number' ||
        item.quantity <= 0
      ) {
        return Response.json(
          {
            error:
              'Each cart line must include productId, title, price (number) and quantity (positive integer).',
          },
          { status: 400 },
        )
      }
    }

    const currency = (body.currency ?? 'usd').toLowerCase()
    if (!ALLOWED_CURRENCIES.has(currency)) {
      return Response.json({ error: `Unsupported currency: ${currency}` }, { status: 400 })
    }

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeSecretKey)

    const totalAmount = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    const invoiceNumber = `INV-${timestamp}-${random}`

    const tenantId = parseId(body.tenantId)
    const customerId = parseId(req.user?.id ?? body.customerId ?? null)

    const orderData: Record<string, unknown> = {
      tenant: tenantId,
      invoiceNumber,
      customerEmail: body.customerEmail,
      items: body.items.map((item) => ({
        product: parseId(item.productId),
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
      totalAmount,
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingAddress: body.shippingAddress,
    }
    if (customerId !== undefined) {
      orderData.customer = customerId
    }

    const order = await req.payload.create({
      collection: 'orders',
      data: orderData as never,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: body.customerEmail,
      line_items: body.items.map((item) => ({
        price_data: {
          currency,
          product_data: { name: item.title },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: String(order.id),
        tenantId: String(tenantId ?? ''),
        invoiceNumber,
      },
      success_url: `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl,
    })

    await req.payload.create({
      collection: 'payments',
      data: {
        tenant: tenantId,
        order: order.id,
        provider: 'stripe',
        stripeSessionId: session.id,
        amount: totalAmount,
        currency,
        status: 'pending',
      } as never,
    })

    return Response.json({ url: session.url, sessionId: session.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    req.payload.logger.error(`Stripe checkout error: ${message}`)
    return Response.json({ error: message }, { status: 500 })
  }
}
