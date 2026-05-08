import Link from 'next/link'

const PAYMENT_METHODS = ['Visa', 'MasterCard', 'Amex', 'PayPal', 'Stripe'] as const

const SOCIAL_LINKS = [
  { name: 'Facebook', href: '#', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { name: 'Twitter', href: '#', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { name: 'Instagram', href: '#', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z' },
] as const

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-900 text-gray-300">
      <div className="container-custom grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path d="M9 22V10l7 6 7-6v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            NexifyStore
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
            Your one-stop shop for quality products. Fast shipping, secure payments, and exceptional customer service.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                aria-label={social.name}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h5 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Shop</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/products" className="transition-colors hover:text-white">All Products</Link></li>
            <li><Link href="/products?featured=true" className="transition-colors hover:text-white">Featured</Link></li>
            <li><Link href="/products?sort=price" className="transition-colors hover:text-white">Best Deals</Link></li>
            <li><Link href="/cart" className="transition-colors hover:text-white">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Company</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="transition-colors hover:text-white">About Us</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-white">Blog</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Support</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-white">Help Center</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-gray-500">&copy; {year} NexifyStore. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">We accept:</span>
            <div className="flex gap-2">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="rounded bg-gray-800 px-2 py-1 text-[10px] font-medium text-gray-400"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
