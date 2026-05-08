import { Meilisearch } from 'meilisearch'

let client: Meilisearch | null = null

function getMeilisearchUrl(): string {
  return process.env.MEILISEARCH_URL || 'http://localhost:7700'
}

function getMeilisearchKey(): string {
  return process.env.MEILISEARCH_API_KEY || ''
}

export function getMeilisearchClient(): Meilisearch {
  if (!client) {
    client = new Meilisearch({
      host: getMeilisearchUrl(),
      apiKey: getMeilisearchKey(),
    })
  }
  return client
}

export const PRODUCTS_INDEX = 'products'

export interface MeilisearchProduct {
  id: string | number
  title: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  stock: number
  category: string
  categorySlug: string
  status: string
  featured: boolean
  tenantId: string | number
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export async function initMeilisearchIndex(): Promise<void> {
  try {
    const meili = getMeilisearchClient()
    const index = meili.index(PRODUCTS_INDEX)

    await meili.createIndex(PRODUCTS_INDEX, { primaryKey: 'id' })

    await index.updateFilterableAttributes([
      'tenantId',
      'category',
      'categorySlug',
      'status',
      'featured',
      'price',
    ])

    await index.updateSortableAttributes(['price', 'createdAt', 'title'])

    await index.updateSearchableAttributes(['title', 'description', 'category'])

    console.log('[Meilisearch] Index initialized successfully')
  } catch (err) {
    console.warn('[Meilisearch] Could not initialize index:', (err as Error).message)
  }
}

export async function syncProductToMeilisearch(
  product: Record<string, unknown>,
): Promise<void> {
  try {
    const meili = getMeilisearchClient()
    const index = meili.index(PRODUCTS_INDEX)

    const category = product.category as Record<string, unknown> | null
    const images = product.images as Array<{ image?: { url?: string } }> | undefined
    const tenant = product.tenant as Record<string, unknown> | string | number | null

    const doc: MeilisearchProduct = {
      id: product.id as string | number,
      title: (product.title as string) || '',
      slug: (product.slug as string) || '',
      description: (product.description as string) || '',
      price: (product.price as number) || 0,
      salePrice: (product.salePrice as number) || null,
      stock: (product.stock as number) || 0,
      category: (category?.name as string) || '',
      categorySlug: (category?.slug as string) || '',
      status: (product.status as string) || 'draft',
      featured: (product.featured as boolean) || false,
      tenantId: tenant
        ? typeof tenant === 'object'
          ? (tenant.id as string | number)
          : tenant
        : '',
      imageUrl: images?.[0]?.image?.url || null,
      createdAt: (product.createdAt as string) || '',
      updatedAt: (product.updatedAt as string) || '',
    }

    await index.addDocuments([doc])
  } catch (err) {
    console.warn('[Meilisearch] Sync failed:', (err as Error).message)
  }
}

export async function removeProductFromMeilisearch(
  productId: string | number,
): Promise<void> {
  try {
    const meili = getMeilisearchClient()
    const index = meili.index(PRODUCTS_INDEX)
    await index.deleteDocument(productId)
  } catch (err) {
    console.warn('[Meilisearch] Delete failed:', (err as Error).message)
  }
}

export async function bulkSyncProducts(
  products: Array<Record<string, unknown>>,
): Promise<void> {
  try {
    const meili = getMeilisearchClient()
    const index = meili.index(PRODUCTS_INDEX)

    const docs: MeilisearchProduct[] = products.map((product) => {
      const category = product.category as Record<string, unknown> | null
      const images = product.images as Array<{ image?: { url?: string } }> | undefined
      const tenant = product.tenant as Record<string, unknown> | string | number | null

      return {
        id: product.id as string | number,
        title: (product.title as string) || '',
        slug: (product.slug as string) || '',
        description: (product.description as string) || '',
        price: (product.price as number) || 0,
        salePrice: (product.salePrice as number) || null,
        stock: (product.stock as number) || 0,
        category: (category?.name as string) || '',
        categorySlug: (category?.slug as string) || '',
        status: (product.status as string) || 'draft',
        featured: (product.featured as boolean) || false,
        tenantId: tenant
          ? typeof tenant === 'object'
            ? (tenant.id as string | number)
            : tenant
          : '',
        imageUrl: images?.[0]?.image?.url || null,
        createdAt: (product.createdAt as string) || '',
        updatedAt: (product.updatedAt as string) || '',
      }
    })

    await index.addDocuments(docs)
    console.log(`[Meilisearch] Bulk synced ${docs.length} products`)
  } catch (err) {
    console.warn('[Meilisearch] Bulk sync failed:', (err as Error).message)
  }
}
