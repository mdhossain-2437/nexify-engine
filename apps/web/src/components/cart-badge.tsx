'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import { useHydrated } from '@/lib/use-hydrated'

export function CartBadge() {
  const totalItems = useCartStore((state) => state.getTotalItems())
  const hydrated = useHydrated()

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${hydrated ? totalItems : 0} item${totalItems === 1 ? '' : 's'}`}
      className="relative inline-flex items-center gap-2 rounded-full p-2 text-gray-700 transition-colors hover:text-primary"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13L5.4 5M7 13l-1.5 4M17 13l1.5 4M9 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        />
      </svg>
      {hydrated && totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  )
}
