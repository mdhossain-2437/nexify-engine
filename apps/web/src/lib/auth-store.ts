'use client'

import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  phone?: string | null
  avatar?: { url?: string } | null
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  setUser: (user: AuthUser | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  updateProfile: (data: Partial<Pick<AuthUser, 'name' | 'phone'>>) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(
        (data as { errors?: { message: string }[] }).errors?.[0]?.message ||
          'Invalid email or password',
      )
    }
    const data = (await res.json()) as { user: AuthUser }
    set({ user: data.user })
  },

  register: async ({ name, email, password }) => {
    const res = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, role: 'customer' }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(
        (data as { errors?: { message: string }[] }).errors?.[0]?.message || 'Registration failed',
      )
    }
    // Auto-login after registration
    await get().login(email, password)
  },

  logout: async () => {
    await fetch(`${API_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {})
    set({ user: null })
  },

  fetchMe: async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        credentials: 'include',
      })
      if (!res.ok) {
        set({ user: null, loading: false })
        return
      }
      const data = (await res.json()) as { user: AuthUser | null }
      set({ user: data.user ?? null, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  updateProfile: async (data) => {
    const { user } = get()
    if (!user) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(
        (err as { errors?: { message: string }[] }).errors?.[0]?.message || 'Update failed',
      )
    }
    const updated = (await res.json()) as { doc: AuthUser }
    set({ user: updated.doc })
  },
}))
