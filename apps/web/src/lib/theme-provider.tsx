'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
  border: string
}

interface ThemeConfig {
  slug: string
  name: string
  colors: ThemeColors
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
}

interface ThemeContextValue {
  theme: ThemeConfig | null
  setThemeSlug: (slug: string) => void
  loading: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: null,
  setThemeSlug: () => {},
  loading: false,
})

export function useTheme() {
  return useContext(ThemeContext)
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

function applyThemeToDOM(theme: ThemeConfig) {
  const root = document.documentElement
  const c = theme.colors
  const t = theme.typography
  const l = theme.layout

  root.style.setProperty('--color-primary-rgb', hexToRgb(c.primary))
  root.style.setProperty('--color-secondary-rgb', hexToRgb(c.secondary))
  root.style.setProperty('--color-accent-rgb', hexToRgb(c.accent))
  root.style.setProperty('--color-primary', `rgb(${hexToRgb(c.primary)})`)
  root.style.setProperty('--color-secondary', `rgb(${hexToRgb(c.secondary)})`)
  root.style.setProperty('--color-accent', `rgb(${hexToRgb(c.accent)})`)
  root.style.setProperty('--color-background', c.background)
  root.style.setProperty('--color-surface', c.surface)
  root.style.setProperty('--color-text', c.text)
  root.style.setProperty('--color-text-muted', c.textMuted)
  root.style.setProperty('--color-border', c.border)
  root.style.setProperty('--font-heading', FONT_MAP[t.headingFont] || FONT_MAP.inter)
  root.style.setProperty('--font-body', FONT_MAP[t.bodyFont] || FONT_MAP.inter)
  root.style.setProperty('--font-size-base', `${t.baseFontSize}px`)
  root.style.setProperty('--font-weight-heading', t.headingWeight)
  root.style.setProperty('--radius', RADIUS_MAP[l.borderRadius] || RADIUS_MAP.md)
  root.style.setProperty(
    '--container-width',
    l.containerWidth === 'full' ? '100%' : `${l.containerWidth}px`,
  )
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig | null>(null)
  const [loading, setLoading] = useState(false)

  const setThemeSlug = useCallback(async (slug: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/themes/preview?slug=${slug}`)
      if (res.ok) {
        const data = await res.json()
        setTheme(data.theme as ThemeConfig)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (theme) {
      applyThemeToDOM(theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setThemeSlug, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}
