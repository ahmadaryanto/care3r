import type { Job } from "./types";

/**
 * Data-quality layer for scraped listings.
 *
 * Scrapers occasionally capture navigation links, category pages, investor pages,
 * ads, and duplicates as "jobs", and glue extra text onto company names
 * ("Atom PartnersPart-TimeWorldwide USD 48k"). Curated jobs are trusted as-is;
 * only `scraped-*` entries are filtered and cleaned here.
 */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const titleCase = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((w) => (/^\d/.test(w) ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");

/** Words that show up as "company" when a scraper grabbed a category or nav label. */
const NON_COMPANY = new Set(
  [
    "marketing", "operations", "finance", "product", "non-tech", "customer support", "ethereum",
    "bitcoin", "layer 2", "pays in crypto", "crypto co", "web3 company", "product manager",
    "product design", "content creator", "systems engineer", "fullstack engineer", "avalanche",
    "series c", "series d", "crypto native jobs", "remote3", "dragonfly",
  ].map((s) => s.toLowerCase())
);

/** Titles that are page/nav text rather than a role. */
const JUNK_TITLE =
  /^(careers?|jobstash|join talent pool|high paying jobs|view all .*jobs|crypto beginner jobs|asia-pacific|jobs by .*|series [a-z].*|polymarket|social leverage|altered ventures|endeavor catalyst|diagram ventures|kakao ventures|harmonic|defillama careers|engineering|marketing|customer support|operations|finance|product|non-tech|ethereum|bitcoin|layer 2|pays in crypto|non tech)$/i;

function urlInfo(job: Job): URL | null {
  try {
    return new URL(job.apply_url);
  } catch {
    return null;
  }
}

/** True when the apply URL points at a listing/category/ad page instead of a posting. */
function isNonPostingUrl(u: URL): boolean {
  const host = u.hostname.replace(/^www\./, "");
  const path = u.pathname.replace(/\/+$/, "");
  const segs = path.split("/").filter(Boolean);

  if (["network.bondex.app", "hackathon.superprotocol.com", "link.metana.io"].includes(host)) return true;
  if (host === "cryptocurrencyjobs.co") return segs.length <= 1;
  if (host === "jobstash.xyz") return segs.length === 0 || /^(i|fr|o|l)-/.test(segs[0]) || segs[0] === "crypto-beginner-jobs";
  if (host === "remote3.co") return segs[0] !== "remote-jobs";
  if (host === "web3.career") return segs.length <= 1 && /-jobs$/.test(segs[0] || "");
  if (host === "block.xyz") return true;
  // Getro boards (jobs.solana.com, jobs.avax.network, eco-jobs.monad.xyz, jobs.dragonfly.xyz): company pages lack /jobs/<id>.
  if (/^(jobs\.solana\.com|jobs\.avax\.network|eco-jobs\.monad\.xyz|jobs\.dragonfly\.xyz)$/.test(host)) {
    return !segs.includes("jobs") || segs[segs.length - 1] === "jobs";
  }
  return false;
}

/** Company slug from Getro-style URLs: /companies/<slug>-2-<uuid>/jobs/... */
function companyFromGetro(u: URL): string | null {
  const m = u.pathname.match(/\/companies\/([^/]+)/);
  if (!m) return null;
  const slug = m[1].replace(/-[0-9a-f]{8}-[0-9a-f-]{20,}$/i, "").replace(/-\d+$/, "");
  return slug ? titleCase(slug) : null;
}

/** Company from "<title-slug>-<company-slug>" URLs (ethereumjobboard, web3.career, remote3). */
function companyFromTitledSlug(u: URL, title: string): string | null {
  const segs = u.pathname.split("/").filter(Boolean);
  const candidates = segs.filter((s) => !/^\d+$/.test(s) && s !== "jobs" && s !== "remote-jobs");
  const slug = candidates[candidates.length - 1];
  const t = slugify(title);
  if (!slug || !t || !slug.startsWith(`${t}-`)) return null;
  const rest = slug.slice(t.length + 1).replace(/-\d+$/, "");
  return rest ? titleCase(rest) : null;
}

/** Strip text glued on by scrapers: "Atom PartnersPart-TimeWorldwide USD 48k -" -> "Atom Partners". */
function stripGlued(name: string): string {
  return name
    .split(/(?:Full-Time|Part-Time|Contract|Internship|Worldwide|USD\s|\d+\s+Applicants)/)[0]
    .replace(/\.[A-Z][A-Za-z]*$/, "")
    .replace(/\s+Careers$/i, "")
    .trim();
}

function looksBroken(name: string, title: string): boolean {
  const n = name.trim();
  if (!n || n.length < 2) return true;
  if (NON_COMPANY.has(n.toLowerCase())) return true;
  if (/[,]|\.[A-Z]|Full-Time|Part-Time|Worldwide|Applicants|Hire Web3|Jobs For You|Internships/.test(n)) return true;
  // Company that is a fragment of the role title, e.g. "Site Reliability En" in "Senior Site Reliability Engineer".
  if (n.split(" ").length > 1 && title.toLowerCase().includes(n.toLowerCase())) return true;
  return false;
}

/** Preferred spellings for names recovered from URL slugs. */
const CANONICAL: Record<string, string> = {
  opensea: "OpenSea",
  rugsdotfun: "RugsDotFun",
  etherfi: "ether.fi",
  coingecko: "CoinGecko",
  useblocky: "UseBlocky",
  "1inch": "1inch",
  cowdao: "CoW DAO",
};

const nameKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Merge spelling variants ("Open Sea" / "OpenSea") onto one canonical name. */
function canonicalizeCompanies(jobs: Job[]): Job[] {
  const preferred = new Map<string, string>(Object.entries(CANONICAL));
  // Curated jobs carry hand-typed names; prefer their casing.
  for (const j of jobs) {
    if (!j.id.startsWith("scraped-") && !preferred.has(nameKey(j.company))) preferred.set(nameKey(j.company), j.company);
  }
  return jobs.map((j) => {
    const name = preferred.get(nameKey(j.company));
    return name && name !== j.company ? { ...j, company: name } : j;
  });
}

function cleanCompany(job: Job, u: URL | null): string {
  const original = job.company || "";
  if (!looksBroken(original, job.title)) return original;

  const stripped = stripGlued(original);
  if (stripped && !looksBroken(stripped, job.title)) return stripped;

  if (u) {
    const fromGetro = companyFromGetro(u);
    if (fromGetro) return fromGetro;
    const fromSlug = companyFromTitledSlug(u, job.title);
    if (fromSlug) return fromSlug;
  }
  return "";
}

/** Returns a cleaned job, or null when the entry isn't a real posting. */
export function cleanScrapedJob(job: Job): Job | null {
  if (!job.id.startsWith("scraped-")) return job;

  const title = job.title.trim();
  if (!title || JUNK_TITLE.test(title) || /\(Sponsored\)/i.test(title)) return null;

  const u = urlInfo(job);
  if (!u || isNonPostingUrl(u)) return null;

  const company = cleanCompany(job, u);
  if (!company) return null;

  return company === job.company ? job : { ...job, company };
}

/** Clean scraped entries and drop duplicates (same apply URL), keeping the first good one. */
export function applyQuality(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  const out: Job[] = [];
  for (const j of jobs) {
    const cleaned = cleanScrapedJob(j);
    if (!cleaned) continue;
    const key = cleaned.id.startsWith("scraped-") ? cleaned.apply_url : cleaned.id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return canonicalizeCompanies(out);
}
