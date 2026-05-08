'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface AnalyticsData {
  overview: {
    totalOrders: number
    totalRevenue: number
    paidOrders: number
    pendingOrders: number
    cancelledOrders: number
    totalProducts: number
    totalCustomers: number
    averageOrderValue: number
  }
  monthlyRevenue: Record<string, number>
  ordersByStatus: Record<string, number>
  recentOrders: Array<{
    id: string
    invoiceNumber: string
    totalAmount: number
    orderStatus: string
    paymentStatus: string
    createdAt: string
    customer?: { name?: string; email?: string }
  }>
  topProducts: Array<{
    id: string
    title: string
    price: number
    stock: number
    status: string
  }>
}

function StatCard({
  label,
  value,
  subtext,
  color,
}: {
  label: string
  value: string | number
  subtext?: string
  color: string
}) {
  return (
    <div className={`bg-white rounded-xl border p-6 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  )
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/analytics`, {
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 401) {
          setError('Please log in to the admin panel first at ' + API_URL + '/admin')
          return
        }
        throw new Error('Failed to fetch analytics')
      }
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              setError(null)
              fetchAnalytics()
            }}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { overview, monthlyRevenue, ordersByStatus, recentOrders, topProducts } = data

  const sortedMonths = Object.keys(monthlyRevenue).sort()
  const maxRevenue = Math.max(...Object.values(monthlyRevenue), 1)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Nexify Engine
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-700">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/billing"
              className="text-sm text-gray-600 hover:text-primary"
            >
              Billing
            </Link>
            <a
              href={`${API_URL}/admin`}
              className="text-sm text-gray-600 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Admin Panel
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Revenue"
            value={`$${overview.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subtext={`${overview.paidOrders} paid orders`}
            color="border-l-green-500"
          />
          <StatCard
            label="Total Orders"
            value={overview.totalOrders}
            subtext={`${overview.pendingOrders} pending`}
            color="border-l-blue-500"
          />
          <StatCard
            label="Total Products"
            value={overview.totalProducts}
            color="border-l-purple-500"
          />
          <StatCard
            label="Total Customers"
            value={overview.totalCustomers}
            subtext={`Avg order: $${overview.averageOrderValue.toFixed(2)}`}
            color="border-l-orange-500"
          />
        </div>

        {/* Conversion & Growth Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Conversion Rate"
            value={
              overview.totalCustomers > 0
                ? `${((overview.paidOrders / overview.totalCustomers) * 100).toFixed(1)}%`
                : '0%'
            }
            subtext="Paid orders / customers"
            color="border-l-teal-500"
          />
          <StatCard
            label="Cancellation Rate"
            value={
              overview.totalOrders > 0
                ? `${((overview.cancelledOrders / overview.totalOrders) * 100).toFixed(1)}%`
                : '0%'
            }
            subtext={`${overview.cancelledOrders} cancelled`}
            color="border-l-red-500"
          />
          <StatCard
            label="Fulfillment Rate"
            value={
              overview.totalOrders > 0
                ? `${(((overview.totalOrders - overview.pendingOrders - overview.cancelledOrders) / overview.totalOrders) * 100).toFixed(1)}%`
                : '0%'
            }
            subtext="Orders processed"
            color="border-l-indigo-500"
          />
          <StatCard
            label="Revenue/Customer"
            value={
              overview.totalCustomers > 0
                ? `$${(overview.totalRevenue / overview.totalCustomers).toFixed(2)}`
                : '$0'
            }
            subtext="Lifetime value"
            color="border-l-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
            {sortedMonths.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No revenue data yet</p>
            ) : (
              <div className="flex items-end gap-2 h-48">
                {sortedMonths.map((month) => {
                  const value = monthlyRevenue[month]
                  const height = Math.max((value / maxRevenue) * 100, 4)
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500">${value.toLocaleString()}</span>
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-gray-400">{month.slice(5)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
            <div className="space-y-3">
              {Object.entries(ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Invoice</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-2 font-mono text-xs">{order.invoiceNumber}</td>
                        <td className="py-2">${order.totalAmount?.toFixed(2)}</td>
                        <td className="py-2">
                          <StatusBadge status={order.orderStatus} />
                        </td>
                        <td className="py-2">
                          <StatusBadge status={order.paymentStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            {topProducts.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No products yet</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${product.price?.toFixed(2)}</p>
                      <StatusBadge status={product.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
