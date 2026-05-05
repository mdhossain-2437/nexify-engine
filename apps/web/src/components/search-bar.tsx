'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = 'Search products…', className = '' }: SearchBarProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(params.get('q') ?? '')

  useEffect(() => {
    setValue(params.get('q') ?? '')
  }, [params])

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        const next = new URLSearchParams(params.toString())
        if (value.trim()) {
          next.set('q', value.trim())
        } else {
          next.delete('q')
        }
        next.delete('page')
        router.push(`/products?${next.toString()}`)
      }}
      className={className}
    >
      <label htmlFor="storefront-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <input
          id="storefront-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
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
      </div>
    </form>
  )
}
