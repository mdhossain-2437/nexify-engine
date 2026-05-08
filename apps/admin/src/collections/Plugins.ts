import type { CollectionConfig } from 'payload'
import { superAdminAccess, tenantAdminAccess } from '../access/roles'

export const Plugins: CollectionConfig = {
  slug: 'plugins',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'category', 'isBuiltIn', 'status'],
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
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon name (e.g., "search", "analytics", "mail")',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'utility',
      options: [
        { label: 'SEO', value: 'seo' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Communication', value: 'communication' },
        { label: 'Social', value: 'social' },
        { label: 'Payment', value: 'payment' },
        { label: 'Shipping', value: 'shipping' },
        { label: 'Utility', value: 'utility' },
        { label: 'Security', value: 'security' },
        { label: 'Content', value: 'content' },
      ],
    },
    {
      name: 'isBuiltIn',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Built-in plugins ship with the platform',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Deprecated', value: 'deprecated' },
      ],
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: '1.0.0',
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Nexify Engine',
    },
    {
      name: 'requiredPlan',
      type: 'select',
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Basic', value: 'basic' },
        { label: 'Pro', value: 'pro' },
        { label: 'Premium', value: 'premium' },
      ],
      admin: {
        description: 'Minimum plan required to use this plugin',
      },
    },
    {
      name: 'hooks',
      type: 'array',
      admin: {
        description: 'Lifecycle hooks this plugin subscribes to',
      },
      fields: [
        {
          name: 'event',
          type: 'select',
          required: true,
          options: [
            { label: 'Page Render', value: 'page:render' },
            { label: 'Product View', value: 'product:view' },
            { label: 'Cart Updated', value: 'cart:updated' },
            { label: 'Order Created', value: 'order:created' },
            { label: 'Order Completed', value: 'order:completed' },
            { label: 'User Registered', value: 'user:registered' },
            { label: 'User Login', value: 'user:login' },
            { label: 'Search Query', value: 'search:query' },
            { label: 'Checkout Start', value: 'checkout:start' },
            { label: 'Checkout Complete', value: 'checkout:complete' },
            { label: 'Theme Changed', value: 'theme:changed' },
            { label: 'Head Inject', value: 'head:inject' },
            { label: 'Footer Inject', value: 'footer:inject' },
          ],
        },
        {
          name: 'priority',
          type: 'number',
          defaultValue: 10,
          admin: {
            description: 'Lower = runs first (default: 10)',
          },
        },
      ],
    },
    {
      name: 'settings',
      type: 'json',
      admin: {
        description: 'Default plugin settings schema (JSON)',
      },
    },
    {
      name: 'headCode',
      type: 'textarea',
      admin: {
        description: 'HTML/JS to inject into <head> when plugin is active',
      },
    },
    {
      name: 'footerCode',
      type: 'textarea',
      admin: {
        description: 'HTML/JS to inject before </body> when plugin is active',
      },
    },
  ],
}
