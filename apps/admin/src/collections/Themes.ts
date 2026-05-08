import type { CollectionConfig } from 'payload'
import { superAdminAccess, tenantAdminAccess } from '../access/roles'

export const Themes: CollectionConfig = {
  slug: 'themes',
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
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'E-Commerce', value: 'ecommerce' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Blog', value: 'blog' },
        { label: 'Business', value: 'business' },
        { label: 'Landing Page', value: 'landing' },
      ],
    },
    {
      name: 'isBuiltIn',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Built-in themes cannot be deleted',
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
      name: 'colors',
      type: 'group',
      fields: [
        { name: 'primary', type: 'text', defaultValue: '#2563eb' },
        { name: 'secondary', type: 'text', defaultValue: '#64748b' },
        { name: 'accent', type: 'text', defaultValue: '#f59e0b' },
        { name: 'background', type: 'text', defaultValue: '#ffffff' },
        { name: 'surface', type: 'text', defaultValue: '#f8fafc' },
        { name: 'text', type: 'text', defaultValue: '#0f172a' },
        { name: 'textMuted', type: 'text', defaultValue: '#64748b' },
        { name: 'border', type: 'text', defaultValue: '#e2e8f0' },
        { name: 'success', type: 'text', defaultValue: '#22c55e' },
        { name: 'error', type: 'text', defaultValue: '#ef4444' },
        { name: 'warning', type: 'text', defaultValue: '#f59e0b' },
      ],
    },
    {
      name: 'typography',
      type: 'group',
      fields: [
        {
          name: 'headingFont',
          type: 'select',
          defaultValue: 'inter',
          options: [
            { label: 'Inter', value: 'inter' },
            { label: 'Roboto', value: 'roboto' },
            { label: 'Open Sans', value: 'open-sans' },
            { label: 'Poppins', value: 'poppins' },
            { label: 'Playfair Display', value: 'playfair-display' },
            { label: 'Montserrat', value: 'montserrat' },
            { label: 'DM Sans', value: 'dm-sans' },
            { label: 'Plus Jakarta Sans', value: 'plus-jakarta-sans' },
          ],
        },
        {
          name: 'bodyFont',
          type: 'select',
          defaultValue: 'inter',
          options: [
            { label: 'Inter', value: 'inter' },
            { label: 'Roboto', value: 'roboto' },
            { label: 'Open Sans', value: 'open-sans' },
            { label: 'Poppins', value: 'poppins' },
            { label: 'Lato', value: 'lato' },
            { label: 'Nunito', value: 'nunito' },
            { label: 'DM Sans', value: 'dm-sans' },
            { label: 'Plus Jakarta Sans', value: 'plus-jakarta-sans' },
          ],
        },
        {
          name: 'baseFontSize',
          type: 'number',
          defaultValue: 16,
          min: 12,
          max: 24,
        },
        {
          name: 'headingWeight',
          type: 'select',
          defaultValue: '700',
          options: [
            { label: 'Normal (400)', value: '400' },
            { label: 'Medium (500)', value: '500' },
            { label: 'Semibold (600)', value: '600' },
            { label: 'Bold (700)', value: '700' },
            { label: 'Extrabold (800)', value: '800' },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'headerStyle',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Centered', value: 'centered' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Transparent', value: 'transparent' },
          ],
        },
        {
          name: 'footerStyle',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Expanded', value: 'expanded' },
            { label: 'Centered', value: 'centered' },
          ],
        },
        {
          name: 'productCardStyle',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Overlay', value: 'overlay' },
            { label: 'Bordered', value: 'bordered' },
          ],
        },
        {
          name: 'borderRadius',
          type: 'select',
          defaultValue: 'md',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small (4px)', value: 'sm' },
            { label: 'Medium (8px)', value: 'md' },
            { label: 'Large (12px)', value: 'lg' },
            { label: 'Extra Large (16px)', value: 'xl' },
            { label: 'Full (9999px)', value: 'full' },
          ],
        },
        {
          name: 'containerWidth',
          type: 'select',
          defaultValue: '1280',
          options: [
            { label: 'Narrow (960px)', value: '960' },
            { label: 'Default (1280px)', value: '1280' },
            { label: 'Wide (1440px)', value: '1440' },
            { label: 'Full Width', value: 'full' },
          ],
        },
      ],
    },
    {
      name: 'customCSS',
      type: 'textarea',
      admin: {
        description: 'Custom CSS overrides (advanced)',
      },
    },
  ],
}
