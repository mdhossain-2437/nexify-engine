'use client'

import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface WishlistEntry {
  id: string
  product: {
    id: string | number
    title: string
    slug: string
    price: number
    salePrice?: number | null
    images?: { image?: { url?: string } | string | null; alt?: string | null }[]
  }
  createdAt: string
}

interface WishlistState {
  items: WishlistEntry[]
  productIds: Set<string | number>
  loading: boolean
  fetchWishlist: () => Promise<void>
  addToWishlist: (productId: string | number, tenantId?: string) => Promise<void>
  removeFromWishlist: (productId: string | number) => Promise<void>
  isInWishlist: (productId: string | number) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  productIds: new Set(),
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true })
    try {
      const res = await fetch(`${API_URL}/api/wishlists?depth=2&limit=100`, {
        credentials: 'include',
      })
      if (!res.ok) {
        set({ items: [], productIds: new Set(), loading: false })
        return
      }
      const data = (await res.json()) as { docs: WishlistEntry[] }
      const ids = new Set<string | number>()
      for (const item of data.docs) {
        if (item.product && typeof item.product === 'object') {
          ids.add(item.product.id)
        }
      }
      set({ items: data.docs, productIds: ids, loading: false })
    } catch {
      set({ items: [], productIds: new Set(), loading: false })
    }
  },

  addToWishlist: async (productId, tenantId) => {
    const res = await fetch(`${API_URL}/api/wishlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        product: productId,
        tenant: tenantId || process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || '1',
      }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(
        (data as { errors?: { message: string }[] }).errors?.[0]?.message || 'Failed to add',
      )
    }
    await get().fetchWishlist()
  },

  removeFromWishlist: async (productId) => {
    const { items } = get()
    const entry = items.find(
      (i) => i.product && typeof i.product === 'object' && i.product.id === productId,
    )
    if (!entry) return
    await fetch(`${API_URL}/api/wishlists/${entry.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    set((state) => {
      const newIds = new Set(state.productIds)
      newIds.delete(productId)
      return {
        items: state.items.filter((i) => i.id !== entry.id),
        productIds: newIds,
      }
    })
  },

  isInWishlist: (productId) => get().productIds.has(productId),

  clear: () => set({ items: [], productIds: new Set() }),
}))
