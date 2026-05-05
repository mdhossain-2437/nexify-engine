import type { CollectionConfig } from 'payload'
import { tenantIsolatedReadAccess, tenantCreateAccess, tenantIsolatedWriteAccess } from '../access/roles'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'tenant'],
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'contentBlocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'hero',
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subheading', type: 'text' },
            { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
            { name: 'ctaText', type: 'text' },
            { name: 'ctaLink', type: 'text' },
          ],
        },
        {
          slug: 'textContent',
          fields: [
            { name: 'content', type: 'richText', required: true },
          ],
        },
        {
          slug: 'imageText',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'heading', type: 'text' },
            { name: 'text', type: 'richText', required: true },
            {
              name: 'imagePosition',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
        {
          slug: 'productGrid',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'source',
              type: 'select',
              defaultValue: 'featured',
              options: [
                { label: 'Featured Products', value: 'featured' },
                { label: 'Latest Products', value: 'latest' },
                { label: 'By Category', value: 'category' },
              ],
            },
            { name: 'category', type: 'relationship', relationTo: 'categories' },
            { name: 'limit', type: 'number', defaultValue: 8 },
          ],
        },
        {
          slug: 'banner',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'heading', type: 'text' },
            { name: 'text', type: 'text' },
            { name: 'link', type: 'text' },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full Width', value: 'full' },
                { label: 'Contained', value: 'contained' },
              ],
            },
          ],
        },
        {
          slug: 'testimonials',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'role', type: 'text' },
                { name: 'quote', type: 'textarea', required: true },
                { name: 'avatar', type: 'upload', relationTo: 'media' },
                { name: 'rating', type: 'number', min: 1, max: 5 },
              ],
            },
          ],
        },
        {
          slug: 'cta',
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'text', type: 'textarea' },
            { name: 'buttonText', type: 'text', required: true },
            { name: 'buttonLink', type: 'text', required: true },
            {
              name: 'variant',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
              ],
            },
          ],
        },
        {
          slug: 'faq',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
