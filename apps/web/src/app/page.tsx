import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { ProductCard } from '@/components/product-card'
import { listProducts } from '@/lib/api'
import { generateWebsiteSchema } from '@/lib/schema-markup'

export const revalidate = 60

const FEATURES = [
  {
    title: 'Multi-tenant by design',
    description:
      'Run dozens of stores from one Payload-powered admin. Per-tenant content, theming, and storage limits — out of the box.',
    icon: '🏢',
  },
  {
    title: 'SEO that just works',
    description:
      'Server-rendered metadata, JSON-LD product/breadcrumb/blog schemas, sitemap.xml, and robots.txt with zero config.',
    icon: '🔍',
  },
  {
    title: 'Blazing fast storefront',
    description:
      'Next.js 15 App Router, ISR, edge-cached static pages, and a hydration-safe cart that never blocks the first paint.',
    icon: '⚡',
  },
  {
    title: 'Block-based content',
    description:
      'Hero, product grid, banner, testimonials, FAQ, CTA — compose pages from typed Payload blocks without a developer.',
    icon: '🧩',
  },
  {
    title: 'Ecommerce essentials',
    description:
      'Products, variants, categories, orders, Stripe checkout, COD, payments tracking, invoices — all wired up.',
    icon: '🛒',
  },
  {
    title: 'Custom themes per tenant',
    description:
      'Each tenant ships with their own primary/secondary colors and typography, applied via CSS variables at runtime.',
    icon: '🎨',
  },
] as const

export default async function HomePage() {
  const featuredResponse = await listProducts({ featured: true, limit: 8 })
  const featuredProducts = featuredResponse.docs

  return (
    <>
      <JsonLd
        data={generateWebsiteSchema({
          siteName: 'Nexify Engine',
          siteDescription: 'Modern multi-tenant CMS and ecommerce platform.',
        })}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.3),transparent_40%)]"
        />
        <div className="container-custom relative py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              v0.1 — multi-tenant edition
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              The CMS &amp; ecommerce platform that scales{' '}
              <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
                from one to many.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 md:text-xl">
              Build, theme and operate dozens of online stores from one powerful platform. SEO-ready,
              blazing fast, fully typed, and easy to extend.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary bg-white !text-blue-700 hover:!bg-blue-50">
                Browse products
              </Link>
              <Link
                href="/about"
                className="btn-outline border-white text-white hover:bg-white hover:text-blue-700"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Featured</p>
                <h2 className="text-3xl font-bold">Top picks this week</h2>
              </div>
              <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Why Nexify Engine?</h2>
            <p className="mt-3 text-gray-600">
              A batteries-included foundation for SaaS commerce — without locking you in.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="text-3xl" aria-hidden>
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to launch your store?</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Spin up a tenant, customize the theme, drop in your products, and ship in an afternoon.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/contact" className="btn-primary bg-white !text-blue-700 hover:!bg-blue-50">
              Get in touch
            </Link>
            <Link href="/products" className="btn-outline border-white text-white hover:bg-white hover:!text-primary">
              Explore demo store
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
