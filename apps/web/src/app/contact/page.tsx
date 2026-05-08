import type { Metadata } from 'next'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our support team. We are here to help with orders, returns, and more.',
}

const CONTACT_INFO = [
  {
    title: 'Customer Support',
    description: 'Our support team is available 24/7 to help with orders, returns, and more.',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    detail: 'support@nexifystore.com',
  },
  {
    title: 'Sales Inquiries',
    description: 'Interested in bulk orders or partnerships? Our sales team can help.',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    detail: 'sales@nexifystore.com',
  },
  {
    title: 'Office Address',
    description: 'Visit us at our headquarters for a product demo or meeting.',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    detail: '123 Commerce St, San Francisco, CA 94105',
  },
] as const

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
        <div className="container-custom py-16 text-center md:py-20">
          <p className="text-sm font-medium uppercase tracking-widest text-blue-300">Contact</p>
          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">Get in Touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100/80">
            Questions, feedback, or need help with an order? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CONTACT_INFO.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <p className="mt-2 text-sm font-medium text-primary">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-gray-100 bg-white p-8">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
