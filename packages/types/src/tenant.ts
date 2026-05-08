export interface Tenant {
  id: string
  name: string
  slug: string
  domain: string | null
  subdomain: string
  plan: TenantPlan
  logo: string | null
  themeConfig: TenantThemeConfig
  status: TenantStatus
  storageLimit: number
  contactEmail: string | null
  socialLinks: SocialLinks | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  subscriptionStatus: SubscriptionStatus
  createdAt: string
  updatedAt: string
}

export type TenantPlan = 'free' | 'basic' | 'pro' | 'premium'
export type TenantStatus = 'active' | 'inactive' | 'suspended'
export type SubscriptionStatus = 'none' | 'active' | 'past_due' | 'cancelled' | 'trialing'

export interface TenantThemeConfig {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  headerLayout: 'default' | 'centered' | 'minimal'
  footerLayout: 'default' | 'minimal' | 'expanded'
}

export interface SocialLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  youtube?: string
  linkedin?: string
}
