export interface Payment {
  id: string
  tenantId: string
  orderId: string
  provider: PaymentProvider
  transactionId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  rawResponse: Record<string, unknown> | null
  createdAt: string
}

export type PaymentProvider = 'stripe' | 'paypal' | 'sslcommerz' | 'manual'
