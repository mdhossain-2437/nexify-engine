'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  productId: string | number
  variantIndex?: number | null
  title: string
  price: number
  quantity: number
  image?: string | null
  slug: string
}

interface CartLineKey {
  productId: string | number
  variantIndex?: number | null
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string | number, variantIndex?: number | null) => void
  updateQuantity: (
    productId: string | number,
    variantIndex: number | null | undefined,
    quantity: number,
  ) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const STORAGE_KEY_PREFIX = 'nexify-cart'

/**
 * Resolve a tenant-scoped storage key.
 *
 * On the public storefront the active tenant is identified by hostname
 * (subdomain or custom domain). Without scoping, every tenant on the same
 * browser would share a cart, which is both a bug and a privacy issue.
 */
function resolveStorageKey(): string {
  if (typeof window === 'undefined') return STORAGE_KEY_PREFIX
  const host = window.location.host || 'default'
  return `${STORAGE_KEY_PREFIX}:${host}`
}

function sameLine(a: CartItem, b: CartLineKey): boolean {
  if (a.productId !== b.productId) return false
  return (a.variantIndex ?? null) === (b.variantIndex ?? null)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, item))
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (productId, variantIndex) => {
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, { productId, variantIndex })),
        }))
      },

      updateQuantity: (productId, variantIndex, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantIndex)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, { productId, variantIndex }) ? { ...i, quantity } : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: STORAGE_KEY_PREFIX,
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          }
        }
        const key = resolveStorageKey()
        return {
          getItem: () => window.localStorage.getItem(key),
          setItem: (_name, value) => window.localStorage.setItem(key, value),
          removeItem: () => window.localStorage.removeItem(key),
        }
      }),
    },
  ),
)
