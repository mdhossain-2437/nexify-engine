import type { CollectionConfig } from 'payload'
import {
  tenantIsolatedReadAccess,
  tenantIsolatedWriteAccess,
  tenantCreateAccess,
} from '../access/roles'

export const Menus: CollectionConfig = {
  slug: 'menus',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'tenant'],
    group: 'Content',
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'select',
      required: true,
      options: [
        { label: 'Primary Header', value: 'header-primary' },
        { label: 'Secondary Header', value: 'header-secondary' },
        { label: 'Footer Column 1', value: 'footer-1' },
        { label: 'Footer Column 2', value: 'footer-2' },
        { label: 'Footer Column 3', value: 'footer-3' },
        { label: 'Mobile Navigation', value: 'mobile' },
        { label: 'Sidebar', value: 'sidebar' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'link',
          options: [
            { label: 'Custom Link', value: 'link' },
            { label: 'Page', value: 'page' },
            { label: 'Product Category', value: 'category' },
            { label: 'Blog', value: 'blog' },
            { label: 'Products', value: 'products' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'link',
            description: 'URL for custom links',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'page',
          },
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'category',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Optional icon name',
          },
        },
        {
          name: 'children',
          type: 'array',
          admin: {
            description: 'Submenu items (one level deep)',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'link',
              options: [
                { label: 'Custom Link', value: 'link' },
                { label: 'Page', value: 'page' },
                { label: 'Product Category', value: 'category' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'link',
              },
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'page',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'category',
              },
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
