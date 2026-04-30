export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <div className="mx-auto max-w-7xl px-4 md:px-10 xl:px-4">
        <div className="text-center">
          <div className="mx-auto h-3 w-28 animate-pulse rounded-full bg-primary/20" />
          <div className="mx-auto mt-4 h-10 w-72 animate-pulse rounded-lg bg-[#1a1a1a] md:h-14 md:w-96" />
          <div className="mx-auto mt-4 h-4 w-full max-w-md animate-pulse rounded bg-[#1a1a1a]" />
          <div className="mx-auto mt-2 h-4 w-3/4 max-w-xs animate-pulse rounded bg-[#1a1a1a]" />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={`service-skeleton-${index}`}
              className="min-h-[17rem] overflow-hidden rounded-2xl border border-primary/15 bg-[#111]"
            >
              <div className="h-full min-h-[17rem] w-full animate-pulse bg-[#1a1a1a]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
