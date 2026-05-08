export interface Widget {
  id: string
  tenant: string
  name: string
  type: WidgetType
  area: WidgetArea
  order: number
  enabled: boolean
  config: WidgetConfig
  createdAt: string
  updatedAt: string
}

export type WidgetType =
  | 'recent-products'
  | 'featured-products'
  | 'categories'
  | 'recent-posts'
  | 'newsletter'
  | 'social-links'
  | 'contact-info'
  | 'custom-html'
  | 'banner'
  | 'text-block'
  | 'tag-cloud'
  | 'search'

export type WidgetArea =
  | 'sidebar'
  | 'footer-1'
  | 'footer-2'
  | 'homepage-top'
  | 'homepage-bottom'
  | 'product-sidebar'
  | 'blog-sidebar'

export interface WidgetConfig {
  title?: string
  limit?: number
  showImage?: boolean
  customContent?: unknown
  bannerImage?: string
  bannerLink?: string
  newsletterTitle?: string
  newsletterDescription?: string
}
