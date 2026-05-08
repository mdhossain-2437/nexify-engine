export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  tenantId: string
  customerId: string
  invoiceNumber: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: string
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  shippingAddress: Address
  billingAddress: Address | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  variantId: string | null
  title: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Address {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
}
