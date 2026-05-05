/**
 * Storefront-facing payload-shaped types.
 *
 * These intentionally mirror the wire shape returned by the Payload REST API
 * (where relations are objects, uploads have `url`, etc.) rather than the
 * normalized internal `Product` / `BlogPost` types in this package — those are
 * better suited to admin/server code that re-normalizes before persisting.
 */

import type { ProductStatus } from './product'

export type StorefrontBlogStatus = 'draft' | 'published'

export interface MediaRef {
  url?: string
  alt?: string | null
  filename?: string
  mimeType?: string
}

export interface ProductImage {
  image?: MediaRef | string | null
  alt?: string | null
}

export interface ProductVariantWire {
  name: string
  color?: string | null
  size?: string | null
  priceModifier?: number | null
  stock?: number | null
  sku?: string | null
}

export interface ProductSEO {
  title?: string | null
  description?: string | null
}

export interface CategoryRef {
  id?: string | number
  name?: string
  slug?: string
}

export interface StorefrontProduct {
  id: string | number
  title: string
  slug: string
  price: number
  salePrice?: number | null
  stock: number
  sku?: string | null
  status: ProductStatus
  featured?: boolean
  category?: CategoryRef | null
  images?: ProductImage[]
  variants?: ProductVariantWire[]
  tags?: { tag: string }[]
  seo?: ProductSEO
  description?: unknown
  createdAt?: string
  updatedAt?: string
}

export interface StorefrontBlogPost {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  content?: unknown
  featuredImage?: MediaRef | string | null
  author?: { name?: string; email?: string } | string | null
  tags?: { tag: string }[]
  status: StorefrontBlogStatus
  publishedAt?: string | null
  seo?: ProductSEO
  createdAt?: string
  updatedAt?: string
}

export interface StorefrontCategory {
  id: string | number
  name: string
  slug: string
  description?: string | null
  parent?: { id: string | number; name?: string } | string | number | null
  image?: MediaRef | string | null
}

export interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number | null
  prevPage?: number | null
}

/** Helper: pull a usable URL out of a `MediaRef | string | null | undefined`. */
export function mediaUrl(input: MediaRef | string | null | undefined): string | null {
  if (!input) return null
  if (typeof input === 'string') return input
  return input.url ?? null
}
