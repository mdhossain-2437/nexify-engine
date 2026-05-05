import type { PayloadHandler, Where } from 'payload'

function buildWhere(tenantId: string | null, extra?: Where): Where {
  const where: Where = {}
  if (tenantId) {
    where['tenant'] = { equals: tenantId }
  }
  if (extra) {
    return { and: [where, extra] }
  }
  return where
}

export const analyticsHandler: PayloadHandler = async (req) => {
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = req.user as unknown as {
    role: string
    tenant?: { id: string } | string | null
  }

  const tenantId =
    (req.query?.tenantId as string | undefined) ||
    (user.tenant
      ? typeof user.tenant === 'string'
        ? user.tenant
        : user.tenant.id
      : null)

  if (!tenantId && user.role !== 'super_admin') {
    return Response.json({ error: 'Tenant ID required' }, { status: 400 })
  }

  try {
    const [allOrders, paidOrders, pendingOrders, cancelledOrders, products, customers] = await Promise.all([
      req.payload.find({
        collection: 'orders',
        where: buildWhere(tenantId),
        limit: 0,
      }),
      req.payload.find({
        collection: 'orders',
        where: buildWhere(tenantId, { paymentStatus: { equals: 'paid' } }),
        limit: 0,
      }),
      req.payload.find({
        collection: 'orders',
        where: buildWhere(tenantId, { orderStatus: { equals: 'pending' } }),
        limit: 0,
      }),
      req.payload.find({
        collection: 'orders',
        where: buildWhere(tenantId, { orderStatus: { equals: 'cancelled' } }),
        limit: 0,
      }),
      req.payload.find({
        collection: 'products',
        where: buildWhere(tenantId),
        limit: 0,
      }),
      req.payload.find({
        collection: 'users',
        where: buildWhere(tenantId, { role: { equals: 'customer' } }),
        limit: 0,
      }),
    ])

    const recentOrders = await req.payload.find({
      collection: 'orders',
      where: buildWhere(tenantId),
      sort: '-createdAt',
      limit: 10,
      depth: 1,
    })

    const paidOrdersFull = await req.payload.find({
      collection: 'orders',
      where: buildWhere(tenantId, { paymentStatus: { equals: 'paid' } }),
      limit: 1000,
      depth: 0,
    })

    const totalRevenue = paidOrdersFull.docs.reduce(
      (sum, order) => sum + ((order.totalAmount as number) || 0),
      0,
    )

    const monthlyRevenue: Record<string, number> = {}
    for (const order of paidOrdersFull.docs) {
      const date = new Date(order.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + ((order.totalAmount as number) || 0)
    }

    const topProducts = await req.payload.find({
      collection: 'products',
      where: buildWhere(tenantId, { status: { equals: 'published' } }),
      sort: '-createdAt',
      limit: 5,
      depth: 1,
    })

    const ordersByStatus: Record<string, number> = {
      pending: pendingOrders.totalDocs,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: cancelledOrders.totalDocs,
    }

    const statusCounts = await Promise.all(
      ['confirmed', 'processing', 'shipped', 'delivered'].map(async (status) => {
        const result = await req.payload.find({
          collection: 'orders',
          where: buildWhere(tenantId, { orderStatus: { equals: status } }),
          limit: 0,
        })
        return { status, count: result.totalDocs }
      }),
    )

    for (const { status, count } of statusCounts) {
      ordersByStatus[status] = count
    }

    return Response.json({
      overview: {
        totalOrders: allOrders.totalDocs,
        totalRevenue,
        paidOrders: paidOrders.totalDocs,
        pendingOrders: pendingOrders.totalDocs,
        cancelledOrders: cancelledOrders.totalDocs,
        totalProducts: products.totalDocs,
        totalCustomers: customers.totalDocs,
        averageOrderValue:
          paidOrders.totalDocs > 0
            ? Math.round((totalRevenue / paidOrders.totalDocs) * 100) / 100
            : 0,
      },
      monthlyRevenue,
      ordersByStatus,
      recentOrders: recentOrders.docs,
      topProducts: topProducts.docs,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    req.payload.logger.error(`Analytics error: ${message}`)
    return Response.json({ error: message }, { status: 500 })
  }
}
