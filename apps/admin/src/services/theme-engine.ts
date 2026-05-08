/**
 * Theme Engine — resolves the active theme for a tenant and generates CSS variables.
 *
 * Built-in themes are registered here and can be seeded into the database.
 */

export interface ThemeConfig {
  slug: string
  name: string
  description: string
  category: string
  colors: {
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
  typography: {
    headingFont: string
    bodyFont: string
    baseFontSize: number
    headingWeight: string
  }
  layout: {
    headerStyle: string
    footerStyle: string
    productCardStyle: string
    borderRadius: string
    containerWidth: string
  }
  customCSS?: string
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0 0 0'
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
}

const RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
}

const FONT_MAP: Record<string, string> = {
  inter: "'Inter', system-ui, sans-serif",
  roboto: "'Roboto', system-ui, sans-serif",
  'open-sans': "'Open Sans', system-ui, sans-serif",
  poppins: "'Poppins', system-ui, sans-serif",
  'playfair-display': "'Playfair Display', Georgia, serif",
  montserrat: "'Montserrat', system-ui, sans-serif",
  lato: "'Lato', system-ui, sans-serif",
  nunito: "'Nunito', system-ui, sans-serif",
  'dm-sans': "'DM Sans', system-ui, sans-serif",
  'plus-jakarta-sans': "'Plus Jakarta Sans', system-ui, sans-serif",
}

export function generateThemeCSS(theme: ThemeConfig): string {
  const c = theme.colors
  const t = theme.typography
  const l = theme.layout

  const variables = `
:root {
  --color-primary-rgb: ${hexToRgb(c.primary)};
  --color-secondary-rgb: ${hexToRgb(c.secondary)};
  --color-accent-rgb: ${hexToRgb(c.accent)};
  --color-primary: rgb(var(--color-primary-rgb));
  --color-secondary: rgb(var(--color-secondary-rgb));
  --color-accent: rgb(var(--color-accent-rgb));
  --color-background: ${c.background};
  --color-surface: ${c.surface};
  --color-text: ${c.text};
  --color-text-muted: ${c.textMuted};
  --color-border: ${c.border};
  --color-success: ${c.success};
  --color-error: ${c.error};
  --color-warning: ${c.warning};
  --font-heading: ${FONT_MAP[t.headingFont] || FONT_MAP.inter};
  --font-body: ${FONT_MAP[t.bodyFont] || FONT_MAP.inter};
  --font-size-base: ${t.baseFontSize}px;
  --font-weight-heading: ${t.headingWeight};
  --radius: ${RADIUS_MAP[l.borderRadius] || RADIUS_MAP.md};
  --container-width: ${l.containerWidth === 'full' ? '100%' : `${l.containerWidth}px`};
}`.trim()

  return theme.customCSS ? `${variables}\n\n${theme.customCSS}` : variables
}

export const BUILT_IN_THEMES: ThemeConfig[] = [
  {
    slug: 'default',
    name: 'Default',
    description: 'Clean and professional. Works great for any store.',
    category: 'general',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
    },
    typography: {
      headingFont: 'inter',
      bodyFont: 'inter',
      baseFontSize: 16,
      headingWeight: '700',
    },
    layout: {
      headerStyle: 'default',
      footerStyle: 'default',
      productCardStyle: 'default',
      borderRadius: 'md',
      containerWidth: '1280',
    },
  },
  {
    slug: 'minimal',
    name: 'Minimal',
    description: 'Minimalist design with lots of whitespace. Perfect for premium brands.',
    category: 'portfolio',
    colors: {
      primary: '#18181b',
      secondary: '#71717a',
      accent: '#18181b',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#18181b',
      textMuted: '#71717a',
      border: '#e4e4e7',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
    },
    typography: {
      headingFont: 'plus-jakarta-sans',
      bodyFont: 'inter',
      baseFontSize: 16,
      headingWeight: '600',
    },
    layout: {
      headerStyle: 'minimal',
      footerStyle: 'minimal',
      productCardStyle: 'minimal',
      borderRadius: 'sm',
      containerWidth: '1280',
    },
  },
  {
    slug: 'bold',
    name: 'Bold',
    description: 'Vibrant colors and strong typography. Great for fashion and lifestyle.',
    category: 'ecommerce',
    colors: {
      primary: '#dc2626',
      secondary: '#1e293b',
      accent: '#eab308',
      background: '#ffffff',
      surface: '#fef2f2',
      text: '#0f172a',
      textMuted: '#475569',
      border: '#fecaca',
      success: '#16a34a',
      error: '#dc2626',
      warning: '#ea580c',
    },
    typography: {
      headingFont: 'montserrat',
      bodyFont: 'dm-sans',
      baseFontSize: 16,
      headingWeight: '800',
    },
    layout: {
      headerStyle: 'default',
      footerStyle: 'expanded',
      productCardStyle: 'overlay',
      borderRadius: 'lg',
      containerWidth: '1440',
    },
  },
  {
    slug: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated serif typography. Ideal for luxury and boutique stores.',
    category: 'ecommerce',
    colors: {
      primary: '#78716c',
      secondary: '#a8a29e',
      accent: '#b45309',
      background: '#fafaf9',
      surface: '#f5f5f4',
      text: '#292524',
      textMuted: '#78716c',
      border: '#d6d3d1',
      success: '#15803d',
      error: '#b91c1c',
      warning: '#a16207',
    },
    typography: {
      headingFont: 'playfair-display',
      bodyFont: 'lato',
      baseFontSize: 17,
      headingWeight: '700',
    },
    layout: {
      headerStyle: 'centered',
      footerStyle: 'expanded',
      productCardStyle: 'bordered',
      borderRadius: 'none',
      containerWidth: '1280',
    },
  },
  {
    slug: 'glass',
    name: 'Glass',
    description: 'Modern glassmorphism design with translucent elements.',
    category: 'landing',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      error: '#fb7185',
      warning: '#fbbf24',
    },
    typography: {
      headingFont: 'plus-jakarta-sans',
      bodyFont: 'inter',
      baseFontSize: 16,
      headingWeight: '700',
    },
    layout: {
      headerStyle: 'transparent',
      footerStyle: 'minimal',
      productCardStyle: 'overlay',
      borderRadius: 'xl',
      containerWidth: '1280',
    },
    customCSS: `.btn-primary { backdrop-filter: blur(12px); }
.bg-white { background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(148, 163, 184, 0.1); }`,
  },
]
