'use client'

import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'

export default function AccountPage() {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Account</h1>

      <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/account/orders"
          className="rounded-2xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <svg
            className="mb-3 h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="font-semibold">Orders</h3>
          <p className="mt-1 text-sm text-gray-500">View your order history</p>
        </Link>

        <Link
          href="/account/wishlist"
          className="rounded-2xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <svg
            className="mb-3 h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="font-semibold">Wishlist</h3>
          <p className="mt-1 text-sm text-gray-500">Products you&apos;ve saved</p>
        </Link>

        <Link
          href="/account/settings"
          className="rounded-2xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <svg
            className="mb-3 h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="font-semibold">Settings</h3>
          <p className="mt-1 text-sm text-gray-500">Update your profile</p>
        </Link>
      </div>
    </div>
  )
}
