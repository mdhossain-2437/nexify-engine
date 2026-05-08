'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useState } from 'react'
import { CartBadge } from './cart-badge'
import { SearchBar } from './search-bar'
import { InstantSearch } from './instant-search'
import { UserMenu } from './user-menu'

function SearchBarFallback({ className }: { className?: string }) {
  return <div className={`h-10 w-full animate-pulse rounded-full bg-gray-100 ${className ?? ''}`} />
}

const NAV_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/products?featured=true', label: 'Featured' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

export function SiteHeader() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    const base = href.split('?')[0]
    if (base === '/') return pathname === '/'
    return pathname === base || pathname.startsWith(`${base}/`)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <div className="border-b border-gray-100">
        <div className="container-custom flex items-center justify-between gap-4 py-3 lg:gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path d="M9 22V10l7 6 7-6v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Nexify<span className="text-primary">Store</span></span>
          </Link>

          <div className="hidden flex-1 items-center justify-center lg:flex lg:max-w-xl">
            <InstantSearch />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/account/wishlist"
              className="hidden sm:inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Wishlist"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            <CartBadge />
            <UserMenu />
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <nav aria-label="Primary" className="hidden border-b border-gray-50 bg-gray-50/50 lg:block">
        <div className="container-custom flex items-center gap-8 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="container-custom space-y-3 py-4">
            <Suspense fallback={<SearchBarFallback className="lg:hidden" />}>
              <SearchBar className="lg:hidden" />
            </Suspense>
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
