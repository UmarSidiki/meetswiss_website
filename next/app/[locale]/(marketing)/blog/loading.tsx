export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 pt-28 md:pt-0">
      <div className="mx-auto max-w-7xl px-4 md:px-10 xl:px-4">
        <div className="py-10 text-center md:pt-40">
          <div className="mx-auto h-3 w-28 animate-pulse rounded-full bg-primary/20" />
          <div className="mx-auto mt-4 h-10 w-56 animate-pulse rounded-lg bg-[#1a1a1a] md:h-14 md:w-80" />
          <div className="mx-auto mt-4 h-4 w-full max-w-sm animate-pulse rounded bg-[#1a1a1a]" />
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-primary/15 bg-[#111] md:grid md:grid-cols-2">
          <div className="min-h-[14rem] w-full animate-pulse bg-[#1a1a1a] md:min-h-[20rem]" />
          <div className="flex flex-col justify-between p-6 md:p-8">
            <div className="space-y-3">
              <div className="h-6 w-full animate-pulse rounded bg-[#1a1a1a]" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-[#1a1a1a]" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-[#1a1a1a]" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-[#1a1a1a]" />
            </div>
            <div className="mt-6 h-3 w-32 animate-pulse rounded bg-primary/15" />
          </div>
        </div>

        <div className="mt-16 space-y-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={`blog-row-skeleton-${i}`}
              className="border-b border-primary/15 py-5"
            >
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#1a1a1a]" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[#1a1a1a]" />
              <div className="mt-3 h-3 w-24 animate-pulse rounded bg-primary/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
