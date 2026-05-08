'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Plugin {
  id: string
  slug: string
  name: string
  description: string
  category: string
  icon: string
  isBuiltIn: boolean
  requiredPlan: string
  version: string
  author: string
}

const ICON_MAP: Record<string, string> = {
  search: 'M21 21l-4.3-4.3M16 10.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z',
  'bar-chart': 'M18 20V10M12 20V4M6 20v-6',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'share-2': 'M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98',
  'message-circle': 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
}

const PLAN_BADGES: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: 'bg-green-100 text-green-700' },
  basic: { label: 'Basic', color: 'bg-blue-100 text-blue-700' },
  pro: { label: 'Pro', color: 'bg-purple-100 text-purple-700' },
  premium: { label: 'Premium', color: 'bg-amber-100 text-amber-700' },
}

const CATEGORY_LABELS: Record<string, string> = {
  seo: 'SEO',
  analytics: 'Analytics',
  marketing: 'Marketing',
  communication: 'Communication',
  social: 'Social',
  payment: 'Payment',
  shipping: 'Shipping',
  utility: 'Utility',
  security: 'Security',
  content: 'Content',
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set())

  const fetchPlugins = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/plugins`)
      if (res.ok) {
        const data = await res.json()
        setPlugins(data.plugins)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlugins()
  }, [fetchPlugins])

  const handleInstall = async (pluginId: string) => {
    try {
      const tenantId = new URLSearchParams(window.location.search).get('tenantId') || '1'
      const res = await fetch(`${API_URL}/api/plugins/install`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, pluginId }),
      })
      if (res.ok) {
        setInstalledIds((prev) => new Set([...prev, pluginId]))
      }
    } catch {
      // silent
    }
  }

  const categories = ['all', ...new Set(plugins.map((p) => p.category))]

  const filtered = selectedCategory === 'all'
    ? plugins
    : plugins.filter((p) => p.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-primary">Nexify Engine</Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-700">Plugin Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/themes" className="text-sm text-gray-600 hover:text-primary">Themes</Link>
            <Link href="/admin/menus" className="text-sm text-gray-600 hover:text-primary">Menus</Link>
            <Link href="/admin/analytics" className="text-sm text-gray-600 hover:text-primary">Analytics</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Plugins</h2>
            <p className="text-sm text-gray-500 mt-1">Extend your store with powerful features</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((plugin) => {
            const badge = PLAN_BADGES[plugin.requiredPlan] || PLAN_BADGES.free
            const isInstalled = installedIds.has(plugin.id)
            const iconPath = ICON_MAP[plugin.icon] || ICON_MAP.star

            return (
              <div key={plugin.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{plugin.name}</h3>
                      <p className="text-xs text-gray-400">{CATEGORY_LABELS[plugin.category] || plugin.category}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{plugin.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">v{plugin.version} by {plugin.author}</span>
                  <button
                    onClick={() => handleInstall(plugin.id)}
                    disabled={isInstalled}
                    className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                      isInstalled
                        ? 'bg-green-50 text-green-600 cursor-default'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {isInstalled ? 'Installed' : 'Install'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No plugins found in this category</p>
          </div>
        )}
      </main>
    </div>
  )
}
