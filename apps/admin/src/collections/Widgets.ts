import type { CollectionConfig } from 'payload'
import {
  tenantIsolatedReadAccess,
  tenantIsolatedWriteAccess,
  tenantCreateAccess,
} from '../access/roles'

export const Widgets: CollectionConfig = {
  slug: 'widgets',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'area', 'order', 'tenant'],
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
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Recent Products', value: 'recent-products' },
        { label: 'Featured Products', value: 'featured-products' },
        { label: 'Categories', value: 'categories' },
        { label: 'Recent Blog Posts', value: 'recent-posts' },
        { label: 'Newsletter Signup', value: 'newsletter' },
        { label: 'Social Links', value: 'social-links' },
        { label: 'Contact Info', value: 'contact-info' },
        { label: 'Custom HTML', value: 'custom-html' },
        { label: 'Banner Image', value: 'banner' },
        { label: 'Text Block', value: 'text-block' },
        { label: 'Tag Cloud', value: 'tag-cloud' },
        { label: 'Search', value: 'search' },
      ],
    },
    {
      name: 'area',
      type: 'select',
      required: true,
      options: [
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Footer Row 1', value: 'footer-1' },
        { label: 'Footer Row 2', value: 'footer-2' },
        { label: 'Homepage Top', value: 'homepage-top' },
        { label: 'Homepage Bottom', value: 'homepage-bottom' },
        { label: 'Product Page Sidebar', value: 'product-sidebar' },
        { label: 'Blog Sidebar', value: 'blog-sidebar' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower = first)',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'config',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Widget heading (optional)',
          },
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 5,
          admin: {
            description: 'Number of items to display',
          },
        },
        {
          name: 'showImage',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'customContent',
          type: 'richText',
          admin: {
            condition: (data, siblingData) => {
              const parentType = (data as Record<string, unknown>)?.type
              return parentType === 'custom-html' || parentType === 'text-block'
            },
          },
        },
        {
          name: 'bannerImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => {
              const parentType = (data as Record<string, unknown>)?.type
              return parentType === 'banner'
            },
          },
        },
        {
          name: 'bannerLink',
          type: 'text',
          admin: {
            condition: (data, siblingData) => {
              const parentType = (data as Record<string, unknown>)?.type
              return parentType === 'banner'
            },
          },
        },
        {
          name: 'newsletterTitle',
          type: 'text',
          defaultValue: 'Subscribe to our newsletter',
          admin: {
            condition: (data, siblingData) => {
              const parentType = (data as Record<string, unknown>)?.type
              return parentType === 'newsletter'
            },
          },
        },
        {
          name: 'newsletterDescription',
          type: 'textarea',
          admin: {
            condition: (data, siblingData) => {
              const parentType = (data as Record<string, unknown>)?.type
              return parentType === 'newsletter'
            },
          },
        },
      ],
    },
  ],
}
