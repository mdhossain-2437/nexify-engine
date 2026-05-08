import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { mediaUrl } from '@nexify/types'
import { Pagination } from '@/components/pagination'
import { listBlogPosts } from '@/lib/api'
import { formatDate } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, updates and stories from the Nexify Engine team.',
}

interface BlogPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const PAGE_SIZE = 9

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = (await searchParams) ?? {}
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const page = Math.max(1, Number(pageParam ?? '1') || 1)

  const response = await listBlogPosts({ page, limit: PAGE_SIZE })
  const posts = response.docs

  return (
    <div className="container-custom section-padding">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="mt-2 text-gray-500">Stories, updates, and lessons from the team.</p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center">
          <p className="text-lg font-medium text-gray-700">No posts yet.</p>
          <p className="mt-2 text-sm text-gray-500">Check back soon — we&apos;re writing.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => {
              const featured = mediaUrl(post.featuredImage)
              return (
                <article
                  key={post.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-lg"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[16/9] w-full bg-gray-50">
                      {featured ? (
                        <Image
                          src={featured}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={idx < 2}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="h-12 w-12"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h2 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>
                    )}
                    {post.publishedAt && (
                      <p className="mt-auto pt-2 text-xs text-gray-400">
                        {formatDate(post.publishedAt)}
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          <Pagination basePath="/blog" page={page} totalPages={response.totalPages || 1} />
        </>
      )}
    </div>
  )
}
