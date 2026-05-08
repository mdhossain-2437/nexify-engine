import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost:3000'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Extract subdomain
  let subdomain: string | null = null

  if (hostname.includes(PLATFORM_DOMAIN)) {
    const parts = hostname.split('.')
    if (parts.length > PLATFORM_DOMAIN.split('.').length) {
      subdomain = parts[0]
    }
  } else {
    // Custom domain — resolve via API
    url.searchParams.set('customDomain', hostname)
  }

  if (subdomain && subdomain !== 'www' && subdomain !== 'admin') {
    url.searchParams.set('tenant', subdomain)
  }

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
