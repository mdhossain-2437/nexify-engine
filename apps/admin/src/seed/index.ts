import { getPayload } from 'payload'
import config from '../payload.config'
import type { Product } from '../payload-types'

type SeedProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding database...')

  // Create super admin user
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@nexify.com' } },
  })

  if (existingAdmin.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@nexify.com',
        password: 'admin123456',
        name: 'Super Admin',
        role: 'super_admin',
        status: 'active',
      },
    })
    console.log('Created super admin: admin@nexify.com / admin123456')
  }

  // Create a demo tenant
  const existingTenant = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: 'demo-store' } },
  })

  let tenantId: number
  if (existingTenant.totalDocs === 0) {
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'Demo Store',
        slug: 'demo-store',
        subdomain: 'demo',
        plan: 'pro',
        status: 'active',
        contactEmail: 'demo@nexify.com',
        themeConfig: {
          primaryColor: '#2563eb',
          secondaryColor: '#64748b',
          fontFamily: 'inter',
        },
      },
    })
    tenantId = tenant.id as number
    console.log('Created demo tenant: Demo Store')
  } else {
    tenantId = existingTenant.docs[0].id as number
  }

  // Create tenant admin
  const existingTenantAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: 'tenant@nexify.com' } },
  })

  if (existingTenantAdmin.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'tenant@nexify.com',
        password: 'tenant123456',
        name: 'Demo Tenant Admin',
        role: 'tenant_admin',
        status: 'active',
        tenant: tenantId,
      },
    })
    console.log('Created tenant admin: tenant@nexify.com / tenant123456')
  }

  // Create demo categories
  const existingCategory = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'electronics' } },
  })

  let categoryId: number
  if (existingCategory.totalDocs === 0) {
    const category = await payload.create({
      collection: 'categories',
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        tenant: tenantId,
      },
    })
    categoryId = category.id as number

    await payload.create({
      collection: 'categories',
      data: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        tenant: tenantId,
      },
    })

    console.log('Created demo categories')
  } else {
    categoryId = existingCategory.docs[0].id as number
  }

  // Create demo products
  const existingProducts = await payload.find({
    collection: 'products',
    where: { tenant: { equals: tenantId } },
  })

  if (existingProducts.totalDocs === 0) {
    const products: SeedProduct[] = [
      {
        title: 'Wireless Headphones Pro',
        slug: 'wireless-headphones-pro',
        price: 149.99,
        salePrice: 129.99,
        stock: 50,
        sku: 'WHP-001',
        status: 'published' as const,
        featured: true,
        category: categoryId,
        tenant: tenantId,
        seo: {
          title: 'Wireless Headphones Pro - Premium Sound Quality',
          description: 'Experience premium audio with our Wireless Headphones Pro. Active noise cancellation, 30-hour battery life.',
        },
      },
      {
        title: 'Smart Watch Ultra',
        slug: 'smart-watch-ultra',
        price: 299.99,
        stock: 30,
        sku: 'SWU-001',
        status: 'published' as const,
        featured: true,
        category: categoryId,
        tenant: tenantId,
        seo: {
          title: 'Smart Watch Ultra - Advanced Fitness Tracking',
          description: 'Track your fitness goals with Smart Watch Ultra. GPS, heart rate monitoring, and more.',
        },
      },
      {
        title: 'Portable Bluetooth Speaker',
        slug: 'portable-bluetooth-speaker',
        price: 79.99,
        salePrice: 59.99,
        stock: 100,
        sku: 'PBS-001',
        status: 'published' as const,
        featured: false,
        category: categoryId,
        tenant: tenantId,
      },
    ]

    for (const product of products) {
      await payload.create({ collection: 'products', data: product })
    }
    console.log('Created demo products')
  }

  // Create demo pages
  const existingPages = await payload.find({
    collection: 'pages',
    where: { tenant: { equals: tenantId } },
  })

  if (existingPages.totalDocs === 0) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        status: 'published',
        tenant: tenantId,
        contentBlocks: [
          {
            blockType: 'hero',
            heading: 'Welcome to Demo Store',
            subheading: 'Discover amazing products at great prices',
            ctaText: 'Shop Now',
            ctaLink: '/products',
          },
          {
            blockType: 'productGrid',
            heading: 'Featured Products',
            source: 'featured',
            limit: 8,
          },
        ],
        seo: {
          title: 'Demo Store - Your Online Shopping Destination',
          description: 'Discover amazing products at great prices. Shop electronics, clothing, and more.',
        },
      },
    })

    await payload.create({
      collection: 'pages',
      data: {
        title: 'About Us',
        slug: 'about',
        status: 'published',
        tenant: tenantId,
        contentBlocks: [
          {
            blockType: 'textContent',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'We are a modern online store committed to providing the best products.',
                      },
                    ],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
      },
    })

    console.log('Created demo pages')
  }

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
