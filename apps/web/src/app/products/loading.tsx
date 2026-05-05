export default function Loading() {
  return (
    <div className="container-custom section-padding">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="h-9 w-44 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-9 w-80 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="aspect-square animate-pulse bg-gray-100" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
