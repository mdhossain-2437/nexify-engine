import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about NexifyStore — your trusted online shopping destination.',
}

const STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '10K+', label: 'Products' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
] as const

const VALUES = [
  {
    title: 'Quality First',
    description: 'Every product in our catalog is carefully vetted for quality. We partner only with trusted brands and suppliers.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Customer Obsessed',
    description: 'Your satisfaction is our top priority. From easy returns to responsive support, we are here for you every step.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    title: 'Fast & Reliable',
    description: 'Lightning-fast delivery with real-time tracking. We ship orders within 24 hours of purchase.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Secure Shopping',
    description: 'Shop with confidence. All transactions are protected with 256-bit SSL encryption and PCI compliance.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
] as const

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
        <div className="container-custom relative py-16 md:py-24 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-blue-300">Our Story</p>
          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">About NexifyStore</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100/80">
            We believe online shopping should be simple, enjoyable, and accessible to everyone.
            That is why we built a store that puts quality and customer experience first.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-custom grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-primary md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our Mission</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Making Quality Accessible</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              NexifyStore was founded with a simple mission: to connect people with products they
              love at prices they can afford. We curate the best products from around the world and
              deliver them to your doorstep with care and speed.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Whether you are looking for the latest trends, everyday essentials, or unique gifts,
              our catalog has something for everyone. Every product is backed by our satisfaction
              guarantee and world-class customer support.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our Values</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {VALUES.map((value) => (
              <article key={value.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={value.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{value.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{value.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white">
        <div className="container-custom py-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to Start Shopping?</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Browse our catalog and discover products you will love. Free shipping on orders over $50.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary transition-all hover:scale-105">
              Shop Now
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
