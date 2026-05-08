import Link from 'next/link'

interface PaginationProps {
  basePath: string
  page: number
  totalPages: number
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ basePath, page, totalPages, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (target: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value)
    }
    if (target > 1) params.set('page', String(target))
    else params.delete('page')
    const qs = params.toString()
    return `${basePath}${qs ? `?${qs}` : ''}`
  }

  const prev = page > 1 ? page - 1 : null
  const next = page < totalPages ? page + 1 : null
  const pages = pageRange(page, totalPages)

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1 text-sm">
      <PageLink href={prev ? buildHref(prev) : null} label="Previous" />
      {pages.map((entry, index) =>
        entry === '…' ? (
          <span key={`dots-${index}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <PageLink
            key={entry}
            href={buildHref(entry)}
            label={String(entry)}
            active={entry === page}
          />
        ),
      )}
      <PageLink href={next ? buildHref(next) : null} label="Next" />
    </nav>
  )
}

function PageLink({
  href,
  label,
  active = false,
}: {
  href: string | null
  label: string
  active?: boolean
}) {
  const cls =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors'
  if (!href) {
    return (
      <span className={`${cls} cursor-not-allowed border-gray-100 text-gray-300`}>{label}</span>
    )
  }
  if (active) {
    return (
      <span aria-current="page" className={`${cls} border-primary bg-primary text-white`}>
        {label}
      </span>
    )
  }
  return (
    <Link
      href={href}
      className={`${cls} border-gray-200 text-gray-700 hover:border-primary hover:text-primary`}
    >
      {label}
    </Link>
  )
}

/** Build a compact paginator: 1 … 4 5 [6] 7 8 … 20 */
function pageRange(page: number, totalPages: number): Array<number | '…'> {
  const result: Array<number | '…'> = []
  const window = 1
  const start = Math.max(2, page - window)
  const end = Math.min(totalPages - 1, page + window)

  result.push(1)
  if (start > 2) result.push('…')
  for (let i = start; i <= end; i++) result.push(i)
  if (end < totalPages - 1) result.push('…')
  if (totalPages > 1) result.push(totalPages)
  return result
}
