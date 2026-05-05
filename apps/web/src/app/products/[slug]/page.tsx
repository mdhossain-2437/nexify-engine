import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { AddToCartButton } from './add-to-cart-button'
import { JsonLd } from '@/components/json-ld'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema-markup'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3001'
    const res = await fetch(
      `${apiUrl}/api/products?where[slug][equals]=${slug}&where[status][equals]=published&depth=2&limit=1`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.seo?.title || `${product.title} | Nexify Engine`,
    description: product.seo?.description || `Buy ${product.title} at the best price.`,
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || `Buy ${product.title}`,
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price
  const currentPrice = hasDiscount ? product.salePrice : product.price
  const images = product.images || []

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">Nexify Engine</Link>
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-primary">Products</Link>
            <Link href="/cart" className="text-gray-600 hover:text-primary">Cart</Link>
          </div>
        </div>
      </nav>

      <JsonLd data={generateProductSchema({
        title: product.title,
        slug: product.slug,
        description: product.seo?.description || product.title,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        sku: product.sku,
        images: product.images,
        category: product.category,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
        { name: 'Products', url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products` },
        { name: product.title, url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/${product.slug}` },
      ])} />

      <main className="container-custom section-padding">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {images[0]?.image?.url ? (
                <img
                  src={images[0].image.url}
                  alt={images[0].alt || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.slice(0, 4).map((img: Record<string, unknown>, i: number) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {(img.image as Record<string, unknown>)?.url && (
                      <img
                        src={(img.image as Record<string, unknown>).url as string}
                        alt={(img.alt as string) || `${product.title} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category?.name && (
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.category.name}
              </p>
            )}
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                ${currentPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className={`inline-block w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.stock > 0 ? 'text-green-700' : 'text-red-700'}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.sku && (
              <p className="text-sm text-gray-500 mb-6">SKU: {product.sku}</p>
            )}

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-6 space-y-4">
                <h3 className="font-semibold">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: Record<string, unknown>, i: number) => (
                    <button
                      key={i}
                      className="px-4 py-2 border rounded-lg hover:border-primary transition-colors text-sm"
                    >
                      {variant.name as string}
                      {variant.color && ` - ${variant.color}`}
                      {variant.size && ` (${variant.size})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AddToCartButton
              productId={product.id}
              title={product.title}
              price={currentPrice}
              slug={product.slug}
              image={images[0]?.image?.url || null}
              inStock={product.stock > 0}
            />

            {product.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((t: { tag: string }, i: number) => (
                  <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {t.tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
