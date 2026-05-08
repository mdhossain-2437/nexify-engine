import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Nexify Engine handles your information.',
}

export default function PrivacyPage() {
  return (
    <div className="container-custom max-w-3xl section-padding">
      <h1 className="text-4xl font-bold">Privacy policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: today</p>
      <div className="prose-storefront mt-8">
        <p>
          This is a sample privacy policy bundled with the Nexify Engine starter. Replace it with
          your actual policy before going to production.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>Account information you provide (name, email, address).</li>
          <li>Order, payment and shipping details when you check out.</li>
          <li>Anonymized usage analytics to improve the product.</li>
        </ul>
        <h2>How we use your information</h2>
        <p>
          We use the information you give us to fulfil your orders, communicate about the service,
          and comply with our legal obligations. We do not sell your personal information.
        </p>
        <h2>Cookies</h2>
        <p>
          We use a small number of strictly necessary cookies (session, cart) and may use analytics
          cookies. You can control these in your browser at any time.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy? Reach us at <Link href="/contact">our contact form</Link>.
        </p>
      </div>
    </div>
  )
}
