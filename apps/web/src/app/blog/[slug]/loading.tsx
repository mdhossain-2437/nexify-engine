export default function Loading() {
  return (
    <article className="container-custom max-w-3xl section-padding">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-100" />
      <div className="space-y-3">
        <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mt-8 aspect-[16/9] animate-pulse rounded-2xl bg-gray-100" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-4 w-full animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </article>
  )
}
