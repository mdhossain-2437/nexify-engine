'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 800)
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
        <p className="text-sm font-medium text-emerald-400">
          You&apos;re subscribed! Check your inbox for a welcome email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  )
}
