export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 md:px-10 xl:px-4">
        <div className="mt-16 lg:mt-28">
          <div className="px-2 py-6">
            <div className="h-4 w-24 animate-pulse rounded bg-[#1a1a1a]" />
          </div>

          <div className="h-48 w-full animate-pulse rounded-2xl border border-primary/15 bg-[#1a1a1a] md:h-[26rem]" />

          <div className="mx-auto max-w-2xl pt-8">
            <div className="h-3 w-24 animate-pulse rounded-full bg-primary/20" />
            <div className="mt-5 h-8 w-full animate-pulse rounded bg-[#1a1a1a]" />
            <div className="mt-2 h-8 w-3/4 animate-pulse rounded bg-[#1a1a1a]" />
            <div className="mt-4 h-3 w-32 animate-pulse rounded bg-[#1a1a1a]" />

            <div className="mt-10 space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`blog-content-skeleton-${i}`}
                  className="h-4 animate-pulse rounded bg-[#1a1a1a]"
                  style={{ width: `${72 + (i % 4) * 7}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
