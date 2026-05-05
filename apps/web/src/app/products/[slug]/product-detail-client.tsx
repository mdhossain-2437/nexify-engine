'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { StorefrontProduct } from '@nexify/types'
import { mediaUrl } from '@nexify/types'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/format'
import { WishlistButton } from '@/components/wishlist-button'

interface ProductDetailClientProps {
  product: StorefrontProduct
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = useMemo(
    () =>
      (product.images ?? [])
        .map((img) => ({ url: mediaUrl(img.image), alt: img.alt || product.title }))
        .filter((img): img is { url: string; alt: string } => Boolean(img.url)),
    [product.images, product.title],
  )

  const [activeImage, setActiveImage] = useState(0)
  const [variantIndex, setVariantIndex] = useState<number | null>(
    (product.variants?.length ?? 0) > 0 ? 0 : null,
  )
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const variant = variantIndex !== null ? product.variants?.[variantIndex] : undefined
  const variantStock = variant?.stock ?? null
  const stock = variantStock ?? product.stock
  const inStock = stock > 0

  const basePrice = product.salePrice ?? product.price
  const currentPrice = basePrice + (variant?.priceModifier ?? 0)
  const onSale = typeof product.salePrice === 'number' && product.salePrice < product.price
  const discountPct = onSale
    ? Math.round(((product.price - (product.salePrice ?? product.price)) / product.price) * 100)
    : 0

  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem({
      productId: String(product.id),
      variantIndex,
      title: variant?.name ? `${product.title} — ${variant.name}` : product.title,
      price: currentPrice,
      quantity,
      image: images[0]?.url ?? null,
      slug: product.slug,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  const handleQuantity = (next: number) => {
    if (Number.isNaN(next)) return
    const clamped = Math.max(1, Math.min(stock || next, next))
    setQuantity(clamped)
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      <section aria-label="Product gallery">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
          {images[activeImage] ? (
            <Image
              src={images[activeImage].url}
              alt={images[activeImage].alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <PlaceholderIcon />
          )}
          {onSale && (
            <span className="absolute left-3 top-3 rounded bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              -{discountPct}%
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={`${img.url}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Show image ${i + 1}`}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  i === activeImage ? 'border-primary' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <section aria-label="Product details">
        {product.category?.name && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {product.category.name}
          </p>
        )}
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{product.title}</h1>

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
          {onSale && (
            <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
          {onSale && (
            <span className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-700">
              {discountPct}% OFF
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              inStock ? 'bg-emerald-500' : 'bg-red-500'
            }`}
            aria-hidden
          />
          <span className={`text-sm font-medium ${inStock ? 'text-emerald-700' : 'text-red-700'}`}>
            {inStock ? `${stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {product.sku && (
          <p className="mt-2 text-sm text-gray-500">
            SKU: <span className="font-mono">{variant?.sku ?? product.sku}</span>
          </p>
        )}

        {product.variants && product.variants.length > 0 && (
          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-semibold text-gray-700">Variants</legend>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={`${v.name}-${i}`}
                  type="button"
                  onClick={() => setVariantIndex(i)}
                  aria-pressed={variantIndex === i}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    variantIndex === i
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {v.name}
                  {v.color ? ` — ${v.color}` : ''}
                  {v.size ? ` (${v.size})` : ''}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-6 flex items-center gap-4">
          <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-gray-200">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => handleQuantity(quantity - 1)}
              className="px-3 text-gray-600 transition-colors hover:bg-gray-50"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min={1}
              max={stock || undefined}
              value={quantity}
              onChange={(e) => handleQuantity(Number.parseInt(e.target.value, 10) || 1)}
              className="w-14 border-x border-gray-200 px-2 text-center text-sm focus:outline-none"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => handleQuantity(quantity + 1)}
              className="px-3 text-gray-600 transition-colors hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inStock}
            className={`flex-1 rounded-xl py-4 text-base font-semibold transition-all ${
              !inStock
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            {!inStock ? 'Out of stock' : added ? 'Added to cart!' : 'Add to cart'}
          </button>
          <WishlistButton productId={product.id} className="shrink-0" />
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((t, i) => (
              <span
                key={`${t.tag}-${i}`}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
              >
                #{t.tag}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function PlaceholderIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center text-gray-300">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-20 w-20">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  )
}
