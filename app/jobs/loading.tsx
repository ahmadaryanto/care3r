// Skeleton shown while /jobs renders (it reads URL filters on the server).
export default function JobsLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10" aria-busy="true" aria-label="Loading jobs">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-9 w-40" />
          <div className="skeleton h-3.5 w-36" />
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 bg-[#0a0710] px-4 py-3 sm:min-w-[130px]">
              <div className="skeleton h-2.5 w-16" />
              <div className="skeleton h-5 w-12" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_380px]">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton h-6" style={{ width: `${60 + ((i * 17) % 35)}%` }} />
          ))}
        </div>
        <div className="space-y-2.5">
          <div className="skeleton mb-4 h-11 w-full rounded-xl" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-3.5 rounded-[14px] border border-white/[0.06] p-4">
              <div className="skeleton h-11 w-11 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/5" />
                <div className="skeleton h-3 w-2/5" />
                <div className="flex gap-1.5 pt-1">
                  <div className="skeleton h-5 w-16 rounded-full" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                  <div className="skeleton h-5 w-14 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden xl:block">
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
