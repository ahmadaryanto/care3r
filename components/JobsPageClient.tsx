"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import JobPreview from "@/components/JobPreview";
import SearchBar from "@/components/SearchBar";
import type { Job } from "@/lib/types";
import {
  EMPTY_FILTERS,
  FILTER_GROUPS,
  activeFilterCount,
  applyFilters,
  facetCounts,
  type FilterKey,
  type FilterState,
  type SortKey,
} from "@/lib/job-filters";

interface JobsPageClientProps {
  jobs: Job[];
  lastUpdated: string;
  bitgetCount: number;
  liveMerged: number;
  /** URL query params, read on the server. */
  initialParams: Record<string, string>;
}

const PAGE_SIZE = 24;
const SORTS: SortKey[] = ["recent", "oldest", "title"];

function parseFilters(params: Record<string, string>): FilterState {
  const out = { ...EMPTY_FILTERS };
  for (const { key } of FILTER_GROUPS) {
    const raw = params[key];
    (out[key] as string[]) = raw ? raw.split(",").filter(Boolean) : [];
  }
  return out;
}

export default function JobsPageClient({ jobs, lastUpdated, initialParams }: JobsPageClientProps) {
  const [search, setSearch] = useState(initialParams.search || "");
  const [sort, setSort] = useState<SortKey>(SORTS.includes(initialParams.sort as SortKey) ? (initialParams.sort as SortKey) : "recent");
  const [filters, setFilters] = useState<FilterState>(() => parseFilters(initialParams));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Shareable URLs without a server round-trip per keystroke.
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (sort !== "recent") params.set("sort", sort);
    for (const { key } of FILTER_GROUPS) {
      const arr = filters[key] as string[];
      if (arr.length) params.set(key, arr.join(","));
    }
    const qs = params.toString();
    const newUrl = qs ? `/jobs?${qs}` : "/jobs";
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.replaceState(window.history.state, "", newUrl);
    }
  }, [search, sort, filters]);

  // Lock page scroll while the mobile filter sheet is open.
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const results = useMemo(() => applyFilters(jobs, search.trim(), filters, sort), [jobs, search, filters, sort]);
  const counts = useMemo(() => facetCounts(jobs, search.trim(), filters), [jobs, search, filters]);
  const activeCount = activeFilterCount(filters);

  // Paginate; reset when the result set changes.
  const resultKey = JSON.stringify([search, sort, filters]);
  const [page, setPage] = useState({ key: resultKey, limit: PAGE_SIZE });
  const limit = page.key === resultKey ? page.limit : PAGE_SIZE;
  const visible = results.slice(0, limit);
  const selected = results.find((j) => j.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const live = jobs.filter((j) => !j.expired);
    const snapshot = new Date(lastUpdated).getTime();
    return [
      { label: "Open roles", value: live.length.toLocaleString("en-US") },
      { label: "Companies hiring", value: new Set(live.map((j) => j.company)).size.toLocaleString("en-US") },
      { label: "Remote", value: `${Math.round((live.filter((j) => j.work_mode === "Remote").length / Math.max(live.length, 1)) * 100)}%` },
      { label: "Added in last 7 days", value: live.filter((j) => snapshot - new Date(j.date_posted).getTime() <= 7 * 864e5).length.toLocaleString("en-US") },
    ];
  }, [jobs, lastUpdated]);

  const resetAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch("");
    setSort("recent");
  };

  const removeChip = (key: FilterKey, value: string) =>
    setFilters({ ...filters, [key]: (filters[key] as string[]).filter((v) => v !== value) });

  // Desktop (xl): open the quick view instead of navigating.
  const onSelect = (job: Job) => {
    if (!window.matchMedia("(min-width: 1280px)").matches) return false;
    setSelectedId(job.id);
    return true;
  };

  const chips = FILTER_GROUPS.flatMap(({ key }) => (filters[key] as string[]).map((value) => ({ key, value })));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="section-title">Opportunities</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">All jobs</h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Snapshot from{" "}
            {new Date(lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#0a0710] px-4 py-3 sm:min-w-[130px]">
              <dt className="text-[11px] uppercase tracking-wider text-zinc-400">{s.label}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-white">{s.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_380px]">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-1">
            <JobFilters filters={filters} onChange={setFilters} onReset={resetAll} counts={counts} />
          </div>
        </aside>

        {/* Results */}
        <section className="min-w-0" aria-label="Results">
          <div className="sticky top-14 z-20 -mx-1 mb-3 bg-[#050308]/85 px-1 pb-3 pt-2 backdrop-blur-xl">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <SearchBar value={search} onChange={setSearch} shortcut placeholder="Search jobs, companies, skills…" />
              </div>
              <select
                aria-label="Sort jobs"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="hidden h-11 rounded-xl border border-[#201c2b] bg-[#0c0814] px-3 text-[13px] text-zinc-200 focus:border-[#9b6dff] focus:outline-none sm:block"
              >
                <option value="recent">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">A–Z</option>
              </select>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex h-11 items-center gap-2 rounded-xl border border-[#201c2b] bg-[#0c0814] px-3.5 text-[13px] font-medium text-zinc-200 lg:hidden"
                aria-label={`Filters${activeCount ? `, ${activeCount} active` : ""}`}
              >
                <SlidersHorizontal size={15} />
                <span className="hidden min-[380px]:inline">Filters</span>
                {activeCount > 0 && (
                  <span className="rounded-full bg-[#9b6dff] px-1.5 text-[11px] font-semibold text-white">{activeCount}</span>
                )}
              </button>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[13px]">
              <span className="mr-1 text-zinc-400" aria-live="polite">
                <span className="font-medium text-white tabular-nums">{results.length}</span> of {jobs.length} roles
              </span>
              {chips.map(({ key, value }) => (
                <button
                  key={`${key}:${value}`}
                  type="button"
                  onClick={() => removeChip(key, value)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#9b6dff]/30 bg-[#9b6dff]/10 py-0.5 pl-2.5 pr-1.5 text-xs text-[#d9c8ff] transition-colors hover:border-[#9b6dff]/60"
                  aria-label={`Remove filter ${value}`}
                >
                  {value}
                  <X size={12} />
                </button>
              ))}
              {(activeCount > 0 || search) && (
                <button type="button" onClick={resetAll} className="ml-1 text-xs text-zinc-400 underline-offset-2 hover:text-white hover:underline">
                  Clear all
                </button>
              )}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="panel py-14 text-center">
              <div className="text-lg font-medium text-white">No matches</div>
              <p className="mt-1 text-sm text-zinc-400">Try fewer filters or a broader search.</p>
              <button type="button" onClick={resetAll} className="btn-secondary mt-5 text-sm">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <h2 className="sr-only">Job listings</h2>
              <div className="flex flex-col gap-2.5">
                {visible.map((job, i) => (
                  <JobCard key={job.id} job={job} variant="row" index={i % PAGE_SIZE} selected={job.id === selectedId} onSelect={onSelect} />
                ))}
              </div>
              {visible.length < results.length && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage({ key: resultKey, limit: limit + PAGE_SIZE })}
                    className="btn-secondary px-8 py-2.5 text-sm"
                  >
                    Show more roles
                  </button>
                  <span className="text-xs text-zinc-400">
                    Showing {visible.length} of {results.length}
                  </span>
                </div>
              )}
            </>
          )}
        </section>

        {/* Quick view (xl) */}
        <aside className="hidden xl:block" aria-label="Job preview">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">
            <JobPreview job={selected} />
          </div>
        </aside>
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" className="backdrop absolute inset-0 bg-black/60" onClick={() => setSheetOpen(false)} />
          <div className="sheet absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl border-t border-white/[0.08] bg-[#0b0812]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
              <span className="text-sm font-semibold text-white">Filters</span>
              <button type="button" onClick={() => setSheetOpen(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white" aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-3">
              <div className="mb-3 sm:hidden">
                <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="sort-mobile">Sort</label>
                <select
                  id="sort-mobile"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-11 w-full rounded-xl border border-[#201c2b] bg-[#0c0814] px-3 text-[15px] text-zinc-200"
                >
                  <option value="recent">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">A–Z</option>
                </select>
              </div>
              <JobFilters filters={filters} onChange={setFilters} onReset={resetAll} counts={counts} />
            </div>
            <div className="border-t border-white/[0.06] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => setSheetOpen(false)} className="btn-primary w-full py-3 text-sm">
                Show {results.length} roles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
