'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { formatPrice } from '@/lib/format'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface OrderItem {
  title: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface OrderDoc {
  id: string
  invoiceNumber: string
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  paymentMethod: string
  items: OrderItem[]
  createdAt: string
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  paid: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  )
}

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/orders?where[customer][equals]=${user.id}&sort=-createdAt&depth=1&limit=50`,
          { credentials: 'include' },
        )
        if (res.ok) {
          const data = (await res.json()) as { docs: OrderDoc[] }
          setOrders(data.docs)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  if (loading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <svg
            className="mx-auto mb-3 h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">No orders yet</h2>
          <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
          <Link href="/products" className="btn-primary mt-4">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{order.invoiceNumber}</p>
                  <p className="mt-1 text-lg font-bold">{formatPrice(order.totalAmount)}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={order.orderStatus} />
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="mt-4 border-t border-gray-50 pt-4">
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                  Items
                </h3>
                <ul className="space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.title} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-medium">{formatPrice(item.totalPrice)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
