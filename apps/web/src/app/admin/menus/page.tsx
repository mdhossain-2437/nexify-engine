'use client'

import { useState } from 'react'
import Link from 'next/link'

interface MenuItem {
  id: string
  label: string
  type: 'link' | 'page' | 'category' | 'blog' | 'products'
  url: string
  children: MenuItem[]
}

const LOCATIONS = [
  { value: 'header-primary', label: 'Primary Header' },
  { value: 'header-secondary', label: 'Secondary Header' },
  { value: 'footer-1', label: 'Footer Column 1' },
  { value: 'footer-2', label: 'Footer Column 2' },
  { value: 'footer-3', label: 'Footer Column 3' },
  { value: 'mobile', label: 'Mobile Navigation' },
  { value: 'sidebar', label: 'Sidebar' },
]

const ITEM_TYPES = [
  { value: 'link', label: 'Custom Link' },
  { value: 'page', label: 'Page' },
  { value: 'category', label: 'Product Category' },
  { value: 'blog', label: 'Blog' },
  { value: 'products', label: 'All Products' },
]

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export default function MenusPage() {
  const [menus, setMenus] = useState<
    Array<{ id: string; name: string; location: string; items: MenuItem[] }>
  >([])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<{ menuId: string; item: MenuItem } | null>(null)
  const [newMenuName, setNewMenuName] = useState('')
  const [newMenuLocation, setNewMenuLocation] = useState('header-primary')

  const handleCreateMenu = () => {
    if (!newMenuName.trim()) return
    const menu = {
      id: generateId(),
      name: newMenuName,
      location: newMenuLocation,
      items: [],
    }
    setMenus((prev) => [...prev, menu])
    setActiveMenu(menu.id)
    setNewMenuName('')
  }

  const handleAddItem = (menuId: string) => {
    const item: MenuItem = {
      id: generateId(),
      label: 'New Link',
      type: 'link',
      url: '/',
      children: [],
    }
    setMenus((prev) =>
      prev.map((m) => (m.id === menuId ? { ...m, items: [...m.items, item] } : m)),
    )
    setEditingItem({ menuId, item })
  }

  const handleUpdateItem = (menuId: string, itemId: string, updates: Partial<MenuItem>) => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.id !== menuId) return m
        return {
          ...m,
          items: m.items.map((i) =>
            i.id === itemId ? { ...i, ...updates } : i,
          ),
        }
      }),
    )
    if (editingItem && editingItem.item.id === itemId) {
      setEditingItem({ menuId, item: { ...editingItem.item, ...updates } })
    }
  }

  const handleRemoveItem = (menuId: string, itemId: string) => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.id !== menuId) return m
        return { ...m, items: m.items.filter((i) => i.id !== itemId) }
      }),
    )
    if (editingItem?.item.id === itemId) setEditingItem(null)
  }

  const handleMoveItem = (menuId: string, itemId: string, direction: 'up' | 'down') => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.id !== menuId) return m
        const idx = m.items.findIndex((i) => i.id === itemId)
        if (idx === -1) return m
        const newIdx = direction === 'up' ? idx - 1 : idx + 1
        if (newIdx < 0 || newIdx >= m.items.length) return m
        const newItems = [...m.items]
        const temp = newItems[idx]
        newItems[idx] = newItems[newIdx]
        newItems[newIdx] = temp
        return { ...m, items: newItems }
      }),
    )
  }

  const active = menus.find((m) => m.id === activeMenu)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-primary">Nexify Engine</Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-700">Menu Builder</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/themes" className="text-sm text-gray-600 hover:text-primary">Themes</Link>
            <Link href="/admin/plugins" className="text-sm text-gray-600 hover:text-primary">Plugins</Link>
            <Link href="/admin/widgets" className="text-sm text-gray-600 hover:text-primary">Widgets</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Menu list + Create */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Create Menu</h3>
              <input
                type="text"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                placeholder="Menu name..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-3"
              />
              <select
                value={newMenuLocation}
                onChange={(e) => setNewMenuLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm mb-3"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
              <button
                onClick={handleCreateMenu}
                disabled={!newMenuName.trim()}
                className="w-full btn-primary text-sm py-2 disabled:opacity-50"
              >
                Create Menu
              </button>
            </div>

            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Your Menus</h3>
              {menus.length === 0 ? (
                <p className="text-sm text-gray-400">No menus yet</p>
              ) : (
                <ul className="space-y-2">
                  {menus.map((m) => (
                    <li key={m.id}>
                      <button
                        onClick={() => setActiveMenu(m.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeMenu === m.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block font-medium">{m.name}</span>
                        <span className="text-xs text-gray-400">
                          {LOCATIONS.find((l) => l.value === m.location)?.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Main: Menu items */}
          <div className="lg:col-span-3">
            {!active ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No menu selected</h3>
                <p className="text-sm text-gray-400">Create a menu or select one from the sidebar</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border">
                <div className="p-5 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{active.name}</h3>
                    <p className="text-xs text-gray-400">
                      {LOCATIONS.find((l) => l.value === active.location)?.label} &middot; {active.items.length} items
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddItem(active.id)}
                    className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    + Add Item
                  </button>
                </div>

                {active.items.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <p>No menu items yet. Click &quot;Add Item&quot; to get started.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {active.items.map((item, idx) => (
                      <li key={item.id} className="p-4 flex items-center gap-4">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleMoveItem(active.id, item.id, 'up')}
                            disabled={idx === 0}
                            className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMoveItem(active.id, item.id, 'down')}
                            disabled={idx === active.items.length - 1}
                            className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleUpdateItem(active.id, item.id, { label: e.target.value })}
                            className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm font-medium"
                          />
                        </div>

                        <select
                          value={item.type}
                          onChange={(e) => handleUpdateItem(active.id, item.id, { type: e.target.value as MenuItem['type'] })}
                          className="rounded border border-gray-200 px-2 py-1.5 text-xs"
                        >
                          {ITEM_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>

                        {item.type === 'link' && (
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => handleUpdateItem(active.id, item.id, { url: e.target.value })}
                            placeholder="URL"
                            className="w-40 rounded border border-gray-200 px-3 py-1.5 text-xs"
                          />
                        )}

                        <button
                          onClick={() => handleRemoveItem(active.id, item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="p-4 border-t bg-gray-50 flex justify-end">
                  <button className="text-sm px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    Save Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
