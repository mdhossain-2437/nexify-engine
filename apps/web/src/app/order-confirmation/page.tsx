import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order confirmation',
  description: 'Thanks for your order!',
}

interface OrderConfirmationPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const sp = (await searchParams) ?? {}
  const sessionParam = Array.isArray(sp.session_id) ? sp.session_id[0] : sp.session_id

  return (
    <div className="container-custom section-padding">
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-4xl text-white">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-emerald-900">Payment successful!</h1>
        <p className="mt-3 text-gray-600">
          Thanks for your order. We&apos;ve emailed you a receipt and your order details.
        </p>

        {sessionParam && (
          <p className="mt-6 break-all rounded-lg bg-white p-3 text-xs text-gray-500">
            Reference: <span className="font-mono">{sessionParam}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/products" className="btn-primary">
            Continue shopping
          </Link>
          <Link href="/" className="btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
