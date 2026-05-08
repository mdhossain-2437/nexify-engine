export interface BlogPost {
  id: string
  tenantId: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  author: string
  tags: string[]
  seoTitle: string | null
  seoDescription: string | null
  status: 'draft' | 'published'
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}
