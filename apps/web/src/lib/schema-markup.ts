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
    image: product.images?.map((img) => img.image?.url).filter(Boolean) || [],
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.salePrice || product.price,
      availability:
        (product.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
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

interface OrganizationSchemaInput {
  name: string
  description?: string
  logoUrl?: string
  contactEmail?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
  }
}

export function generateOrganizationSchema(org: OrganizationSchemaInput) {
  const sameAs = org.socialLinks
    ? Object.values(org.socialLinks).filter(Boolean)
    : []

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: APP_URL,
    description: org.description,
    logo: org.logoUrl,
    contactPoint: org.contactEmail
      ? {
          '@type': 'ContactPoint',
          email: org.contactEmail,
          contactType: 'customer service',
        }
      : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  }
}

interface FAQSchemaInput {
  questions: Array<{ question: string; answer: string }>
}

export function generateFAQSchema(faq: FAQSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

export function generateCollectionPageSchema(
  name: string,
  description: string,
  products: Array<{ title: string; slug: string; price: number; imageUrl?: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${APP_URL}/products`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${APP_URL}/products/${p.slug}`,
        name: p.title,
      })),
    },
  }
}
