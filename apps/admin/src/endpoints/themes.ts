import type { PayloadHandler } from 'payload'
import { BUILT_IN_THEMES, generateThemeCSS } from '../services/theme-engine'

export const listThemesHandler: PayloadHandler = async (req) => {
  try {
    const dbThemes = await req.payload.find({
      collection: 'themes',
      limit: 100,
      where: { status: { equals: 'active' } },
    })

    const themes = dbThemes.docs.map((t) => ({
      id: t.id,
      slug: (t as Record<string, unknown>).slug,
      name: (t as Record<string, unknown>).name,
      description: (t as Record<string, unknown>).description,
      category: (t as Record<string, unknown>).category,
      isBuiltIn: (t as Record<string, unknown>).isBuiltIn,
      colors: (t as Record<string, unknown>).colors,
      typography: (t as Record<string, unknown>).typography,
      layout: (t as Record<string, unknown>).layout,
      version: (t as Record<string, unknown>).version,
      author: (t as Record<string, unknown>).author,
    }))

    return Response.json({ themes, total: themes.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export const themePreviewHandler: PayloadHandler = async (req) => {
  try {
    const url = new URL(req.url || '', 'http://localhost')
    const themeSlug = url.searchParams.get('slug')

    if (!themeSlug) {
      return Response.json({ error: 'Missing slug parameter' }, { status: 400 })
    }

    const builtIn = BUILT_IN_THEMES.find((t) => t.slug === themeSlug)
    if (builtIn) {
      return Response.json({ css: generateThemeCSS(builtIn), theme: builtIn })
    }

    const dbTheme = await req.payload.find({
      collection: 'themes',
      where: { slug: { equals: themeSlug } },
      limit: 1,
    })

    if (dbTheme.docs.length === 0) {
      return Response.json({ error: 'Theme not found' }, { status: 404 })
    }

    const doc = dbTheme.docs[0] as unknown as Record<string, unknown>
    const config = {
      slug: doc.slug as string,
      name: doc.name as string,
      description: (doc.description as string) || '',
      category: (doc.category as string) || 'general',
      colors: doc.colors as Record<string, string>,
      typography: doc.typography as Record<string, string | number>,
      layout: doc.layout as Record<string, string>,
      customCSS: (doc.customCSS as string) || '',
    }

    return Response.json({
      css: generateThemeCSS(config as Parameters<typeof generateThemeCSS>[0]),
      theme: config,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export const seedThemesHandler: PayloadHandler = async (req) => {
  try {
    const user = req.user as Record<string, unknown> | undefined
    if (!user || user.role !== 'super_admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    let seeded = 0

    for (const theme of BUILT_IN_THEMES) {
      const existing = await req.payload.find({
        collection: 'themes',
        where: { slug: { equals: theme.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await req.payload.create({
          collection: 'themes',
          data: {
            name: theme.name,
            slug: theme.slug,
            description: theme.description,
            category: theme.category,
            isBuiltIn: true,
            status: 'active',
            version: '1.0.0',
            author: 'Nexify Engine',
            colors: theme.colors,
            typography: theme.typography,
            layout: theme.layout,
            customCSS: theme.customCSS || '',
          } as never,
        })
        seeded++
      }
    }

    return Response.json({
      success: true,
      seeded,
      message: `Seeded ${seeded} built-in themes`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
