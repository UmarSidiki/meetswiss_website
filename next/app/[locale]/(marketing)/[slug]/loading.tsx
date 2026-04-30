export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <div className="mx-auto max-w-7xl px-4 md:px-10 xl:px-4">
        <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-[#1a1a1a] md:h-14" />
        <div className="mt-8 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={`page-content-skeleton-${i}`}
              className="h-4 animate-pulse rounded bg-[#1a1a1a]"
              style={{ width: `${72 + (i % 3) * 9}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
