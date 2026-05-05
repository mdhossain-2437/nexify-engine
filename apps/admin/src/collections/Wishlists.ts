import type { CollectionConfig } from 'payload'

export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'product', 'createdAt'],
    group: 'Commerce',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      const u = user as unknown as { id: string; role: string }
      if (u.role === 'super_admin') return true
      return { user: { equals: u.id } }
    },
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => {
      if (!user) return false
      const u = user as unknown as { id: string; role: string }
      if (u.role === 'super_admin') return true
      return { user: { equals: u.id } }
    },
    update: () => false,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && req.payload) {
          const existing = await req.payload.find({
            collection: 'wishlists',
            where: {
              user: { equals: data.user },
              product: { equals: data.product },
              tenant: { equals: data.tenant },
            },
            limit: 1,
          })
          if (existing.docs.length > 0) {
            throw new Error('Product is already in your wishlist')
          }
        }
        if (operation === 'create' && !data.user && req.user) {
          data.user = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
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
  ],
}
