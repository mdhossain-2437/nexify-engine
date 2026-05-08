/**
 * Plugin System — Client-side hook-based plugin architecture.
 *
 * Provides event bus for plugins to hook into page lifecycle events.
 * Each tenant loads its own set of active plugins.
 */

export type PluginEvent =
  | 'page:render'
  | 'product:view'
  | 'cart:updated'
  | 'order:created'
  | 'order:completed'
  | 'user:registered'
  | 'user:login'
  | 'search:query'
  | 'checkout:start'
  | 'checkout:complete'
  | 'theme:changed'
  | 'head:inject'
  | 'footer:inject'

type PluginHandler = (data: Record<string, unknown>) => void | Promise<void>

interface RegisteredHandler {
  pluginSlug: string
  priority: number
  handler: PluginHandler
}

class PluginEventBus {
  private handlers: Map<PluginEvent, RegisteredHandler[]> = new Map()

  on(event: PluginEvent, pluginSlug: string, handler: PluginHandler, priority = 10) {
    const existing = this.handlers.get(event) || []
    existing.push({ pluginSlug, priority, handler })
    existing.sort((a, b) => a.priority - b.priority)
    this.handlers.set(event, existing)
  }

  off(event: PluginEvent, pluginSlug: string) {
    const existing = this.handlers.get(event) || []
    this.handlers.set(
      event,
      existing.filter((h) => h.pluginSlug !== pluginSlug),
    )
  }

  async emit(event: PluginEvent, data: Record<string, unknown> = {}) {
    const handlers = this.handlers.get(event) || []
    for (const { handler } of handlers) {
      try {
        await handler(data)
      } catch (err) {
        console.error(`[PluginSystem] Error in handler for ${event}:`, err)
      }
    }
  }

  clear() {
    this.handlers.clear()
  }

  getHandlers(event: PluginEvent): RegisteredHandler[] {
    return this.handlers.get(event) || []
  }
}

export const pluginBus = new PluginEventBus()

export function injectHeadCode(code: string) {
  if (!code || typeof document === 'undefined') return
  const fragment = document.createRange().createContextualFragment(code)
  document.head.appendChild(fragment)
}

export function injectFooterCode(code: string) {
  if (!code || typeof document === 'undefined') return
  const fragment = document.createRange().createContextualFragment(code)
  document.body.appendChild(fragment)
}
