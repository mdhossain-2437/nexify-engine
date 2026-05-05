import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  variantIndex: number | null
  title: string
  price: number
  quantity: number
  image: string | null
  slug: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantIndex: number | null) => void
  updateQuantity: (productId: string, variantIndex: number | null, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantIndex === item.variantIndex
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantIndex === item.variantIndex
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (productId, variantIndex) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantIndex === variantIndex)
          ),
        }))
      },

      updateQuantity: (productId, variantIndex, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantIndex)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantIndex === variantIndex
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'nexify-cart',
    }
  )
)
