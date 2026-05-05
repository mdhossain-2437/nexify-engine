'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
          <Link href="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const shippingAddress = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      addressLine1: formData.get('addressLine1') as string,
      addressLine2: (formData.get('addressLine2') as string) || '',
      city: formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
    }

    if (paymentMethod === 'stripe') {
      try {
        const res = await fetch(`${API_URL}/api/stripe/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((item) => ({
              title: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
            tenantId: '1',
            customerEmail: formData.get('email') as string,
            shippingAddress,
            successUrl: `${window.location.origin}/order-confirmation`,
            cancelUrl: window.location.href,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to create checkout session')
        }

        if (data.url) {
          clearCart()
          window.location.href = data.url
          return
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment failed')
        setLoading(false)
        return
      }
    }

    clearCart()
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">Nexify Engine</Link>
          <Link href="/cart" className="text-gray-600 hover:text-primary">Back to Cart</Link>
        </div>
      </nav>

      <main className="container-custom section-padding">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="fullName" required className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" name="phone" required className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" required className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input type="text" name="addressLine1" required className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input type="text" name="addressLine2" className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" required className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input type="text" name="postalCode" required className="w-full border rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input type="text" name="country" required className="w-full border rounded-lg px-4 py-2" defaultValue="Bangladesh" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-primary"
                    />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="text-primary"
                    />
                    <div>
                      <span className="font-medium">Credit/Debit Card (Stripe)</span>
                      <p className="text-sm text-gray-500">Secure payment via Stripe</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantIndex}`} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.title} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary block text-center w-full disabled:opacity-50"
                >
                  {loading
                    ? 'Processing...'
                    : paymentMethod === 'stripe'
                      ? 'Pay with Stripe'
                      : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
