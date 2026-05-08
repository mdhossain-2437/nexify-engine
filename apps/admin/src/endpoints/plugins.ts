import type { PayloadHandler } from 'payload'
import { BUILT_IN_PLUGINS, canUsePlan } from '../services/plugin-system'

export const listPluginsHandler: PayloadHandler = async (req) => {
  try {
    const dbPlugins = await req.payload.find({
      collection: 'plugins',
      limit: 100,
      where: { status: { equals: 'active' } },
    })

    const plugins = dbPlugins.docs.map((p) => ({
      id: p.id,
      slug: (p as Record<string, unknown>).slug,
      name: (p as Record<string, unknown>).name,
      description: (p as Record<string, unknown>).description,
      category: (p as Record<string, unknown>).category,
      icon: (p as Record<string, unknown>).icon,
      isBuiltIn: (p as Record<string, unknown>).isBuiltIn,
      requiredPlan: (p as Record<string, unknown>).requiredPlan,
      version: (p as Record<string, unknown>).version,
      author: (p as Record<string, unknown>).author,
      hooks: (p as Record<string, unknown>).hooks,
    }))

    return Response.json({ plugins, total: plugins.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export const tenantPluginsHandler: PayloadHandler = async (req) => {
  try {
    const url = new URL(req.url || '', 'http://localhost')
    const tenantId = url.searchParams.get('tenantId')

    if (!tenantId) {
      return Response.json({ error: 'Missing tenantId parameter' }, { status: 400 })
    }

    const tenantPlugins = await req.payload.find({
      collection: 'tenant-plugins',
      where: { tenant: { equals: tenantId } },
      limit: 100,
      depth: 1,
    })

    const installed = tenantPlugins.docs.map((tp) => {
      const record = tp as unknown as Record<string, unknown>
      const plugin = record.plugin as Record<string, unknown> | null
      return {
        id: tp.id,
        pluginId: plugin?.id || record.plugin,
        pluginSlug: plugin?.slug,
        pluginName: plugin?.name,
        enabled: record.enabled,
        settings: record.settings,
      }
    })

    return Response.json({ plugins: installed, total: installed.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export const installPluginHandler: PayloadHandler = async (req) => {
  try {
    const body = (await req.json?.()) as Record<string, unknown> | undefined
    if (!body) {
      return Response.json({ error: 'Request body required' }, { status: 400 })
    }

    const { tenantId, pluginId, settings } = body as {
      tenantId: string
      pluginId: string
      settings?: Record<string, unknown>
    }

    if (!tenantId || !pluginId) {
      return Response.json({ error: 'tenantId and pluginId required' }, { status: 400 })
    }

    const tenant = await req.payload.findByID({ collection: 'tenants', id: tenantId })
    const plugin = await req.payload.findByID({ collection: 'plugins', id: pluginId })

    const tenantRecord = tenant as unknown as Record<string, unknown>
    const pluginRecord = plugin as unknown as Record<string, unknown>

    const tenantPlan = (tenantRecord.plan as string) || 'free'
    const requiredPlan = (pluginRecord.requiredPlan as string) || 'free'

    if (!canUsePlan(tenantPlan, requiredPlan)) {
      return Response.json(
        {
          error: `This plugin requires the ${requiredPlan} plan or higher. Current plan: ${tenantPlan}`,
        },
        { status: 403 },
      )
    }

    const existing = await req.payload.find({
      collection: 'tenant-plugins',
      where: {
        and: [{ tenant: { equals: tenantId } }, { plugin: { equals: pluginId } }],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return Response.json({ error: 'Plugin already installed' }, { status: 409 })
    }

    const installed = await req.payload.create({
      collection: 'tenant-plugins',
      data: {
        tenant: tenantId,
        plugin: pluginId,
        enabled: true,
        settings: settings || (pluginRecord.settings as Record<string, unknown>) || {},
      } as never,
    })

    return Response.json({ success: true, id: installed.id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export const togglePluginHandler: PayloadHandler = async (req) => {
  try {
    const body = (await req.json?.()) as Record<string, unknown> | undefined
    if (!body) {
      return Response.json({ error: 'Request body required' }, { status: 400 })
    }

    const { id, enabled } = body as { id: string; enabled: boolean }

    if (!id || typeof enabled !== 'boolean') {
      return Response.json({ error: 'id and enabled (boolean) required' }, { status: 400 })
    }

    await req.payload.update({
      collection: 'tenant-plugins',
      id,
      data: { enabled } as never,
    })

    return Response.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export const seedPluginsHandler: PayloadHandler = async (req) => {
  try {
    const user = req.user as Record<string, unknown> | undefined
    if (!user || user.role !== 'super_admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    let seeded = 0

    for (const plugin of BUILT_IN_PLUGINS) {
      const existing = await req.payload.find({
        collection: 'plugins',
        where: { slug: { equals: plugin.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await req.payload.create({
          collection: 'plugins',
          data: {
            name: plugin.name,
            slug: plugin.slug,
            description: plugin.description,
            category: plugin.category,
            icon: plugin.icon,
            isBuiltIn: true,
            status: 'active',
            version: '1.0.0',
            author: 'Nexify Engine',
            requiredPlan: plugin.requiredPlan,
            hooks: plugin.hooks,
            settings: plugin.settings,
            headCode: plugin.headCode,
            footerCode: plugin.footerCode,
          } as never,
        })
        seeded++
      }
    }

    return Response.json({
      success: true,
      seeded,
      message: `Seeded ${seeded} built-in plugins`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
