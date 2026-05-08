import type { Metadata, Viewport } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AuthProvider } from '@/components/auth-provider'
import { ThemeProvider } from '@/lib/theme-provider'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'NexifyStore — Shop Quality Products Online',
    template: '%s | NexifyStore',
  },
  description: 'Shop the latest products with free shipping, secure payments, and 30-day returns. Your premier online shopping destination.',
  openGraph: {
    type: 'website',
    siteName: 'NexifyStore',
    title: 'NexifyStore — Shop Quality Products Online',
    description: 'Shop the latest products with free shipping, secure payments, and 30-day returns.',
    url: APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexifyStore — Shop Quality Products Online',
    description: 'Shop the latest products with free shipping, secure payments, and 30-day returns.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen flex-col bg-white text-gray-900 antialiased">
        <AuthProvider>
          <ThemeProvider>
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
