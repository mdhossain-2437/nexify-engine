import type { GlobalConfig } from 'payload'

export const TenantSettings: GlobalConfig = {
  slug: 'tenant-settings',
  admin: {
    group: 'Platform',
  },
  fields: [
    {
      name: 'platformName',
      type: 'text',
      defaultValue: 'Nexify Engine',
    },
    {
      name: 'platformLogo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'supportEmail',
      type: 'email',
    },
    {
      name: 'defaultPlan',
      type: 'select',
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Basic', value: 'basic' },
        { label: 'Pro', value: 'pro' },
      ],
    },
    {
      name: 'maxTenantsPerPlan',
      type: 'group',
      fields: [
        { name: 'free', type: 'number', defaultValue: 1 },
        { name: 'basic', type: 'number', defaultValue: 5 },
        { name: 'pro', type: 'number', defaultValue: 20 },
        { name: 'premium', type: 'number', defaultValue: -1 },
      ],
    },
    {
      name: 'storageLimitsPerPlan',
      type: 'group',
      admin: {
        description: 'Storage limits in MB per plan',
      },
      fields: [
        { name: 'free', type: 'number', defaultValue: 256 },
        { name: 'basic', type: 'number', defaultValue: 1024 },
        { name: 'pro', type: 'number', defaultValue: 5120 },
        { name: 'premium', type: 'number', defaultValue: 20480 },
      ],
    },
  ],
}
