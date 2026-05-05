import type { Metadata, Viewport } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Nexify Engine',
    template: '%s | Nexify Engine',
  },
  description: 'Modern multi-tenant CMS and ecommerce platform.',
  openGraph: {
    type: 'website',
    siteName: 'Nexify Engine',
    title: 'Nexify Engine',
    description: 'Modern multi-tenant CMS and ecommerce platform.',
    url: APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexify Engine',
    description: 'Modern multi-tenant CMS and ecommerce platform.',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen flex-col bg-white text-gray-900 antialiased">
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
