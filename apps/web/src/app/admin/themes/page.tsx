'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
}

interface Theme {
  id: string
  slug: string
  name: string
  description: string
  category: string
  isBuiltIn: boolean
  colors: ThemeColors
  typography: { headingFont: string; bodyFont: string }
  layout: { headerStyle: string; productCardStyle: string; borderRadius: string }
  version: string
  author: string
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [previewCSS, setPreviewCSS] = useState<string>('')

  const categories = ['all', 'general', 'ecommerce', 'portfolio', 'blog', 'business', 'landing']

  const fetchThemes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/themes`)
      if (res.ok) {
        const data = await res.json()
        setThemes(data.themes)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchThemes()
  }, [fetchThemes])

  const handlePreview = async (slug: string) => {
    setPreviewTheme(slug)
    try {
      const res = await fetch(`${API_URL}/api/themes/preview?slug=${slug}`)
      if (res.ok) {
        const data = await res.json()
        setPreviewCSS(data.css)
      }
    } catch {
      // silent
    }
  }

  const filtered = selectedCategory === 'all'
    ? themes
    : themes.filter((t) => t.category === selectedCategory)

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
            <h1 className="text-lg font-semibold text-gray-700">Theme Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/plugins" className="text-sm text-gray-600 hover:text-primary">Plugins</Link>
            <Link href="/admin/menus" className="text-sm text-gray-600 hover:text-primary">Menus</Link>
            <Link href="/admin/analytics" className="text-sm text-gray-600 hover:text-primary">Analytics</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Themes</h2>
            <p className="text-sm text-gray-500 mt-1">Customize your store appearance</p>
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((theme) => (
            <div key={theme.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="h-48 relative" style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 w-3/4 max-w-[200px] shadow-lg">
                    <div className="h-3 rounded-full mb-2" style={{ background: theme.colors.primary, width: '60%' }} />
                    <div className="h-2 rounded-full bg-gray-200 mb-1.5" style={{ width: '100%' }} />
                    <div className="h-2 rounded-full bg-gray-200 mb-3" style={{ width: '80%' }} />
                    <div className="flex gap-1.5">
                      <div className="h-6 w-6 rounded" style={{ background: theme.colors.primary }} />
                      <div className="h-6 w-6 rounded" style={{ background: theme.colors.secondary }} />
                      <div className="h-6 w-6 rounded" style={{ background: theme.colors.accent }} />
                    </div>
                  </div>
                </div>
                {theme.isBuiltIn && (
                  <span className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full text-gray-700">
                    Built-in
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{theme.name}</h3>
                  <span className="text-xs text-gray-400 capitalize">{theme.category}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{theme.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Object.values(theme.colors).slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="h-5 w-5 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(theme.slug)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      Preview
                    </button>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
                      Activate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No themes found in this category</p>
          </div>
        )}
      </main>

      {previewTheme && previewCSS && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Theme Preview: {themes.find((t) => t.slug === previewTheme)?.name}</h3>
              <button
                onClick={() => { setPreviewTheme(null); setPreviewCSS('') }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 overflow-auto max-h-[400px]">
                <code>{previewCSS}</code>
              </pre>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => { setPreviewTheme(null); setPreviewCSS('') }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                  Apply Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
