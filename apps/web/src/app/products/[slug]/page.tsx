import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { StorefrontProduct } from '@nexify/types'
import { mediaUrl } from '@nexify/types'
import { ProductDetailClient } from './product-detail-client'
import { ProductCard } from '@/components/product-card'
import { JsonLd } from '@/components/json-ld'
import { getProduct, listProducts } from '@/lib/api'
import { generateBreadcrumbSchema, generateProductSchema } from '@/lib/schema-markup'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

function descriptionFromProduct(product: StorefrontProduct): string {
  return (
    product.seo?.description?.trim() || `Buy ${product.title} at the best price on Nexify Engine.`
  )
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product not found' }

  const description = descriptionFromProduct(product)
  const firstImage = product.images?.[0]
  const ogImage = firstImage ? mediaUrl(firstImage.image) : null

  return {
    title: product.seo?.title || product.title,
    description,
    openGraph: {
      title: product.seo?.title || product.title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo?.title || product.title,
      description,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const categorySlug = product.category?.slug
  const relatedResponse = categorySlug
    ? await listProducts({ category: categorySlug, limit: 4 })
    : null
  const relatedProducts = (relatedResponse?.docs ?? []).filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <div className="container-custom section-padding">
      <JsonLd
        data={generateProductSchema({
          title: product.title,
          slug: product.slug,
          description: descriptionFromProduct(product),
          price: product.price,
          salePrice: product.salePrice,
          stock: product.stock,
          sku: product.sku ?? undefined,
          images: product.images?.map((img) => ({
            image: typeof img.image === 'string' ? { url: img.image } : (img.image ?? undefined),
            alt: img.alt ?? undefined,
          })),
          category: product.category?.name ? { name: product.category.name } : null,
        })}
      />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: 'Home', url: APP_URL },
          { name: 'Products', url: `${APP_URL}/products` },
          { name: product.title, url: `${APP_URL}/products/${product.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          </li>
          <li aria-hidden className="text-gray-300">/</li>
          <li>
            <Link href="/products" className="transition-colors hover:text-primary">Products</Link>
          </li>
          {product.category?.name && (
            <>
              <li aria-hidden className="text-gray-300">/</li>
              <li>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="transition-colors hover:text-primary"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden className="text-gray-300">/</li>
          <li className="font-medium text-gray-900">{product.title}</li>
        </ol>
      </nav>

      <ProductDetailClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-gray-100 pt-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">You may also like</p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">Related Products</h2>
            </div>
            {categorySlug && (
              <Link href={`/products?category=${categorySlug}`} className="text-sm font-medium text-primary hover:underline">
                View more
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
