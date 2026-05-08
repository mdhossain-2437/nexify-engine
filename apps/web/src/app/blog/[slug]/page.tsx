import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { mediaUrl } from '@nexify/types'
import { JsonLd } from '@/components/json-ld'
import { RichTextRenderer } from '@/components/rich-text'
import { getBlogPost } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { generateBlogPostSchema, generateBreadcrumbSchema } from '@/lib/schema-markup'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Post not found' }

  const description = post.seo?.description || post.excerpt || post.title
  const image = mediaUrl(post.featuredImage)

  return {
    title: post.seo?.title || post.title,
    description,
    openGraph: {
      title: post.seo?.title || post.title,
      description,
      type: 'article',
      images: image ? [{ url: image }] : undefined,
      publishedTime: post.publishedAt ?? undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const image = mediaUrl(post.featuredImage)
  const authorName =
    typeof post.author === 'object' && post.author ? post.author.name || post.author.email : null

  return (
    <article className="container-custom max-w-3xl section-padding">
      <JsonLd
        data={generateBlogPostSchema({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? undefined,
          publishedAt: post.publishedAt ?? undefined,
          updatedAt: post.updatedAt,
          author: authorName ? { name: authorName } : null,
          featuredImage: image ? { url: image } : null,
        })}
      />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: 'Home', url: APP_URL },
          { name: 'Blog', url: `${APP_URL}/blog` },
          { name: post.title, url: `${APP_URL}/blog/${post.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <Link href="/blog" className="hover:text-primary">
          ← All posts
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
        {(post.publishedAt || authorName) && (
          <p className="mt-3 text-sm text-gray-500">
            {authorName && <span>{authorName}</span>}
            {authorName && post.publishedAt && <span> · </span>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            )}
          </p>
        )}
      </header>

      {image && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-50">
          <Image
            src={image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {post.excerpt && <p className="mb-8 text-lg leading-relaxed text-gray-600">{post.excerpt}</p>}

      <div className="prose-storefront">
        <RichTextRenderer content={post.content} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((t, i) => (
            <span
              key={`${t.tag}-${i}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
            >
              #{t.tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
