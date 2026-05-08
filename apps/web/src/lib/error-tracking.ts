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

interface SentryLike {
  captureException(error: unknown, context?: { extra?: Record<string, unknown> }): void
  captureMessage(message: string, level?: string): void
  setUser(user: { id: string; email?: string } | null): void
}

let sentryModule: SentryLike | null = null

async function loadSentry(): Promise<void> {
  try {
    // @ts-expect-error — @sentry/nextjs is an optional peer dependency
    const mod = await import('@sentry/nextjs')
    sentryModule = mod as unknown as SentryLike
  } catch {
    sentryModule = null
  }
}

void loadSentry()

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
