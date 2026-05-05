import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { StorefrontProduct } from '@nexify/types'
import { mediaUrl } from '@nexify/types'
import { ProductDetailClient } from './product-detail-client'
import { JsonLd } from '@/components/json-ld'
import { getProduct } from '@/lib/api'
import { generateBreadcrumbSchema, generateProductSchema } from '@/lib/schema-markup'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

function descriptionFromProduct(product: StorefrontProduct): string {
  return product.seo?.description?.trim() || `Buy ${product.title} at the best price on Nexify Engine.`
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
            image: typeof img.image === 'string' ? { url: img.image } : img.image ?? undefined,
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

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-gray-900">{product.title}</li>
        </ol>
      </nav>

      <ProductDetailClient product={product} />
    </div>
  )
}
