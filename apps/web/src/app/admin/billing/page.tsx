'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Plan {
  id: string
  name: string
  features: string[]
  limits: {
    products: number
    storage: number
    customDomain: boolean
  }
  hasMonthly: boolean
  hasYearly: boolean
}

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  basic: { monthly: 29, yearly: 290 },
  pro: { monthly: 79, yearly: 790 },
  premium: { monthly: 199, yearly: 1990 },
}

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/subscription/plans`)
      if (res.ok) {
        const data = await res.json()
        setPlans(data.plans)
      }
    } catch {
      setError('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return
    setSubscribing(planId)
    setError(null)

    try {
      const tenantId = new URLSearchParams(window.location.search).get('tenantId') || '1'
      const res = await fetch(`${API_URL}/api/subscription/create`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          plan: planId,
          interval,
          successUrl: `${window.location.origin}/admin/billing?success=true`,
          cancelUrl: `${window.location.origin}/admin/billing?cancelled=true`,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create subscription')
      }
    } catch {
      setError('Failed to connect to billing service')
    } finally {
      setSubscribing(null)
    }
  }

  const handleManageBilling = async () => {
    try {
      const tenantId = new URLSearchParams(window.location.search).get('tenantId') || '1'
      const res = await fetch(`${API_URL}/api/subscription/manage`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          returnUrl: window.location.href,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Could not open billing portal')
      }
    } catch {
      setError('Failed to connect to billing service')
    }
  }

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
            <Link href="/" className="text-2xl font-bold text-primary">
              Nexify Engine
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-700">Billing & Plans</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleManageBilling}
              className="text-sm text-gray-600 hover:text-primary"
            >
              Manage Billing
            </button>
            <Link
              href="/admin/analytics"
              className="text-sm text-gray-600 hover:text-primary"
            >
              Analytics
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose the right plan for your store
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Scale your e-commerce business with the tools you need. Upgrade or downgrade anytime.
          </p>

          <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setInterval('monthly')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                interval === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                interval === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600 font-semibold">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const price = PLAN_PRICES[plan.id] || { monthly: 0, yearly: 0 }
            const currentPrice = interval === 'yearly' ? price.yearly : price.monthly
            const isPopular = plan.id === 'pro'

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border bg-white p-6 ${
                  isPopular
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-200'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${currentPrice}
                    </span>
                    {plan.id !== 'free' && (
                      <span className="text-gray-500 text-sm">
                        /{interval === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={plan.id === 'free' || subscribing === plan.id}
                  className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    plan.id === 'free'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isPopular
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {subscribing === plan.id
                    ? 'Redirecting...'
                    : plan.id === 'free'
                      ? 'Current Plan'
                      : 'Upgrade'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-16 rounded-2xl bg-white border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="py-3 px-4 text-center font-medium text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-4 text-gray-600">Products</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-3 px-4 text-center text-gray-900">
                      {plan.limits.products === -1 ? 'Unlimited' : plan.limits.products}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">Storage</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-3 px-4 text-center text-gray-900">
                      {plan.limits.storage >= 1024
                        ? `${(plan.limits.storage / 1024).toFixed(0)}GB`
                        : `${plan.limits.storage}MB`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">Custom Domain</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-3 px-4 text-center">
                      {plan.limits.customDomain ? (
                        <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
