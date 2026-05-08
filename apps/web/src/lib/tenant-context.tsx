'use client'

import React, { createContext, useContext } from 'react'

interface TenantTheme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

interface TenantData {
  id: string
  name: string
  slug: string
  subdomain: string
  logo: string | null
  themeConfig: TenantTheme
  contactEmail: string | null
  socialLinks: Record<string, string | null>
}

const TenantContext = createContext<TenantData | null>(null)

function sanitize(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback
  // Allow color hex/rgb/hsl, font family names, single/double quotes, commas, spaces, percent.
  const cleaned = value.replace(/[^#a-zA-Z0-9(),%.\s'"_-]/g, '').trim()
  return cleaned || fallback
}

/** Parse a CSS color string into a `r g b` triple usable with Tailwind's
 *  `<alpha-value>` resolution. Falls back when the input is malformed. */
function hexToRgbTriple(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback
  const hex = value.trim().replace(/^#/, '')
  const expanded =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex.length === 6
        ? hex
        : null
  if (!expanded) return fallback
  const r = parseInt(expanded.slice(0, 2), 16)
  const g = parseInt(expanded.slice(2, 4), 16)
  const b = parseInt(expanded.slice(4, 6), 16)
  if ([r, g, b].some((n) => Number.isNaN(n))) return fallback
  return `${r} ${g} ${b}`
}

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: TenantData
  children: React.ReactNode
}) {
  return (
    <TenantContext.Provider value={tenant}>
      <style>{`
        :root {
          --color-primary-rgb: ${hexToRgbTriple(tenant.themeConfig?.primaryColor, '37 99 235')};
          --color-secondary-rgb: ${hexToRgbTriple(tenant.themeConfig?.secondaryColor, '100 116 139')};
          --color-primary: rgb(var(--color-primary-rgb));
          --color-secondary: rgb(var(--color-secondary-rgb));
          --font-family: ${sanitize(tenant.themeConfig?.fontFamily, "'Inter', system-ui, sans-serif")};
        }
      `}</style>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
