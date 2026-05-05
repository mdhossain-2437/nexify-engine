import Link from 'next/link'

export const metadata = {
  title: 'Order Confirmed | Nexify Engine',
  description: 'Your order has been confirmed',
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        <p className="text-gray-500 mb-8">
          You will receive an email confirmation with your order details shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-outline">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
