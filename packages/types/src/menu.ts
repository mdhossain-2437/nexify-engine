export interface Menu {
  id: string
  tenant: string
  name: string
  location: MenuLocation
  items: NavigationMenuItem[]
  createdAt: string
  updatedAt: string
}

export type MenuLocation =
  | 'header-primary'
  | 'header-secondary'
  | 'footer-1'
  | 'footer-2'
  | 'footer-3'
  | 'mobile'
  | 'sidebar'

export interface NavigationMenuItem {
  id?: string
  label: string
  type: 'link' | 'page' | 'category' | 'blog' | 'products'
  url?: string
  page?: string
  category?: string
  openInNewTab: boolean
  icon?: string
  children?: MenuChildItem[]
}

export interface MenuChildItem {
  id?: string
  label: string
  type: 'link' | 'page' | 'category'
  url?: string
  page?: string
  category?: string
  openInNewTab: boolean
}
