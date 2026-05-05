const API_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...fetchOptions } = options || {}
  const searchParams = new URLSearchParams(params)
  const queryString = searchParams.toString()
  const url = `${API_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getTenant(subdomain: string) {
  const data = await fetchAPI<PayloadResponse<Record<string, unknown>>>('/tenants', {
    params: {
      'where[subdomain][equals]': subdomain,
      depth: '1',
      limit: '1',
    },
    next: { revalidate: 60 },
  })
  return data.docs[0] || null
}

export async function getTenantByDomain(domain: string) {
  const data = await fetchAPI<PayloadResponse<Record<string, unknown>>>('/tenants', {
    params: {
      'where[customDomain][equals]': domain,
      depth: '1',
      limit: '1',
    },
    next: { revalidate: 60 },
  })
  return data.docs[0] || null
}

export async function getProducts(tenantId: string, options?: {
  category?: string
  featured?: boolean
  limit?: number
  page?: number
  sort?: string
}) {
  const params: Record<string, string> = {
    'where[tenant][equals]': tenantId,
    'where[status][equals]': 'published',
    depth: '2',
    limit: String(options?.limit || 12),
    page: String(options?.page || 1),
  }

  if (options?.category) {
    params['where[category][equals]'] = options.category
  }
  if (options?.featured) {
    params['where[featured][equals]'] = 'true'
  }
  if (options?.sort) {
    params.sort = options.sort
  }

  return fetchAPI<PayloadResponse<Record<string, unknown>>>('/products', {
    params,
    next: { revalidate: 30 },
  })
}

export async function getProduct(tenantId: string, slug: string) {
  const data = await fetchAPI<PayloadResponse<Record<string, unknown>>>('/products', {
    params: {
      'where[tenant][equals]': tenantId,
      'where[slug][equals]': slug,
      depth: '2',
      limit: '1',
    },
    next: { revalidate: 30 },
  })
  return data.docs[0] || null
}

export async function getCategories(tenantId: string) {
  return fetchAPI<PayloadResponse<Record<string, unknown>>>('/categories', {
    params: {
      'where[tenant][equals]': tenantId,
      depth: '1',
      limit: '100',
    },
    next: { revalidate: 60 },
  })
}

export async function getPage(tenantId: string, slug: string) {
  const data = await fetchAPI<PayloadResponse<Record<string, unknown>>>('/pages', {
    params: {
      'where[tenant][equals]': tenantId,
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      depth: '2',
      limit: '1',
    },
    next: { revalidate: 60 },
  })
  return data.docs[0] || null
}

export async function getBlogPosts(tenantId: string, options?: {
  limit?: number
  page?: number
  tag?: string
}) {
  const params: Record<string, string> = {
    'where[tenant][equals]': tenantId,
    'where[status][equals]': 'published',
    depth: '2',
    limit: String(options?.limit || 10),
    page: String(options?.page || 1),
    sort: '-publishedAt',
  }

  if (options?.tag) {
    params['where[tags.tag][equals]'] = options.tag
  }

  return fetchAPI<PayloadResponse<Record<string, unknown>>>('/blog-posts', {
    params,
    next: { revalidate: 30 },
  })
}

export async function getBlogPost(tenantId: string, slug: string) {
  const data = await fetchAPI<PayloadResponse<Record<string, unknown>>>('/blog-posts', {
    params: {
      'where[tenant][equals]': tenantId,
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      depth: '2',
      limit: '1',
    },
    next: { revalidate: 30 },
  })
  return data.docs[0] || null
}
