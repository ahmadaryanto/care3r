import type { Category, Ecosystem, EmploymentType, Job, Seniority, WorkMode } from "./types";

export interface FilterState {
  categories: Category[];
  ecosystems: Ecosystem[];
  workModes: WorkMode[];
  employmentTypes: EmploymentType[];
  seniorities: Seniority[];
  companyTypes: string[];
}

export type FilterKey = keyof FilterState;
export type SortKey = "recent" | "oldest" | "title";

export const EMPTY_FILTERS: FilterState = {
  categories: [],
  ecosystems: [],
  workModes: [],
  employmentTypes: [],
  seniorities: [],
  companyTypes: [],
};

/** Filter groups, in display order, with the Job field each one reads. */
export const FILTER_GROUPS: { key: FilterKey; label: string; field: keyof Job; options: string[] }[] = [
  {
    key: "ecosystems",
    label: "Ecosystem",
    field: "ecosystem",
    options: ["Solana", "Ethereum", "Avalanche", "Bitcoin", "DeFi", "Infra", "L2", "AI x Crypto", "Gaming", "Consumer Crypto", "Venture / Fund", "DAO", "Protocol", "Startup", "Multi-chain"],
  },
  {
    key: "categories",
    label: "Category",
    field: "category",
    options: ["Engineering", "Product", "Design", "Business Development", "Marketing", "Community", "Research", "Operations", "Ecosystem Growth", "DevRel", "Security", "Data", "AI x Crypto"],
  },
  { key: "workModes", label: "Work mode", field: "work_mode", options: ["Remote", "Hybrid", "On-site"] },
  { key: "seniorities", label: "Seniority", field: "seniority", options: ["Entry", "Mid", "Senior", "Lead", "Principal", "Head"] },
  { key: "employmentTypes", label: "Employment", field: "employment_type", options: ["Full-time", "Contract", "Internship", "Part-time"] },
  { key: "companyTypes", label: "Company type", field: "company_type", options: ["Protocol", "Startup", "Fund", "Infrastructure", "DAO", "Research"] },
];

export function matchesSearch(job: Job, q: string) {
  if (!q) return true;
  const hay = [job.title, job.company, job.ecosystem, job.source, job.description, job.category, job.location, ...job.tags]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(t));
}

function matchesGroups(job: Job, filters: FilterState, skip?: FilterKey) {
  return FILTER_GROUPS.every(({ key, field }) => {
    if (key === skip) return true;
    const selected = filters[key] as string[];
    return selected.length === 0 || selected.includes(String(job[field]));
  });
}

export function applyFilters(jobs: Job[], search: string, filters: FilterState, sort: SortKey) {
  const result = jobs.filter((j) => !j.expired && matchesSearch(j, search) && matchesGroups(j, filters));
  const time = (j: Job) => new Date(j.date_posted).getTime();
  if (sort === "recent") result.sort((a, b) => time(b) - time(a));
  else if (sort === "oldest") result.sort((a, b) => time(a) - time(b));
  else result.sort((a, b) => a.title.localeCompare(b.title));
  return result;
}

/** Facet counts: for each group, count options given every *other* active filter. */
export function facetCounts(jobs: Job[], search: string, filters: FilterState) {
  const searched = jobs.filter((j) => !j.expired && matchesSearch(j, search));
  const out = {} as Record<FilterKey, Record<string, number>>;
  for (const { key, field } of FILTER_GROUPS) {
    const counts: Record<string, number> = {};
    for (const j of searched) {
      if (!matchesGroups(j, filters, key)) continue;
      const v = String(j[field]);
      counts[v] = (counts[v] || 0) + 1;
    }
    out[key] = counts;
  }
  return out;
}

export function activeFilterCount(filters: FilterState) {
  return Object.values(filters).reduce((n, arr) => n + arr.length, 0);
}
