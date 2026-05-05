import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageBlocks } from '@/components/page-blocks'
import { getPage } from '@/lib/api'

interface CmsPageProps {
  params: Promise<{ slug: string }>
}

const RESERVED_SLUGS = new Set([
  'products',
  'product',
  'cart',
  'checkout',
  'order-confirmation',
  'blog',
  'about',
  'contact',
  'privacy',
  'terms',
  'admin',
  'api',
])

interface PayloadPage {
  title?: string
  slug?: string
  contentBlocks?: Array<Record<string, unknown>>
  seo?: { title?: string; description?: string }
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) return {}
  const page = (await getPage(slug)) as PayloadPage | null
  if (!page) return { title: 'Page not found' }
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
  }
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) notFound()
  const page = (await getPage(slug)) as PayloadPage | null
  if (!page) notFound()

  return (
    <article>
      <PageBlocks blocks={page.contentBlocks ?? []} />
    </article>
  )
}
