import type { CollectionConfig } from 'payload'
import { tenantAdminAccess, superAdminAccess } from '../access/roles'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subdomain', 'plan', 'status'],
    group: 'Platform',
  },
  access: {
    read: tenantAdminAccess,
    create: superAdminAccess,
    update: superAdminAccess,
    delete: superAdminAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier for this tenant',
      },
    },
    {
      name: 'subdomain',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Subdomain for this tenant (e.g., "mystore" for mystore.nexify.com)',
      },
    },
    {
      name: 'customDomain',
      type: 'text',
      admin: {
        description: 'Custom domain (e.g., "mystore.com")',
      },
    },
    {
      name: 'plan',
      type: 'select',
      required: true,
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Basic', value: 'basic' },
        { label: 'Pro', value: 'pro' },
        { label: 'Premium', value: 'premium' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'activeTheme',
      type: 'relationship',
      relationTo: 'themes',
      admin: {
        description: 'Active theme for this tenant storefront',
        position: 'sidebar',
      },
    },
    {
      name: 'themeConfig',
      type: 'group',
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#2563eb',
        },
        {
          name: 'secondaryColor',
          type: 'text',
          defaultValue: '#64748b',
        },
        {
          name: 'fontFamily',
          type: 'select',
          defaultValue: 'inter',
          options: [
            { label: 'Inter', value: 'inter' },
            { label: 'Roboto', value: 'roboto' },
            { label: 'Open Sans', value: 'open-sans' },
            { label: 'Poppins', value: 'poppins' },
          ],
        },
      ],
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    {
      name: 'storageLimit',
      type: 'number',
      defaultValue: 1024,
      admin: {
        description: 'Storage limit in MB',
      },
    },
    {
      name: 'seoDefaults',
      type: 'group',
      fields: [
        {
          name: 'titleTemplate',
          type: 'text',
          defaultValue: '%s | {{siteName}}',
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Stripe customer ID for subscription billing',
        readOnly: true,
      },
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Active Stripe subscription ID',
        readOnly: true,
      },
    },
    {
      name: 'subscriptionStatus',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Active', value: 'active' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Trialing', value: 'trialing' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
