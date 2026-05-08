import type { CollectionConfig } from 'payload'
import {
  tenantIsolatedReadAccess,
  tenantCreateAccess,
  tenantIsolatedWriteAccess,
} from '../access/roles'
import { syncProductToMeilisearch, removeProductFromMeilisearch } from '../services/meilisearch'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'stock', 'status', 'tenant'],
    group: 'Commerce',
  },
  access: {
    read: tenantIsolatedReadAccess,
    create: tenantCreateAccess,
    update: tenantIsolatedWriteAccess,
    delete: tenantIsolatedWriteAccess,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' || operation === 'update') {
          void syncProductToMeilisearch(doc as Record<string, unknown>)
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        void removeProductFromMeilisearch((doc as Record<string, unknown>).id as string | number)
      },
    ],
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly product identifier',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'salePrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Discounted price (leave empty for no discount)',
      },
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'sku',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      admin: {
        description: 'Product variants (size, color, etc.)',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'color',
          type: 'text',
        },
        {
          name: 'size',
          type: 'text',
        },
        {
          name: 'priceModifier',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Amount to add/subtract from base price',
          },
        },
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'sku',
          type: 'text',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title (defaults to product title if empty)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
