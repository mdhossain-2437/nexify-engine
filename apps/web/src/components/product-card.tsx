import Link from 'next/link'
import Image from 'next/image'
import type { StorefrontProduct } from '@nexify/types'
import { mediaUrl } from '@nexify/types'
import { formatPrice } from '@/lib/format'

interface ProductCardProps {
  product: StorefrontProduct
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const firstImage = product.images?.[0]
  const imageUrl = firstImage ? mediaUrl(firstImage.image) : null
  const altText = firstImage?.alt || product.title
  const onSale = typeof product.salePrice === 'number' && product.salePrice < product.price
  const discountPct = onSale
    ? Math.round(((product.price - (product.salePrice ?? product.price)) / product.price) * 100)
    : 0

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <PlaceholderIcon />
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {onSale && (
            <span className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              -{discountPct}%
            </span>
          )}
          {product.featured && (
            <span className="rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-gray-900 shadow-sm">
              Featured
            </span>
          )}
        </div>
        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-2 left-2 rounded-lg bg-orange-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {product.category?.name && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {product.category.name}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          {onSale ? (
            <>
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function PlaceholderIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-12 w-12">
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
