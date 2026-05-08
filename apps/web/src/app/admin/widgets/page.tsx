'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Widget {
  id: string
  name: string
  type: string
  area: string
  enabled: boolean
  order: number
}

const WIDGET_TYPES = [
  { value: 'recent-products', label: 'Recent Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { value: 'featured-products', label: 'Featured Products', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { value: 'categories', label: 'Categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { value: 'recent-posts', label: 'Recent Blog Posts', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2' },
  { value: 'newsletter', label: 'Newsletter Signup', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { value: 'social-links', label: 'Social Links', icon: 'M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6z' },
  { value: 'contact-info', label: 'Contact Info', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  { value: 'custom-html', label: 'Custom HTML', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { value: 'banner', label: 'Banner Image', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { value: 'search', label: 'Search Box', icon: 'M21 21l-4.3-4.3M16 10.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z' },
]

const WIDGET_AREAS = [
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'footer-1', label: 'Footer Row 1' },
  { value: 'footer-2', label: 'Footer Row 2' },
  { value: 'homepage-top', label: 'Homepage Top' },
  { value: 'homepage-bottom', label: 'Homepage Bottom' },
  { value: 'product-sidebar', label: 'Product Page Sidebar' },
  { value: 'blog-sidebar', label: 'Blog Sidebar' },
]

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [selectedArea, setSelectedArea] = useState<string>('sidebar')
  const [showAddPanel, setShowAddPanel] = useState(false)

  const areaWidgets = widgets
    .filter((w) => w.area === selectedArea)
    .sort((a, b) => a.order - b.order)

  const handleAddWidget = (type: string) => {
    const typeInfo = WIDGET_TYPES.find((t) => t.value === type)
    const widget: Widget = {
      id: generateId(),
      name: typeInfo?.label || type,
      type,
      area: selectedArea,
      enabled: true,
      order: areaWidgets.length,
    }
    setWidgets((prev) => [...prev, widget])
    setShowAddPanel(false)
  }

  const handleToggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
    )
  }

  const handleRemoveWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  const handleMoveWidget = (id: string, direction: 'up' | 'down') => {
    setWidgets((prev) => {
      const areaItems = prev
        .filter((w) => w.area === selectedArea)
        .sort((a, b) => a.order - b.order)
      const idx = areaItems.findIndex((w) => w.id === id)
      if (idx === -1) return prev
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= areaItems.length) return prev

      const updated = [...areaItems]
      const temp = updated[idx]
      updated[idx] = updated[newIdx]
      updated[newIdx] = temp

      const reordered = updated.map((w, i) => ({ ...w, order: i }))
      const otherWidgets = prev.filter((w) => w.area !== selectedArea)
      return [...otherWidgets, ...reordered]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-primary">Nexify Engine</Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-700">Widget Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/themes" className="text-sm text-gray-600 hover:text-primary">Themes</Link>
            <Link href="/admin/plugins" className="text-sm text-gray-600 hover:text-primary">Plugins</Link>
            <Link href="/admin/menus" className="text-sm text-gray-600 hover:text-primary">Menus</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Widget areas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Widget Areas</h3>
              <ul className="space-y-1">
                {WIDGET_AREAS.map((area) => {
                  const count = widgets.filter((w) => w.area === area.value).length
                  return (
                    <li key={area.value}>
                      <button
                        onClick={() => setSelectedArea(area.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                          selectedArea === area.value
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{area.label}</span>
                        {count > 0 && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                            {count}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Main: Widgets in selected area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border">
              <div className="p-5 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {WIDGET_AREAS.find((a) => a.value === selectedArea)?.label}
                  </h3>
                  <p className="text-xs text-gray-400">{areaWidgets.length} widgets</p>
                </div>
                <button
                  onClick={() => setShowAddPanel(!showAddPanel)}
                  className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  + Add Widget
                </button>
              </div>

              {showAddPanel && (
                <div className="p-5 border-b bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Choose a widget type:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {WIDGET_TYPES.map((wt) => (
                      <button
                        key={wt.value}
                        onClick={() => handleAddWidget(wt.value)}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 bg-white hover:border-primary hover:shadow-sm transition-all text-center"
                      >
                        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={wt.icon} />
                        </svg>
                        <span className="text-xs font-medium text-gray-700">{wt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {areaWidgets.length === 0 && !showAddPanel ? (
                <div className="p-12 text-center text-gray-400">
                  <p>No widgets in this area. Click &quot;Add Widget&quot; to get started.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {areaWidgets.map((widget, idx) => {
                    const typeInfo = WIDGET_TYPES.find((t) => t.value === widget.type)
                    return (
                      <li key={widget.id} className="p-4 flex items-center gap-4">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'up')}
                            disabled={idx === 0}
                            className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'down')}
                            disabled={idx === areaWidgets.length - 1}
                            className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 text-gray-500 flex-shrink-0">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={typeInfo?.icon || ''} />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{widget.name}</p>
                          <p className="text-xs text-gray-400">{typeInfo?.label}</p>
                        </div>

                        <button
                          onClick={() => handleToggleWidget(widget.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            widget.enabled ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              widget.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => handleRemoveWidget(widget.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}

              {areaWidgets.length > 0 && (
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                  <button className="text-sm px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    Save Widgets
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
