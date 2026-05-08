'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { formatPrice } from '@/lib/format'

function resolveImageUrl(
  img: { image?: { url?: string } | string | null; alt?: string | null } | undefined,
): string | null {
  if (!img) return null
  if (!img.image) return null
  if (typeof img.image === 'string') return img.image
  return img.image.url ?? null
}

export default function WishlistPage() {
  const user = useAuthStore((s) => s.user)
  const { items, loading, fetchWishlist, removeFromWishlist } = useWishlistStore()

  useEffect(() => {
    if (user) {
      fetchWishlist()
    }
  }, [user, fetchWishlist])

  if (loading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <svg
            className="mx-auto mb-3 h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">Your wishlist is empty</h2>
          <p className="mt-1 text-sm text-gray-500">
            Save products you love and come back to them later.
          </p>
          <Link href="/products" className="btn-primary mt-4">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((entry) => {
            const product = entry.product
            if (!product || typeof product !== 'object') return null
            const imageUrl = resolveImageUrl(product.images?.[0])
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

            return (
              <div
                key={entry.id}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl.startsWith('/') ? `${API_URL}${imageUrl}` : imageUrl}
                      alt={product.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                      <svg
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-semibold text-gray-900 hover:text-primary"
                    >
                      {product.title}
                    </Link>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {product.salePrice
                        ? formatPrice(product.salePrice)
                        : formatPrice(product.price)}
                      {product.salePrice && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="mt-2 self-start text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
