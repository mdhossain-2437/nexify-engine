import { beforeEach, describe, expect, it } from 'vitest'
import { useCartStore } from './cart-store'

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
    window.localStorage.clear()
  })

  it('starts empty', () => {
    const state = useCartStore.getState()
    expect(state.items).toEqual([])
    expect(state.getTotalItems()).toBe(0)
    expect(state.getTotalPrice()).toBe(0)
  })

  it('adds a new item', () => {
    useCartStore.getState().addItem({
      productId: 'p1',
      title: 'Cool product',
      price: 12.5,
      quantity: 2,
      slug: 'cool-product',
    })
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.getTotalItems()).toBe(2)
    expect(state.getTotalPrice()).toBe(25)
  })

  it('merges quantities for the same product+variant', () => {
    const store = useCartStore.getState()
    store.addItem({
      productId: 'p1',
      variantIndex: 0,
      title: 'Cool product',
      price: 10,
      quantity: 1,
      slug: 'cool-product',
    })
    store.addItem({
      productId: 'p1',
      variantIndex: 0,
      title: 'Cool product',
      price: 10,
      quantity: 3,
      slug: 'cool-product',
    })
    const after = useCartStore.getState()
    expect(after.items).toHaveLength(1)
    expect(after.items[0].quantity).toBe(4)
  })

  it('keeps different variants as separate lines', () => {
    const store = useCartStore.getState()
    store.addItem({
      productId: 'p1',
      variantIndex: 0,
      title: 'Variant A',
      price: 10,
      quantity: 1,
      slug: 'p1',
    })
    store.addItem({
      productId: 'p1',
      variantIndex: 1,
      title: 'Variant B',
      price: 12,
      quantity: 2,
      slug: 'p1',
    })
    const after = useCartStore.getState()
    expect(after.items).toHaveLength(2)
    expect(after.getTotalPrice()).toBe(10 + 24)
  })

  it('updates quantity and removes when zero', () => {
    const store = useCartStore.getState()
    store.addItem({
      productId: 'p1',
      title: 'Cool product',
      price: 5,
      quantity: 3,
      slug: 'cool-product',
    })

    store.updateQuantity('p1', undefined, 5)
    expect(useCartStore.getState().items[0].quantity).toBe(5)

    store.updateQuantity('p1', undefined, 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('removes a specific line', () => {
    const store = useCartStore.getState()
    store.addItem({ productId: 'p1', title: 'A', price: 1, quantity: 1, slug: 'a' })
    store.addItem({ productId: 'p2', title: 'B', price: 2, quantity: 1, slug: 'b' })
    store.removeItem('p1')
    const after = useCartStore.getState()
    expect(after.items).toHaveLength(1)
    expect(after.items[0].productId).toBe('p2')
  })

  it('clears the cart', () => {
    const store = useCartStore.getState()
    store.addItem({ productId: 'p1', title: 'A', price: 1, quantity: 1, slug: 'a' })
    store.clearCart()
    expect(useCartStore.getState().items).toEqual([])
  })
})
