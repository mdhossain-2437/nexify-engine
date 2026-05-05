import Link from 'next/link'

export const metadata = {
  title: 'Blog | Nexify Engine',
  description: 'Read our latest articles and news',
}

async function getBlogPosts() {
  try {
    const apiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3001'
    const res = await fetch(
      `${apiUrl}/api/blog-posts?where[status][equals]=published&depth=2&limit=12&sort=-publishedAt`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">Nexify Engine</Link>
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-primary">Products</Link>
            <Link href="/blog" className="font-medium text-primary">Blog</Link>
            <Link href="/cart" className="text-gray-600 hover:text-primary">Cart</Link>
          </div>
        </div>
      </nav>

      <main className="container-custom section-padding">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No blog posts yet.</p>
            <p className="text-gray-400">Blog posts will appear here once published via the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: Record<string, unknown>) => (
              <Link
                key={post.id as string}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  {(post.featuredImage as Record<string, unknown>)?.url ? (
                    <img
                      src={(post.featuredImage as Record<string, unknown>).url as string}
                      alt={post.title as string}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-2">
                    {post.title as string}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt as string}</p>
                  )}
                  {post.publishedAt && (
                    <p className="text-gray-400 text-xs mt-3">
                      {new Date(post.publishedAt as string).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
