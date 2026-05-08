export interface Theme {
  id: string
  slug: string
  name: string
  description: string | null
  category: ThemeCategory
  isBuiltIn: boolean
  status: 'active' | 'draft' | 'deprecated'
  version: string
  author: string
  colors: ThemeColors
  typography: ThemeTypography
  layout: ThemeLayout
  customCSS: string | null
  thumbnail: string | null
  createdAt: string
  updatedAt: string
}

export type ThemeCategory = 'general' | 'ecommerce' | 'portfolio' | 'blog' | 'business' | 'landing'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
  border: string
  success: string
  error: string
  warning: string
}

export interface ThemeTypography {
  headingFont: string
  bodyFont: string
  baseFontSize: number
  headingWeight: string
}

export interface ThemeLayout {
  headerStyle: 'default' | 'centered' | 'minimal' | 'transparent'
  footerStyle: 'default' | 'minimal' | 'expanded' | 'centered'
  productCardStyle: 'default' | 'minimal' | 'overlay' | 'bordered'
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  containerWidth: '960' | '1280' | '1440' | 'full'
}
