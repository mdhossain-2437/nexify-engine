import type {
  PayloadListResponse,
  StorefrontBlogPost,
  StorefrontCategory,
  StorefrontProduct,
} from '@nexify/types'

const API_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface FetchOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>
  /** Override the default ISR revalidation (seconds). */
  revalidate?: number
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, revalidate = 30, ...fetchOptions } = options
  const search = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  const url = `${API_URL}/api${endpoint}${qs ? `?${qs}` : ''}`

  const res = await fetch(url, {
    ...fetchOptions,
    next: { revalidate, ...(fetchOptions.next ?? {}) },
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status} ${res.statusText} for ${endpoint}`)
  }
  return res.json() as Promise<T>
}

/** Swallow network/auth failures and return `null` so pages can render safely. */
async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

const emptyList = <T>(): PayloadListResponse<T> => ({
  docs: [],
  totalDocs: 0,
  totalPages: 0,
  page: 1,
  limit: 0,
  hasNextPage: false,
  hasPrevPage: false,
})

export interface ListProductsOptions {
  category?: string
  query?: string
  featured?: boolean
  limit?: number
  page?: number
  sort?: string
}

export async function listProducts(
  options: ListProductsOptions = {},
): Promise<PayloadListResponse<StorefrontProduct>> {
  const params: Record<string, string | number | boolean | undefined> = {
    'where[status][equals]': 'published',
    depth: 2,
    limit: options.limit ?? 12,
    page: options.page ?? 1,
    sort: options.sort ?? '-createdAt',
  }
  if (options.category) {
    params['where[category.slug][equals]'] = options.category
  }
  if (options.query) {
    params['where[title][like]'] = options.query
  }
  if (options.featured) {
    params['where[featured][equals]'] = true
  }

  const data = await safe(() =>
    fetchAPI<PayloadListResponse<StorefrontProduct>>('/products', { params }),
  )
  return data ?? emptyList<StorefrontProduct>()
}

export async function getProduct(slug: string): Promise<StorefrontProduct | null> {
  const data = await safe(() =>
    fetchAPI<PayloadListResponse<StorefrontProduct>>('/products', {
      params: {
        'where[slug][equals]': slug,
        'where[status][equals]': 'published',
        depth: 2,
        limit: 1,
      },
    }),
  )
  return data?.docs[0] ?? null
}

export async function listCategories(): Promise<StorefrontCategory[]> {
  const data = await safe(() =>
    fetchAPI<PayloadListResponse<StorefrontCategory>>('/categories', {
      params: { depth: 1, limit: 100 },
      revalidate: 300,
    }),
  )
  return data?.docs ?? []
}

export interface ListBlogOptions {
  limit?: number
  page?: number
  tag?: string
}

export async function listBlogPosts(
  options: ListBlogOptions = {},
): Promise<PayloadListResponse<StorefrontBlogPost>> {
  const params: Record<string, string | number | boolean | undefined> = {
    'where[status][equals]': 'published',
    depth: 2,
    limit: options.limit ?? 12,
    page: options.page ?? 1,
    sort: '-publishedAt',
  }
  if (options.tag) {
    params['where[tags.tag][equals]'] = options.tag
  }

  const data = await safe(() =>
    fetchAPI<PayloadListResponse<StorefrontBlogPost>>('/blog-posts', { params }),
  )
  return data ?? emptyList<StorefrontBlogPost>()
}

export async function getBlogPost(slug: string): Promise<StorefrontBlogPost | null> {
  const data = await safe(() =>
    fetchAPI<PayloadListResponse<StorefrontBlogPost>>('/blog-posts', {
      params: {
        'where[slug][equals]': slug,
        'where[status][equals]': 'published',
        depth: 2,
        limit: 1,
      },
    }),
  )
  return data?.docs[0] ?? null
}

export async function getPage(slug: string) {
  return safe(() =>
    fetchAPI<PayloadListResponse<Record<string, unknown>>>('/pages', {
      params: {
        'where[slug][equals]': slug,
        'where[status][equals]': 'published',
        depth: 2,
        limit: 1,
      },
    }).then((data) => data.docs[0] ?? null),
  )
}

export { API_URL }
