import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { BlogPosts } from './collections/BlogPosts'
import { Media } from './collections/Media'
import { Payments } from './collections/Payments'
import { TenantSettings } from './globals/TenantSettings'
import { stripeCheckoutHandler } from './endpoints/stripe-checkout'
import { stripeWebhookHandler } from './endpoints/stripe-webhook'
import { analyticsHandler } from './endpoints/analytics'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | Nexify Engine',
    },
  },

  collections: [
    Tenants,
    Users,
    Products,
    Categories,
    Orders,
    Pages,
    BlogPosts,
    Media,
    Payments,
  ],

  globals: [TenantSettings],

  endpoints: [
    {
      path: '/stripe/checkout',
      method: 'post',
      handler: stripeCheckoutHandler,
    },
    {
      path: '/stripe/webhook',
      method: 'post',
      handler: stripeWebhookHandler,
    },
    {
      path: '/analytics',
      method: 'get',
      handler: analyticsHandler,
    },
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production-32chars',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/nexify',
    },
  }),

  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
  ],

  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
  ],
})
