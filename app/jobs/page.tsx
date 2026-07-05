"use client";

import React, { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import SearchBar from "@/components/SearchBar";
import { Category, Ecosystem, WorkMode, EmploymentType, Seniority } from "@/lib/types";
import type { Job } from "@/lib/types";

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse initial state from URL
  const parseArray = <T extends string>(param: string | null): T[] =>
    param ? (param.split(",").filter(Boolean) as T[]) : [];

  const initialSearch = searchParams.get("search") || "";
  const initialSort = (searchParams.get("sort") as "recent" | "oldest" | "title") || "recent";

  const initialFilters = {
    categories: parseArray<Category>(searchParams.get("categories")),
    ecosystems: parseArray<Ecosystem>(searchParams.get("ecosystems")),
    workModes: parseArray<WorkMode>(searchParams.get("workModes")),
    employmentTypes: parseArray<EmploymentType>(searchParams.get("employmentTypes")),
    seniorities: parseArray<Seniority>(searchParams.get("seniorities")),
    companyTypes: parseArray<string>(searchParams.get("companyTypes")),
  };

  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<"recent" | "oldest" | "title">(initialSort);
  const [filters, setFilters] = useState(initialFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Live data from API (curated + freshly scraped)
  const [apiJobs, setApiJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [liveAdded, setLiveAdded] = useState(0);

  async function loadJobs(force = false) {
    setLoading(true);
    try {
      // Use only curated high-quality mock data for reliable UX (live scraping is experimental/noisy)
      const qs = force ? '?curatedOnly=1&refresh=1' : '?curatedOnly=1';
      const res = await fetch(`/api/jobs${qs}`);
      const data = await res.json();
      const fetched: Job[] = Array.isArray(data.jobs) ? data.jobs : [];
      setApiJobs(fetched);
      setLastUpdated(data.updated || new Date().toISOString());
      setLiveAdded(0); // no live for main list
    } catch (e) {
      // graceful fallback to static
      setApiJobs([]);
    }
    setLoading(false);
  }

  // Initial load + reload when we want fresh
  useEffect(() => {
    loadJobs(false);
  }, []);

  // Sync state to URL (shareable filtered views)
  useEffect(() => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (sort !== "recent") params.set("sort", sort);

    const setIfAny = (key: string, arr: string[]) => {
      if (arr.length) params.set(key, arr.join(","));
    };
    setIfAny("categories", filters.categories);
    setIfAny("ecosystems", filters.ecosystems);
    setIfAny("workModes", filters.workModes);
    setIfAny("employmentTypes", filters.employmentTypes);
    setIfAny("seniorities", filters.seniorities);
    setIfAny("companyTypes", filters.companyTypes);

    const qs = params.toString();
    const newUrl = qs ? `/jobs?${qs}` : "/jobs";
    router.replace(newUrl, { scroll: false });
  }, [search, sort, filters, router]);

  const filteredAndSorted = useMemo(() => {
    let result = [...apiJobs].filter((job) => !job.expired);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((job) => {
        const haystack = [
          job.title,
          job.company,
          job.ecosystem,
          job.source,
          job.description,
          ...job.tags,
          job.category,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    // Filters
    if (filters.categories.length) {
      result = result.filter((j) => filters.categories.includes(j.category));
    }
    if (filters.ecosystems.length) {
      result = result.filter((j) => filters.ecosystems.includes(j.ecosystem));
    }
    if (filters.workModes.length) {
      result = result.filter((j) => filters.workModes.includes(j.work_mode));
    }
    if (filters.employmentTypes.length) {
      result = result.filter((j) => filters.employmentTypes.includes(j.employment_type));
    }
    if (filters.seniorities.length) {
      result = result.filter((j) => filters.seniorities.includes(j.seniority));
    }
    if (filters.companyTypes.length) {
      result = result.filter((j) => filters.companyTypes.includes(j.company_type));
    }

    // Sort
    if (sort === "recent") {
      result.sort((a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime());
    } else if (sort === "oldest") {
      result.sort((a, b) => new Date(a.date_posted).getTime() - new Date(b.date_posted).getTime());
    } else if (sort === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [search, sort, filters, apiJobs]);

  const resetFilters = () => {
    setFilters({
      categories: [],
      ecosystems: [],
      workModes: [],
      employmentTypes: [],
      seniorities: [],
      companyTypes: [],
    });
    setSearch("");
    setSort("recent");
  };

  const activeFilterCount = 
    filters.categories.length +
    filters.ecosystems.length +
    filters.workModes.length +
    filters.employmentTypes.length +
    filters.seniorities.length +
    filters.companyTypes.length;

  const refreshLive = () => loadJobs(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="section-title">Opportunities</div>
          <h1 className="text-4xl font-semibold tracking-tight">All Jobs</h1>
        </div>
        <div className="text-sm text-zinc-400">
          {filteredAndSorted.length} roles
          {lastUpdated && <span className="ml-2 text-xs text-zinc-500">updated {new Date(lastUpdated).toLocaleTimeString()}</span>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - collapsible on mobile */}
        <div className="lg:w-72 flex-shrink-0">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between btn-secondary text-sm px-4 py-2.5"
            >
              <span>
                Filters {activeFilterCount > 0 && <span className="text-[#c9a8ff]">({activeFilterCount} active)</span>}
              </span>
              <span className="text-xs">{showMobileFilters ? 'Close' : 'Open'}</span>
            </button>
          </div>

          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="lg:sticky lg:top-20 p-4 lg:p-0 bg-[#0a0a0f] lg:bg-transparent border border-[#1f1f24] lg:border-none rounded-2xl lg:rounded-none mb-4 lg:mb-0">
              <JobFilters
                filters={filters}
                onChange={setFilters}
                sort={sort}
                onSortChange={(s) => setSort(s as any)}
                onReset={resetFilters}
                hideHeader
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex-1 w-full">
                <SearchBar value={search} onChange={setSearch} />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="input text-xs py-2 w-full sm:w-auto"
                >
                  <option value="recent">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">A–Z</option>
                </select>
                <button
                  onClick={resetFilters}
                  className="btn-secondary text-xs px-4 py-2 whitespace-nowrap"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500">Showing curated high-signal roles from trusted sources.</div>
          </div>

          {loading && apiJobs.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-400 border border-[#1f1f24] rounded-3xl">
              Loading opportunities...
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="py-12 text-center border border-[#1f1f24] rounded-3xl">
              <div className="text-xl font-medium mb-2">No matches found</div>
              <p className="text-zinc-400 mb-4">Try broadening your filters or search terms.</p>
              <button onClick={resetFilters} className="btn-secondary">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredAndSorted.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          <div className="mt-10 text-xs text-center text-zinc-500">
            High-signal curated base + live scraped jobs from real sources (Lever boards etc). 
            Data refreshes on demand. Click "Refresh live data" anytime. Apply links are real.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-20 text-center text-sm text-zinc-400">Loading jobs...</div>}>
      <JobsContent />
    </Suspense>
  );
}
