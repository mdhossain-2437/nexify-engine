export interface Plugin {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  category: PluginCategory
  isBuiltIn: boolean
  status: 'active' | 'draft' | 'deprecated'
  version: string
  author: string
  requiredPlan: 'free' | 'basic' | 'pro' | 'premium'
  hooks: PluginHook[]
  settings: Record<string, unknown> | null
  headCode: string | null
  footerCode: string | null
  thumbnail: string | null
  createdAt: string
  updatedAt: string
}

export type PluginCategory =
  | 'seo'
  | 'analytics'
  | 'marketing'
  | 'communication'
  | 'social'
  | 'payment'
  | 'shipping'
  | 'utility'
  | 'security'
  | 'content'

export interface PluginHook {
  event: string
  priority: number
}

export interface TenantPlugin {
  id: string
  tenant: string
  plugin: string | Plugin
  enabled: boolean
  settings: Record<string, unknown> | null
}
