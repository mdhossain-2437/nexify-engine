'use client'

import { useEffect, useState } from 'react'

/**
 * Returns `true` only after the first client render. Use this to guard any UI
 * that depends on browser-only state (e.g. zustand's persisted cart) so the
 * SSR markup stays deterministic and React doesn't log a hydration warning.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
