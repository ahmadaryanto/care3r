import bitgetData from "@/data/bitget-jobs.json";
import type { Job, Category, Seniority, EmploymentType, WorkMode } from "./types";

const BITGET_SOURCE_URL =
  "https://hire-r1.mokahr.com/social-recruitment/bitget/100000079";

interface BitgetScrapedJob {
  id: string;
  title: string;
  company: string;
  status: string;
  department: string | null;
  category: string | null;
  commitment: string | null;
  education: string | null;
  experience: { min: number | null; max: number | null };
  location: string;
  locations: unknown[];
  openedAt: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  descriptionHtml: string;
  descriptionText: string;
  applyUrl: string;
  source: string;
  mjCode: string | null;
}

function mapCategory(raw: string | null, title: string): Category {
  const c = (raw || "").toLowerCase();
  const t = title.toLowerCase();

  if (c.includes("technical") || /\b(engineer|developer|devops|sre|backend|frontend)\b/.test(t)) {
    return "Engineering";
  }
  if (c.includes("product") || c.includes("design")) return "Product";
  if (c.includes("business development") || /\bbd\b/.test(t)) return "Business Development";
  if (c.includes("marketing") || c.includes("branding")) return "Marketing";
  if (c.includes("legal") || c.includes("compliance") || c.includes("security")) {
    return "Security";
  }
  if (c.includes("data") || t.includes("analyst")) return "Data";
  return "Operations";
}

function mapSeniority(title: string, minExp: number | null): Seniority {
  const t = title.toLowerCase();

  if (/\b(head of|director|vp |vice president|gm |general manager|chief )\b/.test(t)) {
    return "Head";
  }
  if (/\b(lead|principal|staff)\b/.test(t)) return "Lead";
  if (minExp != null) {
    if (minExp >= 8) return "Principal";
    if (minExp >= 5) return "Senior";
    if (minExp >= 2) return "Mid";
    return "Entry";
  }
  if (/\b(senior|sr\.)\b/.test(t)) return "Senior";
  if (/\b(junior|intern|entry|graduate)\b/.test(t)) return "Entry";
  return "Mid";
}

function extractSection(text: string, marker: string): string[] {
  const idx = text.indexOf(marker);
  if (idx === -1) return [];

  const rest = text.slice(idx + marker.length);
  const endMarkers = [
    "What you'll need",
    "What you'll do",
    "岗位职责",
    "任职要求",
    "Why Bitget",
  ];

  let end = rest.length;
  for (const m of endMarkers) {
    if (m === marker) continue;
    const pos = rest.indexOf(m);
    if (pos > 0 && pos < end) end = pos;
  }

  return rest
    .slice(0, end)
    .split("\n")
    .map((line) => line.replace(/^[\s•\-·]+/, "").trim())
    .filter((line) => line.length > 8 && line.length < 320);
}

function toJob(raw: BitgetScrapedJob): Job {
  const desc = raw.descriptionText || "";
  const requirements = extractSection(desc, "What you'll need");
  const responsibilities = extractSection(desc, "What you'll do");
  const location =
    raw.location === "Remote / Unspecified" ? "Remote" : raw.location;
  const remote =
    location.toLowerCase().includes("remote") || raw.locations.length === 0;

  const tags = ["Bitget", "Exchange"];
  if (raw.category) tags.push(raw.category);
  if (raw.department) tags.push(raw.department);

  return {
    id: `bitget-${raw.id}`,
    title: raw.title,
    company: "Bitget",
    source: "mokahr.com/bitget",
    source_url: BITGET_SOURCE_URL,
    apply_url: raw.applyUrl,
    location,
    remote,
    work_mode: (remote ? "Remote" : "Hybrid") as WorkMode,
    employment_type: "Full-time" as EmploymentType,
    category: mapCategory(raw.category, raw.title),
    seniority: mapSeniority(raw.title, raw.experience?.min ?? null),
    description: desc.slice(0, 1500) || raw.title,
    requirements: requirements.slice(0, 8),
    responsibilities: responsibilities.slice(0, 8),
    nice_to_have: [],
    tags,
    ecosystem: "Multi-chain",
    company_type: "Exchange",
    date_posted:
      (raw.publishedAt || raw.openedAt || "").slice(0, 10) || "2026-07-08",
    date_added: bitgetData.scrapedAt,
    featured: false,
    expired: raw.status !== "open",
    compensation: "Competitive",
  };
}

export function getBitgetJobs(): Job[] {
  return (bitgetData.jobs as BitgetScrapedJob[])
    .filter((job) => job.status === "open")
    .map(toJob);
}

export const BITGET_JOBS_COUNT = getBitgetJobs().length;
export const BITGET_SCRAPED_AT = bitgetData.scrapedAt;