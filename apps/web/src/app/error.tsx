'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Storefront error', error)
  }, [error])

  return (
    <div className="container-custom flex min-h-[60vh] items-center justify-center section-padding">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Something went wrong
        </p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900">We hit a snag.</h1>
        <p className="mx-auto mt-4 max-w-md text-gray-500">
          An unexpected error occurred while loading this page. You can try again, or head back
          home.
        </p>
        {error.digest && <p className="mt-3 text-xs text-gray-400">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
