import type { PayloadHandler } from 'payload'
import { getMeilisearchClient, PRODUCTS_INDEX } from '../services/meilisearch'

export const searchHandler: PayloadHandler = async (req) => {
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const query = (req.query?.q as string) || ''
  const tenantId = req.query?.tenantId as string | undefined
  const categorySlug = req.query?.category as string | undefined
  const sortParam = req.query?.sort as string | undefined
  const limit = Math.min(Number(req.query?.limit) || 20, 100)
  const page = Math.max(Number(req.query?.page) || 1, 1)
  const offset = (page - 1) * limit

  try {
    const meili = getMeilisearchClient()
    const index = meili.index(PRODUCTS_INDEX)

    const filter: string[] = ['status = "published"']
    if (tenantId) filter.push(`tenantId = "${tenantId}"`)
    if (categorySlug) filter.push(`categorySlug = "${categorySlug}"`)

    let sort: string[] | undefined
    if (sortParam) {
      const direction = sortParam.startsWith('-') ? 'desc' : 'asc'
      const field = sortParam.replace(/^-/, '')
      const allowedSorts = ['price', 'createdAt', 'title']
      if (allowedSorts.includes(field)) {
        sort = [`${field}:${direction}`]
      }
    }

    const results = await index.search(query, {
      filter: filter.join(' AND '),
      sort,
      limit,
      offset,
      attributesToHighlight: ['title', 'description'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    return Response.json({
      hits: results.hits,
      totalHits: results.estimatedTotalHits,
      page,
      limit,
      totalPages: Math.ceil((results.estimatedTotalHits || 0) / limit),
      processingTimeMs: results.processingTimeMs,
      query: results.query,
    })
  } catch (err) {
    const message = (err as Error).message || 'Search unavailable'

    if (
      message.includes('ECONNREFUSED') ||
      message.includes('fetch failed') ||
      message.includes('not found')
    ) {
      return Response.json({
        hits: [],
        totalHits: 0,
        page: 1,
        limit,
        totalPages: 0,
        processingTimeMs: 0,
        query,
        fallback: true,
        message: 'Search service unavailable, using basic search',
      })
    }

    return Response.json({ error: message }, { status: 500 })
  }
}
