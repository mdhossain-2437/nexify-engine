'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { useWishlistStore } from '@/lib/wishlist-store'

interface WishlistButtonProps {
  productId: string | number
  className?: string
}

export function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
  const user = useAuthStore((s) => s.user)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()
  const [loading, setLoading] = useState(false)

  if (!user) return null

  const wishlisted = isInWishlist(productId)

  const handleToggle = async () => {
    setLoading(true)
    try {
      if (wishlisted) {
        await removeFromWishlist(productId)
      } else {
        await addToWishlist(productId)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        wishlisted
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
      } ${className}`}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className="h-4 w-4"
        fill={wishlisted ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={wishlisted ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {wishlisted ? 'Wishlisted' : 'Wishlist'}
    </button>
  )
}
