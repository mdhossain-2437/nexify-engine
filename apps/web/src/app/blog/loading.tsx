export default function Loading() {
  return (
    <div className="container-custom section-padding">
      <div className="mb-10">
        <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="aspect-[16/9] animate-pulse bg-gray-100" />
            <div className="space-y-2 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
