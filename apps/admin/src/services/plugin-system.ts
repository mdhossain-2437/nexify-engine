/**
 * Plugin System — manages plugin lifecycle, hooks, and event dispatching.
 *
 * Plugins can subscribe to lifecycle hooks and inject code into pages.
 * Each tenant has its own set of enabled plugins with per-tenant settings.
 */

export type PluginEvent =
  | 'page:render'
  | 'product:view'
  | 'cart:updated'
  | 'order:created'
  | 'order:completed'
  | 'user:registered'
  | 'user:login'
  | 'search:query'
  | 'checkout:start'
  | 'checkout:complete'
  | 'theme:changed'
  | 'head:inject'
  | 'footer:inject'

export interface PluginHook {
  event: PluginEvent
  priority: number
}

export interface PluginDefinition {
  slug: string
  name: string
  description: string
  category: string
  icon: string
  requiredPlan: string
  hooks: PluginHook[]
  settings: Record<string, unknown>
  headCode: string
  footerCode: string
}

export const BUILT_IN_PLUGINS: PluginDefinition[] = [
  {
    slug: 'seo-optimizer',
    name: 'SEO Optimizer',
    description:
      'Automatic meta tags, Open Graph, structured data, sitemap, and robots.txt optimization.',
    category: 'seo',
    icon: 'search',
    requiredPlan: 'free',
    hooks: [
      { event: 'page:render', priority: 1 },
      { event: 'product:view', priority: 1 },
      { event: 'head:inject', priority: 1 },
    ],
    settings: {
      autoMetaDescription: true,
      autoOpenGraph: true,
      autoStructuredData: true,
      autoSitemap: true,
      autoRobotsTxt: true,
      titleTemplate: '%s | {{storeName}}',
    },
    headCode: '',
    footerCode: '',
  },
  {
    slug: 'analytics-tracker',
    name: 'Analytics Tracker',
    description:
      'Track page views, product views, cart actions, and checkout events. Integrates with Google Analytics.',
    category: 'analytics',
    icon: 'bar-chart',
    requiredPlan: 'free',
    hooks: [
      { event: 'page:render', priority: 5 },
      { event: 'product:view', priority: 5 },
      { event: 'cart:updated', priority: 5 },
      { event: 'checkout:complete', priority: 5 },
    ],
    settings: {
      googleAnalyticsId: '',
      trackPageViews: true,
      trackProductViews: true,
      trackCartEvents: true,
      trackCheckout: true,
    },
    headCode: '',
    footerCode: '',
  },
  {
    slug: 'newsletter',
    name: 'Newsletter',
    description:
      'Collect email subscribers with popup and inline forms. Export subscriber lists.',
    category: 'marketing',
    icon: 'mail',
    requiredPlan: 'basic',
    hooks: [
      { event: 'page:render', priority: 10 },
      { event: 'footer:inject', priority: 5 },
    ],
    settings: {
      popupEnabled: true,
      popupDelay: 5000,
      popupTitle: 'Stay Updated!',
      popupDescription: 'Subscribe to get exclusive deals and updates.',
      inlineFormEnabled: true,
      mailchimpApiKey: '',
      mailchimpListId: '',
    },
    headCode: '',
    footerCode: '',
  },
  {
    slug: 'social-sharing',
    name: 'Social Sharing',
    description:
      'Add share buttons to products and blog posts. Supports Facebook, Twitter, Pinterest, WhatsApp.',
    category: 'social',
    icon: 'share-2',
    requiredPlan: 'free',
    hooks: [
      { event: 'product:view', priority: 10 },
      { event: 'page:render', priority: 10 },
    ],
    settings: {
      platforms: ['facebook', 'twitter', 'pinterest', 'whatsapp'],
      showOnProducts: true,
      showOnBlogPosts: true,
      buttonStyle: 'icon',
    },
    headCode: '',
    footerCode: '',
  },
  {
    slug: 'live-chat',
    name: 'Live Chat',
    description:
      'Add live chat widget to your store. Supports Tawk.to, Crisp, and custom widget.',
    category: 'communication',
    icon: 'message-circle',
    requiredPlan: 'basic',
    hooks: [{ event: 'footer:inject', priority: 1 }],
    settings: {
      provider: 'tawk',
      tawkPropertyId: '',
      crispWebsiteId: '',
      customWidgetCode: '',
      position: 'bottom-right',
    },
    headCode: '',
    footerCode: '',
  },
  {
    slug: 'reviews-ratings',
    name: 'Reviews & Ratings',
    description:
      'Enable product reviews and star ratings from verified purchasers.',
    category: 'content',
    icon: 'star',
    requiredPlan: 'basic',
    hooks: [
      { event: 'product:view', priority: 8 },
      { event: 'order:completed', priority: 10 },
    ],
    settings: {
      requireVerifiedPurchase: true,
      moderationEnabled: true,
      autoApprove: false,
      maxRating: 5,
      showAverageOnCard: true,
    },
    headCode: '',
    footerCode: '',
  },
  {
    slug: 'discount-coupons',
    name: 'Discount & Coupons',
    description:
      'Create percentage or fixed-amount discount codes. Set expiry dates and usage limits.',
    category: 'marketing',
    icon: 'tag',
    requiredPlan: 'basic',
    hooks: [
      { event: 'checkout:start', priority: 5 },
      { event: 'cart:updated', priority: 5 },
    ],
    settings: {
      maxCouponsPerTenant: 50,
      allowStacking: false,
    },
    headCode: '',
    footerCode: '',
  },
  {
    slug: 'inventory-alerts',
    name: 'Inventory Alerts',
    description:
      'Automatic low-stock alerts and back-in-stock notifications for customers.',
    category: 'utility',
    icon: 'bell',
    requiredPlan: 'pro',
    hooks: [
      { event: 'product:view', priority: 3 },
      { event: 'order:completed', priority: 3 },
    ],
    settings: {
      lowStockThreshold: 5,
      notifyAdmin: true,
      notifyCustomers: true,
      backInStockEnabled: true,
    },
    headCode: '',
    footerCode: '',
  },
]

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  premium: 3,
}

export function canUsePlan(tenantPlan: string, requiredPlan: string): boolean {
  return (PLAN_HIERARCHY[tenantPlan] ?? 0) >= (PLAN_HIERARCHY[requiredPlan] ?? 0)
}
