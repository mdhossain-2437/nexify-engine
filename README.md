# Nexify Engine

A modern **multi-tenant CMS + ecommerce SaaS platform** built with Next.js, Payload CMS, and PostgreSQL.

## Architecture

```
User Browser
     ↓
Next.js Storefront (apps/web) ← Port 3000
     ↓
Payload CMS API (apps/admin) ← Port 3001
     ↓
PostgreSQL + Redis + Search + Storage
```

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend/CMS:** Payload CMS 3.x
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS + custom theme variables
- **State Management:** Zustand (cart/session)
- **Monorepo:** Turborepo + pnpm workspaces

## Project Structure

```
nexify-engine/
├── apps/
│   ├── admin/          # Payload CMS admin panel + API (port 3001)
│   └── web/            # Next.js public storefront (port 3000)
├── packages/
│   └── types/          # Shared TypeScript types
├── turbo.json          # Turborepo config
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+

### Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp apps/admin/.env.example apps/admin/.env
cp apps/web/.env.example apps/web/.env
```

3. Start PostgreSQL and create the database:

```bash
createdb nexify
```

4. Run development servers:

```bash
pnpm dev
```

5. Seed the database with demo data:

```bash
pnpm db:seed
```

### Default Credentials

- **Super Admin:** admin@nexify.com / admin123456
- **Tenant Admin:** tenant@nexify.com / tenant123456

## Multi-Tenant Model

- Single database, shared schema with `tenant_id` isolation
- Subdomain-based tenant resolution (e.g., `demo.nexify.com`)
- Custom domain support
- Per-tenant theme configuration

## Roles

| Role         | Access                                  |
| ------------ | --------------------------------------- |
| Super Admin  | Full platform access, tenant management |
| Tenant Admin | Full access to own tenant's data        |
| Staff        | Limited access within tenant            |
| Customer     | Public storefront + order history       |

## Core Features

### Super Admin

- Tenant creation and management
- Plan assignment and storage limits
- Global system settings

### Client Admin (per tenant)

- Product CRUD with variants, SKUs, images
- Category management
- Order management with status tracking
- Page builder with content blocks (Hero, Text, Image, Product Grid, Banner, Testimonials, CTA, FAQ)
- Blog management
- SEO settings per page/product
- Theme configuration

### Public Storefront

- Shared `<SiteHeader />` and `<SiteFooter />` rendered from the root layout, with a hydration-safe cart badge that surfaces total item count on every page
- Homepage with dynamic content blocks and live featured products
- Product listing with `?q=` search, `?category=` filter, sortable, paginated
- Product detail pages with working variant selection and price modifiers, image gallery, JSON-LD `Product` + `BreadcrumbList`
- Blog index + `/blog/[slug]` detail page with rich-text rendering and JSON-LD `BlogPosting`
- Generic `/[slug]` Payload page renderer mapping content blocks (hero, textContent, imageText, productGrid, banner, testimonials, cta, faq) to React
- Shopping cart with **tenant-scoped** localStorage (no cross-tenant cart bleed)
- Checkout flow (Stripe Checkout + Cash on Delivery) with order confirmation reading `?session_id=`
- About / Privacy / Terms / Contact pages
- Branded `not-found.tsx` and `error.tsx`, plus `loading.tsx` skeletons on heavy routes
- `next/image` everywhere, with `remotePatterns` derived from `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_IMAGE_HOSTS`

### Payments (Stripe)

- Stripe Checkout integration for card payments
- Webhook handler for payment confirmation (`checkout.session.completed`, `checkout.session.expired`)
- Automatic order status updates on payment events
- Cash on Delivery fallback
- Payment records with transaction tracking
- API endpoints: `POST /api/stripe/checkout`, `POST /api/stripe/webhook`

### SEO

- Dynamic meta tags per page/product
- OpenGraph support
- SEO fields on all content types
- Server-side rendering for search engine indexing
- Auto-generated XML sitemap (`/sitemap.xml`) with products, pages, blog posts
- Dynamic `robots.txt` with crawl directives
- JSON-LD schema markup (Product, WebSite, BreadcrumbList, BlogPosting)

### Analytics Dashboard

- Revenue overview (total, monthly trends)
- Order statistics by status
- Product inventory summary
- Customer count and average order value
- Recent orders table
- Bar chart for monthly revenue trends
- Access at `/admin/analytics`
- API endpoint: `GET /api/analytics`

## Environment Variables

### Admin (`apps/admin/.env`)

| Variable                        | Description                              |
| ------------------------------- | ---------------------------------------- |
| `DATABASE_URI`                  | PostgreSQL connection string             |
| `PAYLOAD_SECRET`                | Payload CMS secret (min 32 chars)        |
| `STRIPE_SECRET_KEY`             | Stripe secret key (optional)             |
| `STRIPE_WEBHOOK_SECRET`         | Stripe webhook signing secret (optional) |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key (optional)        |

### Web (`apps/web/.env`)

| Variable              | Description                       |
| --------------------- | --------------------------------- |
| `PAYLOAD_API_URL`     | Payload CMS API URL (server-side) |
| `NEXT_PUBLIC_API_URL` | Payload CMS API URL (client-side) |
| `NEXT_PUBLIC_APP_URL` | Public storefront URL             |

## Quality

- `pnpm lint` — ESLint via `next/core-web-vitals`
- `pnpm typecheck` — strict TypeScript across all packages
- `pnpm test` — vitest unit tests (cart store coverage)
- `pnpm format` / `pnpm format:check` — Prettier
- A ready-to-go GitHub Actions workflow lives at `ci-workflow.yml.example` — drop it into `.github/workflows/ci.yml` to run install / format / lint / typecheck / test / build on every PR

## Security notes

- **Stripe checkout** writes the real Payload product id to each order line; it no longer mistakenly substitutes `tenantId`. `customer` is only set when there is an authenticated user.
- **Stripe webhook** refuses to process events without a signing secret when `NODE_ENV === 'production'`.
- **Cart storage** is keyed by hostname (`nexify-cart:<host>`) so multi-tenant browsers cannot share carts.

## License

Private - All rights reserved.
