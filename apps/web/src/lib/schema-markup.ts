const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface ProductSchemaInput {
  title: string
  slug: string
  description?: string
  price: number
  salePrice?: number | null
  stock?: number
  sku?: string
  images?: Array<{ image?: { url?: string }; alt?: string }>
  category?: { name?: string } | null
}

export function generateProductSchema(product: ProductSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    url: `${APP_URL}/products/${product.slug}`,
    description: product.description || product.title,
    sku: product.sku || product.slug,
    image: product.images
      ?.map((img) => img.image?.url)
      .filter(Boolean) || [],
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.salePrice || product.price,
      availability:
        (product.stock ?? 0) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${APP_URL}/products/${product.slug}`,
    },
  }
}

interface BlogPostSchemaInput {
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  updatedAt?: string
  author?: { name?: string } | null
  featuredImage?: { url?: string } | null
}

export function generateBlogPostSchema(post: BlogPostSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${APP_URL}/blog/${post.slug}`,
    description: post.excerpt || post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: post.author?.name
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : undefined,
    image: post.featuredImage?.url,
  }
}

interface WebsiteSchemaInput {
  siteName: string
  siteDescription?: string
}

export function generateWebsiteSchema(site: WebsiteSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.siteName,
    url: APP_URL,
    description: site.siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
