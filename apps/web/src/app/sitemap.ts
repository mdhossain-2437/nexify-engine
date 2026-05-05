import type { MetadataRoute } from 'next'

const API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3001'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface Doc {
  slug: string
  updatedAt?: string
  createdAt?: string
}

async function fetchDocs(collection: string): Promise<Doc[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/${collection}?where[status][equals]=published&limit=1000&depth=0`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, pages, blogPosts] = await Promise.all([
    fetchDocs('products'),
    fetchDocs('pages'),
    fetchDocs('blog-posts'),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${APP_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${APP_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${APP_URL}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const cmsPages: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${APP_URL}/${page.slug}`,
    lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...cmsPages, ...blogPages]
}
