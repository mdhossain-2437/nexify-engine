/**
 * Lightweight error-tracking abstraction.
 *
 * Drop-in adapter for Sentry (or any other provider). When Sentry is installed,
 * initialise it in `instrumentation.ts`; otherwise errors are logged to console.
 *
 * Install Sentry:
 *   pnpm --filter @nexify/web add @sentry/nextjs
 *
 * Then create `sentry.client.config.ts` / `sentry.server.config.ts` per
 * the Sentry Next.js guide and call `initErrorTracking()` in each.
 */

let sentryModule: typeof import('@sentry/nextjs') | null = null

try {
  // Dynamic import — only resolves if @sentry/nextjs is installed
  sentryModule = await import('@sentry/nextjs').catch(() => null)
} catch {
  sentryModule = null
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (sentryModule) {
    sentryModule.captureException(error, { extra: context })
  } else {
    console.error('[error-tracking]', error, context)
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (sentryModule) {
    sentryModule.captureMessage(message, level)
  } else {
    const fn = level === 'error' ? console.error : level === 'warning' ? console.warn : console.info
    fn(`[error-tracking] ${message}`)
  }
}

export function setUser(user: { id: string; email?: string } | null) {
  if (sentryModule) {
    sentryModule.setUser(user)
  }
}
