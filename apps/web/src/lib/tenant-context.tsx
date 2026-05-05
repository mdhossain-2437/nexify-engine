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
          --color-primary: ${tenant.themeConfig?.primaryColor || '#2563eb'};
          --color-secondary: ${tenant.themeConfig?.secondaryColor || '#64748b'};
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
