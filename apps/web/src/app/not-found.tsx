import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-custom flex min-h-[60vh] items-center justify-center section-padding">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Error 404</p>
        <h1 className="mt-3 text-5xl font-bold text-gray-900">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Try one of the
          links below.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/products" className="btn-outline">
            Browse products
          </Link>
        </div>
      </div>
    </div>
  )
}
