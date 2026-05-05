import Link from 'next/link'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-900 text-gray-300">
      <div className="container-custom grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="mb-3 text-lg font-bold text-white">Nexify Engine</h4>
          <p className="text-sm leading-relaxed text-gray-400">
            Modern multi-tenant CMS and ecommerce platform built with Next.js, Payload CMS, and PostgreSQL.
          </p>
        </div>
        <div>
          <h5 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Shop</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-white">All products</Link></li>
            <li><Link href="/products?featured=true" className="hover:text-white">Featured</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Company</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Legal</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container-custom flex flex-col items-center justify-between gap-2 py-5 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {year} Nexify Engine. All rights reserved.</p>
          <p>
            Powered by{' '}
            <a
              href="https://payloadcms.com"
              className="hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              Payload CMS
            </a>{' '}
            &amp;{' '}
            <a
              href="https://nextjs.org"
              className="hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
