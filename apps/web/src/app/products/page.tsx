import Link from 'next/link'
import { Pagination } from '@/components/pagination'
import { ProductCard } from '@/components/product-card'
import { SearchBar } from '@/components/search-bar'
import { listCategories, listProducts } from '@/lib/api'

export const metadata = {
  title: 'Products',
  description: 'Browse the full catalog.',
}

interface ProductsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const PAGE_SIZE = 12

function param(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = (await searchParams) ?? {}
  const query = param(sp.q)?.trim() || undefined
  const category = param(sp.category) || undefined
  const sort = param(sp.sort) || '-createdAt'
  const page = Math.max(1, Number(param(sp.page) ?? '1') || 1)
  const featured = param(sp.featured) === 'true' || undefined

  const [productsResponse, categories] = await Promise.all([
    listProducts({
      query,
      category,
      sort,
      featured,
      page,
      limit: PAGE_SIZE,
    }),
    listCategories(),
  ])

  const products = productsResponse.docs
  const totalPages = productsResponse.totalPages || 1
  const totalDocs = productsResponse.totalDocs

  const buildHref = (next: Partial<{ category?: string; q?: string; sort?: string; featured?: string }>) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (sort && sort !== '-createdAt') params.set('sort', sort)
    if (featured) params.set('featured', 'true')
    for (const [key, value] of Object.entries(next)) {
      if (value === undefined) params.delete(key)
      else params.set(key, value)
    }
    const qs = params.toString()
    return `/products${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="container-custom section-padding">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalDocs > 0
              ? `${totalDocs} product${totalDocs === 1 ? '' : 's'}${query ? ` matching "${query}"` : ''}`
              : 'No products available yet.'}
          </p>
        </div>
        <div className="md:w-80">
          <SearchBar />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-8">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Categories</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href={buildHref({ category: undefined })}
                  className={`block rounded-md px-3 py-1.5 transition-colors ${
                    !category ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All categories
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={buildHref({ category: cat.slug })}
                    className={`block rounded-md px-3 py-1.5 transition-colors ${
                      category === cat.slug ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Sort</h2>
            <ul className="space-y-1 text-sm">
              {SORT_OPTIONS.map((option) => (
                <li key={option.value}>
                  <Link
                    href={buildHref({ sort: option.value === '-createdAt' ? undefined : option.value })}
                    className={`block rounded-md px-3 py-1.5 transition-colors ${
                      sort === option.value ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-lg font-medium text-gray-700">
                {query ? `No products match "${query}".` : 'No products available yet.'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Try a different search term, or clear filters.
              </p>
              {(query || category || featured) && (
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Clear all filters →
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 3} />
                ))}
              </div>
              <Pagination
                basePath="/products"
                page={page}
                totalPages={totalPages}
                searchParams={{
                  q: query,
                  category,
                  sort: sort === '-createdAt' ? undefined : sort,
                  featured: featured ? 'true' : undefined,
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
  { value: 'price', label: 'Price — low to high' },
  { value: '-price', label: 'Price — high to low' },
  { value: 'title', label: 'A to Z' },
  { value: '-title', label: 'Z to A' },
] as const
