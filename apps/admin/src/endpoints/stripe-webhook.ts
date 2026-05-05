import type { PayloadHandler } from 'payload'

export const stripeWebhookHandler: PayloadHandler = async (req) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

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
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(stripeSecretKey)

    const rawBody = await req.text?.()
    if (!rawBody) {
      return Response.json({ error: 'Empty body' }, { status: 400 })
    }

    let event: { type: string; data: { object: Record<string, unknown> } }

    if (webhookSecret) {
      const signature = req.headers.get('stripe-signature')
      if (!signature) {
        return Response.json(
          { error: 'Missing stripe-signature header' },
          { status: 400 },
        )
      }
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret) as unknown as typeof event
    } else {
      event = JSON.parse(rawBody)
    }

    const session = event.data.object as Record<string, unknown>
    const metadata = session.metadata as Record<string, string> | undefined
    const orderId = metadata?.orderId
    const tenantId = metadata?.tenantId
    const sessionId = session.id as string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payloadAny = req.payload as any

    switch (event.type) {
      case 'checkout.session.completed': {
        if (orderId) {
          await req.payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              paymentStatus: 'paid',
              orderStatus: 'confirmed',
              transactionId: session.payment_intent as string,
            },
          })
        }

        const payments = await payloadAny.find({
          collection: 'payments',
          where: {
            stripeSessionId: { equals: sessionId },
          },
          limit: 1,
        })

        if (payments.docs.length > 0) {
          await payloadAny.update({
            collection: 'payments',
            id: payments.docs[0].id,
            data: {
              status: 'completed',
              transactionId: session.payment_intent as string,
              rawResponse: session,
            },
          })
        }

        req.payload.logger.info(
          `Payment completed for order ${orderId}, tenant ${tenantId}`,
        )
        break
      }

      case 'checkout.session.expired': {
        if (orderId) {
          await req.payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              paymentStatus: 'failed',
              orderStatus: 'cancelled',
            },
          })
        }

        const payments = await payloadAny.find({
          collection: 'payments',
          where: {
            stripeSessionId: { equals: sessionId },
          },
          limit: 1,
        })

        if (payments.docs.length > 0) {
          await payloadAny.update({
            collection: 'payments',
            id: payments.docs[0].id,
            data: {
              status: 'failed',
              rawResponse: session,
            },
          })
        }
        break
      }

      default:
        req.payload.logger.info(`Unhandled Stripe event: ${event.type}`)
    }

    return Response.json({ received: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    req.payload.logger.error(`Stripe webhook error: ${message}`)
    return Response.json({ error: message }, { status: 400 })
  }
}
