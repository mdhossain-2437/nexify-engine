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

type Tab = 'description' | 'details' | 'shipping'

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
  const [activeTab, setActiveTab] = useState<Tab>('description')

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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Product Details' },
    { id: 'shipping', label: 'Shipping & Returns' },
  ]

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
        {/* Gallery */}
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
              <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
                -{discountPct}%
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                    i === activeImage
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="100px"
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Product Info */}
        <section aria-label="Product details">
          {product.category?.name && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              {product.category.name}
            </p>
          )}
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{product.title}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
            {onSale && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
            {onSale && (
              <span className="rounded-lg bg-red-50 px-2.5 py-1 text-sm font-semibold text-red-600">
                Save {discountPct}%
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

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-semibold text-gray-700">Select Option</legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={`${v.name}-${i}`}
                    type="button"
                    onClick={() => setVariantIndex(i)}
                    aria-pressed={variantIndex === i}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      variantIndex === i
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
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

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="inline-flex items-stretch overflow-hidden rounded-xl border border-gray-200">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => handleQuantity(quantity - 1)}
                className="px-3.5 py-2.5 text-gray-600 transition-colors hover:bg-gray-50"
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
                className="px-3.5 py-2.5 text-gray-600 transition-colors hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
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
                    : 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:opacity-95'
              }`}
            >
              {!inStock ? 'Out of stock' : added ? 'Added to cart!' : 'Add to Cart'}
            </button>
            <WishlistButton productId={product.id} className="shrink-0" />
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', label: 'Free Shipping' },
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: '30-Day Returns' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure Payment' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-gray-50 p-3 text-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="text-[11px] font-medium text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
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

      {/* Tabs Section */}
      <div className="mt-12 border-t border-gray-100 pt-8">
        <div className="flex gap-6 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>{typeof product.description === 'string' ? product.description : 'No description available for this product.'}</p>
            </div>
          )}
          {activeTab === 'details' && (
            <div className="space-y-3 text-sm text-gray-600">
              {product.sku && (
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="font-medium text-gray-700">SKU</span>
                  <span className="font-mono">{product.sku}</span>
                </div>
              )}
              {product.category?.name && (
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="font-medium text-gray-700">Category</span>
                  <span>{product.category.name}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="font-medium text-gray-700">Availability</span>
                <span className={inStock ? 'text-emerald-600' : 'text-red-600'}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              {product.variants && product.variants.length > 0 && (
                <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="font-medium text-gray-700">Variants</span>
                  <span>{product.variants.length} options available</span>
                </div>
              )}
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900">Shipping</h4>
                <ul className="mt-2 space-y-1">
                  <li>Free standard shipping on orders over $50</li>
                  <li>Standard shipping (3-5 business days): $4.99</li>
                  <li>Express shipping (1-2 business days): $9.99</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Returns</h4>
                <ul className="mt-2 space-y-1">
                  <li>30-day return policy for unused items</li>
                  <li>Free returns on all orders</li>
                  <li>Refund processed within 5-7 business days</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
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
