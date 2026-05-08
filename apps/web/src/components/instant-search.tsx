'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface SearchHit {
  id: string | number
  title: string
  slug: string
  price: number
  salePrice: number | null
  imageUrl: string | null
  category: string
  _formatted?: {
    title?: string
    description?: string
  }
}

interface SearchResponse {
  hits: SearchHit[]
  totalHits: number
  processingTimeMs: number
  query: string
  fallback?: boolean
}

export function InstantSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null)
      setIsOpen(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}&limit=6`)
      if (res.ok) {
        const data: SearchResponse = await res.json()
        setResults(data)
        setIsOpen(true)
      }
    } catch {
      // Fallback silently
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 200)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results && results.hits.length > 0) setIsOpen(true)
          }}
          placeholder="Search products..."
          className="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-4.3-4.3M16 10.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          </div>
        )}
      </div>

      {isOpen && results && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.hits.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No products found for &ldquo;{results.query}&rdquo;
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {results.hits.map((hit) => (
                  <li key={hit.id}>
                    <Link
                      href={`/products/${hit.slug}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                      }}
                    >
                      {hit.imageUrl ? (
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={hit.imageUrl}
                            alt={hit.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-medium text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: hit._formatted?.title || hit.title,
                          }}
                        />
                        {hit.category && (
                          <p className="text-xs text-gray-500">{hit.category}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {hit.salePrice ? (
                          <>
                            <p className="text-sm font-semibold text-primary">
                              ${hit.salePrice.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              ${hit.price.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900">
                            ${hit.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 px-4 py-2">
                <Link
                  href={`/products?q=${encodeURIComponent(query)}`}
                  className="block text-center text-xs text-primary hover:underline"
                  onClick={() => {
                    setIsOpen(false)
                    setQuery('')
                  }}
                >
                  View all {results.totalHits} results
                </Link>
                {results.processingTimeMs > 0 && (
                  <p className="mt-1 text-center text-[10px] text-gray-400">
                    Found in {results.processingTimeMs}ms
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
