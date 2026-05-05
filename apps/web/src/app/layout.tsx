import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexify Engine',
  description: 'Modern multi-tenant CMS and ecommerce platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
