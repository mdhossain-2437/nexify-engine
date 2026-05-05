/**
 * Format a price for the storefront. Centralized so we render currency
 * consistently across product cards, cart, checkout, etc.
 */
export function formatPrice(amount: number, currency = 'USD', locale = 'en-US'): string {
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(value: string | Date | null | undefined, locale = 'en-US'): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
