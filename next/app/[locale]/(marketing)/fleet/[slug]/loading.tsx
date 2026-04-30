export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <div className="mx-auto max-w-7xl px-4 md:px-10 xl:px-4">
        <div className="text-center">
          <div className="mx-auto h-3 w-20 animate-pulse rounded-full bg-primary/20" />
          <div className="mx-auto mt-4 h-10 w-64 animate-pulse rounded-lg bg-[#1a1a1a] md:h-14" />
          <div className="mx-auto mt-4 h-4 w-full max-w-sm animate-pulse rounded bg-[#1a1a1a]" />
        </div>

        <div className="mt-10 h-[22rem] w-full animate-pulse rounded-2xl border border-primary/15 bg-[#1a1a1a] md:h-[32rem]" />

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <div
              key={`fleet-stat-skeleton-${index}`}
              className="rounded-2xl border border-primary/15 bg-[#111] px-6 py-6"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-primary/20" />
              <div className="mt-3 h-8 w-24 animate-pulse rounded bg-[#1a1a1a]" />
              <div className="mt-2 h-3 w-40 animate-pulse rounded bg-[#1a1a1a]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
