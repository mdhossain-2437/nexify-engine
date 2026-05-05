import Link from 'next/link'

export const metadata = {
  title: 'Products | Nexify Engine',
  description: 'Browse our product catalog',
}

interface Product {
  id: string
  title: string
  slug: string
  price: number
  salePrice?: number | null
  images?: Array<{ image?: { url?: string }; alt?: string }>
  category?: { name?: string }
}

async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3001'
    const res = await fetch(
      `${apiUrl}/api/products?where[status][equals]=published&depth=2&limit=24`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">Nexify Engine</Link>
          <div className="flex items-center gap-6">
            <Link href="/products" className="font-medium text-primary">Products</Link>
            <Link href="/blog" className="text-gray-600 hover:text-primary">Blog</Link>
            <Link href="/cart" className="text-gray-600 hover:text-primary">Cart</Link>
          </div>
        </div>
      </nav>

      <main className="container-custom section-padding">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No products available yet.</p>
            <p className="text-gray-400">Products will appear here once they are added via the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {product.images?.[0]?.image?.url ? (
                    <img
                      src={product.images[0].image.url}
                      alt={product.images[0].alt || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.salePrice && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                </div>
                <div className="p-4">
                  {product.category?.name && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.category.name}
                    </p>
                  )}
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    {product.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          ${product.salePrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
