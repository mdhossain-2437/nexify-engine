import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of service',
  description: 'The terms and conditions for using Nexify Engine.',
}

export default function TermsPage() {
  return (
    <div className="container-custom max-w-3xl section-padding">
      <h1 className="text-4xl font-bold">Terms of service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: today</p>
      <div className="prose-storefront mt-8">
        <p>
          This is a sample terms-of-service template bundled with Nexify Engine. Replace it with
          your actual terms before going to production.
        </p>
        <h2>1. Acceptance</h2>
        <p>By using this site you agree to be bound by these terms and our privacy policy.</p>
        <h2>2. Orders</h2>
        <p>
          Orders are subject to availability. We reserve the right to refuse or cancel orders at any
          time, including for suspected fraud or pricing errors.
        </p>
        <h2>3. Payment</h2>
        <p>
          Payments are processed by our payment partners (e.g. Stripe). You agree to provide
          accurate information at checkout.
        </p>
        <h2>4. Liability</h2>
        <p>
          To the maximum extent permitted by law, we are not liable for any indirect or
          consequential damages arising from use of the service.
        </p>
        <h2>5. Changes</h2>
        <p>
          We may update these terms periodically. Continued use of the service after a change
          constitutes acceptance of the new terms.
        </p>
      </div>
    </div>
  )
}
