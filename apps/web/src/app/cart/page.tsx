'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import { useHydrated } from '@/lib/use-hydrated'
import { formatPrice } from '@/lib/format'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const total = useCartStore((state) => state.getTotalPrice())
  const totalItems = useCartStore((state) => state.getTotalItems())
  const hydrated = useHydrated()

  if (!hydrated) {
    return (
      <div className="container-custom section-padding">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="mx-auto mb-4 h-16 w-16 text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13L5.4 5M7 13l-1.5 4M17 13l1.5 4M9 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-sm text-gray-500">
            Discover something you love — add a product to get started.
          </p>
          <Link href="/products" className="btn-primary mt-6">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom section-padding">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your cart</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalItems} item{totalItems === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Clear all
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variantIndex ?? 'base'}`}
              className="flex flex-col gap-4 p-4 sm:flex-row"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-8 w-8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-gray-900 hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.variantIndex)}
                    aria-label={`Remove ${item.title}`}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-gray-200">
                    <button
                      type="button"
                      aria-label="Decrease"
                      onClick={() =>
                        updateQuantity(item.productId, item.variantIndex, item.quantity - 1)
                      }
                      className="px-3 text-gray-600 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="w-10 border-x border-gray-200 py-1 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase"
                      onClick={() =>
                        updateQuantity(item.productId, item.variantIndex, item.quantity + 1)
                      }
                      className="px-3 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-medium">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Shipping</dt>
              <dd className="text-gray-500">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Proceed to checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
