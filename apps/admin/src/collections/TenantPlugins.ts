import type { CollectionConfig } from 'payload'
import {
  tenantIsolatedReadAccess,
  tenantIsolatedWriteAccess,
  tenantCreateAccess,
} from '../access/roles'

export const TenantPlugins: CollectionConfig = {
  slug: 'tenant-plugins',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['tenant', 'plugin', 'enabled'],
    group: 'Platform',
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
      name: 'plugin',
      type: 'relationship',
      relationTo: 'plugins',
      required: true,
      index: true,
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'settings',
      type: 'json',
      admin: {
        description: 'Plugin-specific settings for this tenant (overrides defaults)',
      },
    },
  ],
}
