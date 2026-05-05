'use client'

import { useCartStore } from '@/lib/cart-store'
import { useState } from 'react'

interface AddToCartButtonProps {
  productId: string
  title: string
  price: number
  slug: string
  image: string | null
  inStock: boolean
}

export function AddToCartButton({ productId, title, price, slug, image, inStock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem({
      productId,
      variantIndex: null,
      title,
      price,
      quantity,
      image,
      slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium">Quantity:</label>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center border-x py-2"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!inStock}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          !inStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : added
              ? 'bg-green-600 text-white'
              : 'btn-primary'
        }`}
      >
        {!inStock ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  )
}
