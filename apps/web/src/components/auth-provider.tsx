'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { useWishlistStore } from '@/lib/wishlist-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const user = useAuthStore((s) => s.user)
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist)
  const clearWishlist = useWishlistStore((s) => s.clear)

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      clearWishlist()
    }
  }, [user, fetchWishlist, clearWishlist])

  return <>{children}</>
}
