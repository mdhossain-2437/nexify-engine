import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { ProductCard } from '@/components/product-card'
import { listProducts, listCategories } from '@/lib/api'
import { generateWebsiteSchema } from '@/lib/schema-markup'
import { NewsletterForm } from '@/components/newsletter-form'

export const revalidate = 60

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Boutique Owner',
    content:
      'Nexify Engine transformed how I run my online store. The multi-tenant setup means I manage everything from one dashboard. Sales went up 40% in the first month.',
    rating: 5,
  },
  {
    name: 'Ahmed Hassan',
    role: 'Electronics Retailer',
    content:
      'The best ecommerce platform I have used. Lightning fast, beautiful themes, and the checkout conversion rate is incredible. My customers love the experience.',
    rating: 5,
  },
  {
    name: 'Maria Chen',
    role: 'Home & Garden Store',
    content:
      'Setting up was a breeze. Within a day I had a fully functional store with payments, inventory tracking, and beautiful product pages. Highly recommended!',
    rating: 5,
  },
] as const

const TRUST_BADGES = [
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure Checkout', desc: '256-bit SSL encryption' },
  { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'Safe Payment', desc: 'All major cards accepted' },
  { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', label: 'Free Shipping', desc: 'On orders over $50' },
  { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Easy Returns', desc: '30-day return policy' },
] as const

const BRAND_FEATURES = [
  {
    title: 'Lightning Fast',
    description: 'Server-side rendered pages with edge caching deliver sub-100ms load times.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'SEO Optimized',
    description: 'Built-in structured data, sitemaps, and meta tags so customers find you on Google.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    title: 'Mobile First',
    description: 'Responsive design that looks stunning on every device, from phones to desktops.',
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    title: 'Secure Payments',
    description: 'PCI-compliant Stripe integration with fraud protection and instant payouts.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    title: 'Inventory Management',
    description: 'Real-time stock tracking, low-stock alerts, and variant management built in.',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track revenue, conversion rates, top products, and customer behavior in real time.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
] as const

export default async function HomePage() {
  const [featuredResponse, newArrivalsResponse, categories] = await Promise.all([
    listProducts({ featured: true, limit: 8 }),
    listProducts({ limit: 8, sort: '-createdAt' }),
    listCategories(),
  ])
  const featuredProducts = featuredResponse.docs
  const newArrivals = newArrivalsResponse.docs

  return (
    <>
      <JsonLd
        data={generateWebsiteSchema({
          siteName: 'Nexify Engine',
          siteDescription: 'Modern multi-tenant CMS and ecommerce platform.',
        })}
      />

      {/* Promo Banner */}
      <div className="bg-gray-900 text-white">
        <div className="container-custom flex items-center justify-center gap-2 py-2 text-xs sm:text-sm">
          <span className="font-medium">Free shipping on orders over $50</span>
          <span className="text-gray-400">|</span>
          <span>Use code <strong className="text-amber-400">WELCOME10</strong> for 10% off your first order</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.5), transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.4), transparent 40%), radial-gradient(circle at 60% 80%, rgba(147, 51, 234, 0.3), transparent 40%)',
          }}
        />
        <div className="container-custom relative py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                New Collection 2025
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Discover Products
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  You&apos;ll Love
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-blue-100/80">
                Shop the latest trends with fast shipping, secure payments, and a 30-day money-back guarantee. Your perfect shopping experience starts here.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-gray-900 shadow-lg shadow-white/10 transition-all hover:shadow-white/20 hover:scale-[1.02]"
                >
                  Shop Now
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Featured Items
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-8 text-sm text-blue-200/70">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 Support
                </div>
              </div>
            </div>
            <div className="hidden lg:flex lg:justify-end">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="h-48 w-48 rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 backdrop-blur border border-white/10 flex items-center justify-center">
                      <svg className="h-16 w-16 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="h-32 w-48 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-600/30 backdrop-blur border border-white/10 flex items-center justify-center">
                      <svg className="h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="h-32 w-48 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-600/30 backdrop-blur border border-white/10 flex items-center justify-center">
                      <svg className="h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="h-48 w-48 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-600/30 backdrop-blur border border-white/10 flex items-center justify-center">
                      <svg className="h-16 w-16 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-custom grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{badge.label}</p>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Browse</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {categories.slice(0, 6).map((cat, i) => {
                const gradients = [
                  'from-blue-500 to-indigo-600',
                  'from-rose-500 to-pink-600',
                  'from-amber-500 to-orange-600',
                  'from-emerald-500 to-teal-600',
                  'from-purple-500 to-violet-600',
                  'from-sky-500 to-cyan-600',
                ]
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="group relative overflow-hidden rounded-2xl"
                  >
                    <div className={`aspect-square bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <svg className="h-12 w-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-sm font-semibold text-white">{cat.name}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Curated</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">Featured Products</h2>
              </div>
              <Link href="/products?featured=true" className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex items-center gap-1">
                View all
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 8).map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 2} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/products?featured=true" className="btn-outline text-sm">
                View all featured
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Promotion Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />
        <div className="container-custom relative flex flex-col items-center gap-6 py-16 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-white/80">Limited Time Offer</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Up to 30% Off on New Arrivals</h2>
            <p className="mt-2 text-lg text-white/80">Don&apos;t miss out on our biggest sale of the season.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-indigo-700 shadow-lg transition-transform hover:scale-105"
          >
            Shop the Sale
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Fresh</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">New Arrivals</h2>
              </div>
              <Link href="/products" className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex items-center gap-1">
                View all
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">Built for Modern Commerce</h2>
            <p className="mt-3 text-gray-600">
              Everything you need to run a successful online store, powered by cutting-edge technology.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BRAND_FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Testimonials</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">Loved by Store Owners</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg key={i} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gray-900 text-white">
        <div className="container-custom py-16 text-center">
          <h2 className="text-3xl font-bold">Stay in the Loop</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-400">
            Subscribe to get exclusive deals, new arrival alerts, and style tips delivered to your inbox.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm />
          </div>
          <p className="mt-4 text-xs text-gray-500">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  )
}
