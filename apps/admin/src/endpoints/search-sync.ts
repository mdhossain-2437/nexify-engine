import type { PayloadHandler } from 'payload'
import { bulkSyncProducts, initMeilisearchIndex } from '../services/meilisearch'

export const searchSyncHandler: PayloadHandler = async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = req.user as unknown as { role: string }
  if (user.role !== 'super_admin') {
    return Response.json({ error: 'Only super admins can trigger sync' }, { status: 403 })
  }

  try {
    await initMeilisearchIndex()

    let allProducts: Array<Record<string, unknown>> = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const result = await req.payload.find({
        collection: 'products',
        limit: 100,
        page,
        depth: 2,
      })

      allProducts = allProducts.concat(result.docs as Array<Record<string, unknown>>)
      hasMore = result.hasNextPage
      page++
    }

    await bulkSyncProducts(allProducts)

    return Response.json({
      success: true,
      synced: allProducts.length,
      message: `Synced ${allProducts.length} products to Meilisearch`,
    })
  } catch (err) {
    const message = (err as Error).message || 'Sync failed'
    req.payload.logger.error(`Search sync error: ${message}`)
    return Response.json({ error: message }, { status: 500 })
  }
}
