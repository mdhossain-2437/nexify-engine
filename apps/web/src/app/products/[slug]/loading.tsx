export default function Loading() {
  return (
    <div className="container-custom section-padding">
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-gray-100" />
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-1/4 animate-pulse rounded bg-gray-100" />
          <div className="h-12 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-14 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
