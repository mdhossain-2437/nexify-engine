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
import { Wishlists } from './collections/Wishlists'
import { Themes } from './collections/Themes'
import { Plugins } from './collections/Plugins'
import { TenantPlugins } from './collections/TenantPlugins'
import { Menus } from './collections/Menus'
import { Widgets } from './collections/Widgets'
import { TenantSettings } from './globals/TenantSettings'
import { stripeCheckoutHandler } from './endpoints/stripe-checkout'
import { stripeWebhookHandler } from './endpoints/stripe-webhook'
import { analyticsHandler } from './endpoints/analytics'
import { searchHandler } from './endpoints/search'
import { searchSyncHandler } from './endpoints/search-sync'
import {
  subscriptionPlansHandler,
  createSubscriptionHandler,
  manageBillingHandler,
} from './endpoints/stripe-subscription'
import { listThemesHandler, themePreviewHandler, seedThemesHandler } from './endpoints/themes'
import {
  listPluginsHandler,
  tenantPluginsHandler,
  installPluginHandler,
  togglePluginHandler,
  seedPluginsHandler,
} from './endpoints/plugins'

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
    Wishlists,
    Themes,
    Plugins,
    TenantPlugins,
    Menus,
    Widgets,
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
    {
      path: '/search',
      method: 'get',
      handler: searchHandler,
    },
    {
      path: '/search/sync',
      method: 'post',
      handler: searchSyncHandler,
    },
    {
      path: '/subscription/plans',
      method: 'get',
      handler: subscriptionPlansHandler,
    },
    {
      path: '/subscription/create',
      method: 'post',
      handler: createSubscriptionHandler,
    },
    {
      path: '/subscription/manage',
      method: 'post',
      handler: manageBillingHandler,
    },
    {
      path: '/themes',
      method: 'get',
      handler: listThemesHandler,
    },
    {
      path: '/themes/preview',
      method: 'get',
      handler: themePreviewHandler,
    },
    {
      path: '/themes/seed',
      method: 'post',
      handler: seedThemesHandler,
    },
    {
      path: '/plugins',
      method: 'get',
      handler: listPluginsHandler,
    },
    {
      path: '/plugins/tenant',
      method: 'get',
      handler: tenantPluginsHandler,
    },
    {
      path: '/plugins/install',
      method: 'post',
      handler: installPluginHandler,
    },
    {
      path: '/plugins/toggle',
      method: 'post',
      handler: togglePluginHandler,
    },
    {
      path: '/plugins/seed',
      method: 'post',
      handler: seedPluginsHandler,
    },
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production-32chars',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/nexify',
    },
  }),

  cors: ['http://localhost:3000', 'http://localhost:3001'],

  csrf: ['http://localhost:3000', 'http://localhost:3001'],
})
