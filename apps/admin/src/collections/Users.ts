import type { CollectionConfig } from 'payload'
import {
  superAdminAccess,
  selfOrAdminAccess,
  superAdminFieldAccess,
} from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'tenant'],
    group: 'Platform',
  },
  access: {
    read: selfOrAdminAccess,
    create: superAdminAccess,
    update: selfOrAdminAccess,
    delete: superAdminAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Tenant Admin', value: 'tenant_admin' },
        { label: 'Staff', value: 'staff' },
        { label: 'Customer', value: 'customer' },
      ],
      access: {
        update: superAdminFieldAccess,
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      access: {
        update: superAdminFieldAccess,
      },
      admin: {
        description: 'The tenant this user belongs to (null for super admins)',
        condition: (data) => data?.role !== 'super_admin',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Banned', value: 'banned' },
      ],
      access: {
        update: superAdminFieldAccess,
      },
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
