import type { CollectionConfig } from 'payload'
import { superAdminAccess, authenticatedAccess } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'tenant'],
    group: 'Platform',
  },
  access: {
    read: authenticatedAccess,
    create: superAdminAccess,
    update: authenticatedAccess,
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
        update: superAdminAccess,
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
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
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
