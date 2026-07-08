"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import SearchBar from "@/components/SearchBar";
import { Category, Ecosystem, WorkMode, EmploymentType, Seniority } from "@/lib/types";
import type { Job } from "@/lib/types";

interface JobsPageClientProps {
  jobs: Job[];
  lastUpdated: string;
  bitgetCount: number;
  liveMerged: number;
}

export default function JobsPageClient({
  jobs,
  lastUpdated,
  bitgetCount,
  liveMerged,
}: JobsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

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
    let result = [...jobs].filter((job) => !job.expired);

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

    if (sort === "recent") {
      result.sort((a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime());
    } else if (sort === "oldest") {
      result.sort((a, b) => new Date(a.date_posted).getTime() - new Date(b.date_posted).getTime());
    } else if (sort === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [search, sort, filters, jobs]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="section-title">Opportunities</div>
          <h1 className="text-4xl font-semibold tracking-tight">All Jobs</h1>
        </div>
        <div className="text-sm text-zinc-400">
          {filteredAndSorted.length} of {jobs.length} roles
          {bitgetCount > 0 && <span className="text-[#c9a8ff]"> • {bitgetCount} Bitget</span>}
          {lastUpdated && (
            <span className="block text-xs text-zinc-500 mt-1">
              Snapshot from {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 flex-shrink-0">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between btn-secondary text-sm px-4 py-2.5"
            >
              <span>
                Filters {activeFilterCount > 0 && <span className="text-[#c9a8ff]">({activeFilterCount} active)</span>}
              </span>
              <span className="text-xs">{showMobileFilters ? "Close" : "Open"}</span>
            </button>
          </div>

          <div className={`${showMobileFilters ? "block" : "hidden"} lg:block`}>
            <div className="lg:sticky lg:top-20 p-4 lg:p-0 bg-[#0a0a0f] lg:bg-transparent border border-[#1f1f24] lg:border-none rounded-2xl lg:rounded-none mb-4 lg:mb-0">
              <JobFilters
                filters={filters}
                onChange={setFilters}
                sort={sort}
                onSortChange={(s) => setSort(s as "recent" | "oldest" | "title")}
                onReset={resetFilters}
                hideHeader
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex-1 w-full">
                <SearchBar value={search} onChange={setSearch} />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "recent" | "oldest" | "title")}
                  className="input text-xs py-2 w-full sm:w-auto"
                >
                  <option value="recent">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">A–Z</option>
                </select>
                <button onClick={resetFilters} className="btn-secondary text-xs px-4 py-2 whitespace-nowrap">
                  Clear
                </button>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500">
              Static snapshot • {jobs.length} listings
              {liveMerged > 0 ? ` • ${liveMerged} scraped` : ""}
              {bitgetCount > 0 ? ` • ${bitgetCount} Bitget` : ""}
            </div>
          </div>

          {filteredAndSorted.length === 0 ? (
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
        </div>
      </div>
    </div>
  );
}