import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <nav className="container-custom py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Nexify Engine</h1>
          <div className="flex items-center gap-6">
            <Link href="/products" className="hover:text-blue-200 transition-colors">
              Products
            </Link>
            <Link href="/blog" className="hover:text-blue-200 transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-blue-200 transition-colors">
              Contact
            </Link>
            <Link href="/cart" className="hover:text-blue-200 transition-colors">
              Cart
            </Link>
          </div>
        </nav>

        <div className="container-custom py-20 md:py-32 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Modern Multi-Tenant
            <br />
            CMS & Ecommerce Platform
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Build and manage multiple online stores from one powerful platform.
            SEO-friendly, blazing fast, and easy to customize.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn-primary bg-white text-blue-700 hover:bg-blue-50">
              Browse Products
            </Link>
            <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-blue-700">
              Learn More
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h3 className="text-3xl font-bold text-center mb-12">Why Nexify Engine?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Multi-Tenant Architecture"
              description="Manage multiple stores from a single dashboard. Each tenant gets their own storefront, products, and settings."
              icon="🏢"
            />
            <FeatureCard
              title="SEO Optimized"
              description="Built with Next.js for server-side rendering, dynamic meta tags, sitemaps, and schema markup."
              icon="🔍"
            />
            <FeatureCard
              title="Lightning Fast"
              description="Static generation, incremental regeneration, and edge caching for sub-100ms page loads."
              icon="⚡"
            />
            <FeatureCard
              title="Easy Content Management"
              description="Block-based page builder, rich text editor, and media library for effortless content creation."
              icon="📝"
            />
            <FeatureCard
              title="Full Commerce Suite"
              description="Products, variants, categories, orders, payments, coupons — everything you need to sell online."
              icon="🛒"
            />
            <FeatureCard
              title="Customizable Themes"
              description="Per-tenant theme configuration with colors, fonts, layouts, and branding options."
              icon="🎨"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-blue-600 text-white text-center">
        <div className="container-custom">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Launch your multi-tenant ecommerce platform today.
          </p>
          <Link href="/contact" className="btn-primary bg-white text-blue-700 hover:bg-blue-50">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Nexify Engine</h4>
              <p className="text-sm">
                Modern multi-tenant CMS and ecommerce platform
                built with Next.js, Payload CMS, and PostgreSQL.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">Contact</h5>
              <ul className="space-y-2 text-sm">
                <li>support@nexify.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Nexify Engine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
