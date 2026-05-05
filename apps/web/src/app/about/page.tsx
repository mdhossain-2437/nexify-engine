import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Nexify Engine — modern multi-tenant CMS and ecommerce platform.',
}

export default function AboutPage() {
  return (
    <div className="container-custom max-w-3xl section-padding">
      <h1 className="text-4xl font-bold">About Nexify Engine</h1>
      <div className="prose-storefront mt-8">
        <p>
          Nexify Engine is a modern multi-tenant CMS &amp; ecommerce platform that lets you launch dozens
          of stores from a single codebase. It pairs the developer ergonomics of Next.js 15 with the
          content-modeling power of Payload CMS, all on a battle-tested PostgreSQL stack.
        </p>
        <h2>What makes it different</h2>
        <ul>
          <li>
            <strong>Multi-tenant by default</strong> — every product, page, order, and customer is scoped
            to a tenant, with first-class isolation in the database and the access layer.
          </li>
          <li>
            <strong>Block-based content</strong> — hero, productGrid, banner, testimonials, FAQ, CTA, and
            more compose into pages without a developer.
          </li>
          <li>
            <strong>SEO-ready</strong> — server-rendered metadata, JSON-LD product/blog/breadcrumb schemas,
            sitemap.xml, and robots.txt out of the box.
          </li>
          <li>
            <strong>Stripe + COD</strong> — secure payment via Stripe Checkout sessions, plus cash on
            delivery for markets that need it.
          </li>
        </ul>
        <h2>Open foundation</h2>
        <p>
          The platform is unopinionated where it matters: bring your own designs, themes, and integrations.
          A clean Payload data model and a typed Next.js storefront make extension straightforward.
        </p>
      </div>
    </div>
  )
}
