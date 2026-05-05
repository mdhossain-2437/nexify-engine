import type { PayloadHandler } from 'payload'

interface LineItem {
  title: string
  price: number
  quantity: number
}

interface CheckoutBody {
  items: LineItem[]
  tenantId: string
  customerEmail: string
  shippingAddress: {
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  successUrl: string
  cancelUrl: string
}

export const stripeCheckoutHandler: PayloadHandler = async (req) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return Response.json(
      { error: 'Stripe is not configured' },
      { status: 503 },
    )
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const body = (await req.json?.()) as CheckoutBody | undefined
    if (!body || !body.items?.length || !body.tenantId || !body.customerEmail) {
      return Response.json(
        { error: 'Missing required fields: items, tenantId, customerEmail' },
        { status: 400 },
      )
    }

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeSecretKey)

    const totalAmount = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    const invoiceNumber = `INV-${timestamp}-${random}`

    const tenantIdNum = Number(body.tenantId)
    const customerIdNum = req.user?.id ? Number(req.user.id) : tenantIdNum

    const order = await req.payload.create({
      collection: 'orders',
      data: {
        tenant: tenantIdNum,
        customer: customerIdNum,
        invoiceNumber,
        items: body.items.map((item) => ({
          product: tenantIdNum,
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
      },
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: body.customerEmail,
      line_items: body.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.title },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: String(order.id),
        tenantId: body.tenantId,
        invoiceNumber,
      },
      success_url: `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (req.payload as any).create({
      collection: 'payments',
      data: {
        tenant: tenantIdNum,
        order: Number(order.id),
        provider: 'stripe',
        stripeSessionId: session.id,
        amount: totalAmount,
        currency: 'usd',
        status: 'pending',
      },
    })

    return Response.json({ url: session.url, sessionId: session.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    req.payload.logger.error(`Stripe checkout error: ${message}`)
    return Response.json({ error: message }, { status: 500 })
  }
}
