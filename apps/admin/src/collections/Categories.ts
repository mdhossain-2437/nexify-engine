import type { CollectionConfig } from 'payload'
import {
  tenantIsolatedReadAccess,
  tenantCreateAccess,
  tenantIsolatedWriteAccess,
} from '../access/roles'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'tenant'],
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Parent category for nested hierarchies',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
