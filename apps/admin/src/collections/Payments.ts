import type { CollectionConfig } from 'payload'
import {
  tenantIsolatedReadAccess,
  tenantCreateAccess,
  tenantIsolatedWriteAccess,
} from '../access/roles'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'transactionId',
    defaultColumns: ['transactionId', 'provider', 'amount', 'status', 'createdAt'],
    group: 'Commerce',
  },
  access: {
    read: tenantIsolatedReadAccess,
    create: tenantCreateAccess,
    update: tenantIsolatedWriteAccess,
    delete: tenantIsolatedWriteAccess,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'SSLCommerz', value: 'sslcommerz' },
        { label: 'Manual', value: 'manual' },
      ],
    },
    {
      name: 'transactionId',
      type: 'text',
      index: true,
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      index: true,
      admin: {
        description: 'Stripe Checkout Session ID',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'usd',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'rawResponse',
      type: 'json',
      admin: {
        description: 'Raw gateway response data',
      },
    },
  ],
}
