'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { useHydrated } from '@/lib/use-hydrated'
import { formatPrice } from '@/lib/format'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type PaymentMethod = 'cod' | 'stripe'

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.getTotalPrice())
  const clearCart = useCartStore((state) => state.clearCart)

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')

  const hydrated = useHydrated()

  useEffect(() => {
    if (error) {
      const timer = window.setTimeout(() => setError(null), 8000)
      return () => window.clearTimeout(timer)
    }
  }, [error])

  if (!hydrated) {
    return (
      <div className="container-custom section-padding">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="container-custom section-padding">
        <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-emerald-900">Order placed!</h1>
          <p className="mt-2 text-sm text-emerald-800">
            Thank you for your purchase. We&apos;ve sent you a confirmation email.
          </p>
          <Link href="/products" className="btn-primary mt-6">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-sm text-gray-500">Add a product before checking out.</p>
          <Link href="/products" className="btn-primary mt-6">
            Browse products
          </Link>
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
      fullName: String(formData.get('fullName') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      addressLine1: String(formData.get('addressLine1') ?? ''),
      addressLine2: String(formData.get('addressLine2') ?? ''),
      city: String(formData.get('city') ?? ''),
      postalCode: String(formData.get('postalCode') ?? ''),
      country: String(formData.get('country') ?? ''),
    }

    if (paymentMethod === 'stripe') {
      try {
        const res = await fetch(`${API_URL}/api/stripe/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.productId,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
            tenantId: process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || '1',
            customerEmail: String(formData.get('email') ?? ''),
            shippingAddress,
            successUrl: `${window.location.origin}/order-confirmation`,
            cancelUrl: window.location.href,
          }),
        })

        const data = (await res.json()) as { url?: string; error?: string }

        if (!res.ok || !data.url) {
          throw new Error(data.error || 'Failed to create checkout session')
        }

        clearCart()
        window.location.href = data.url
        return
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
    <div className="container-custom section-padding">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {error && (
        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <fieldset className="rounded-2xl border border-gray-100 bg-white p-6">
              <legend className="px-2 text-lg font-semibold">Shipping information</legend>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Full name" name="fullName" autoComplete="name" required />
                <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
                <Field label="Email" name="email" type="email" autoComplete="email" className="md:col-span-2" required />
                <Field label="Address line 1" name="addressLine1" autoComplete="address-line1" className="md:col-span-2" required />
                <Field label="Address line 2" name="addressLine2" autoComplete="address-line2" className="md:col-span-2" />
                <Field label="City" name="city" autoComplete="address-level2" required />
                <Field label="Postal code" name="postalCode" autoComplete="postal-code" required />
                <Field label="Country" name="country" autoComplete="country-name" defaultValue="United States" required />
              </div>
            </fieldset>

            <fieldset className="rounded-2xl border border-gray-100 bg-white p-6">
              <legend className="px-2 text-lg font-semibold">Payment method</legend>
              <div className="space-y-3">
                <PaymentOption
                  value="cod"
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                  title="Cash on delivery"
                  description="Pay in cash when your order is delivered."
                />
                <PaymentOption
                  value="stripe"
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                  title="Credit / debit card"
                  description="Secure card payment via Stripe."
                />
              </div>
            </fieldset>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold">Order summary</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantIndex ?? 'base'}`}
                  className="flex justify-between gap-4"
                >
                  <span className="line-clamp-2 text-gray-600">
                    {item.title} <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base">
              <span className="font-semibold">Total</span>
              <span className="font-bold">{formatPrice(total)}</span>
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
              {loading ? 'Processing…' : paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Place order'}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              By placing your order you agree to our{' '}
              <Link href="/terms" className="underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline">
                Privacy
              </Link>
              .
            </p>
          </aside>
        </div>
      </form>
    </div>
  )
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
}

function Field({ label, name, className = '', ...rest }: FieldProps) {
  const id = `field-${name}`
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {rest.required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        {...rest}
        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}

interface PaymentOptionProps {
  value: PaymentMethod
  selected: PaymentMethod
  onChange: (next: PaymentMethod) => void
  title: string
  description: string
}

function PaymentOption({ value, selected, onChange, title, description }: PaymentOptionProps) {
  const id = `pm-${value}`
  const isSelected = value === selected
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
        isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40'
      }`}
    >
      <input
        id={id}
        type="radio"
        name="payment"
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 accent-primary"
      />
      <div>
        <span className="font-medium text-gray-900">{title}</span>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </label>
  )
}
