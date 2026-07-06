import { NextResponse } from 'next/server';
import { jobs as curatedJobs, getLocationTag } from '@/lib/mock-data';
import { fetchLiveJobs, ScrapedJob } from '@/lib/scrapers';
import type { Job, Ecosystem, WorkMode, EmploymentType, Seniority, Category, CompanyType } from '@/lib/types';

type LiveCache = { jobs: Job[]; ts: number; count: number } | null;
let liveCache: LiveCache = null;
const CACHE_TTL_MS = 1000 * 60 * 4; // 4 minutes - fresh enough for local dev

function toJobFromScraped(l: ScrapedJob, index: number): Job {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Reasonable defaults for live jobs (we have limited info from scraping)
  const category: Category = l.title.toLowerCase().includes('engineer') || l.title.toLowerCase().includes('developer')
    ? 'Engineering' : 'Engineering';

  // Clean up weak company names coming from some boards (Getro etc often have concatenated text)
  let company = (l.company || 'Web3 Team')
    .replace(/Location|Posted|Compensation|Remote|Hybrid|Senior|Mid|Lead|Full Time|Contract/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const bad = ['Crypto Startup', 'Crypto Company', 'Find a job', 'logo', 'Senior NetSuite'];
  if (bad.some(b => company.toLowerCase().includes(b.toLowerCase())) || company.length < 3 || company.length > 45) {
    company = l.source.split(' ')[0] || 'Web3 Company';
  }

  const liveLocTag = getLocationTag(l.location || 'Remote');
  const liveTags = ['Live', ...(liveLocTag !== 'Remote' ? [liveLocTag] : [])];

  // Smart ecosystem inference from source (so Monad etc. get correct tags)
  let ecosystem: Ecosystem = 'Multi-chain';
  const srcLower = (l.source || '').toLowerCase();
  if (srcLower.includes('monad') || srcLower.includes('eco-jobs')) {
    ecosystem = 'Monad';
  } else if (srcLower.includes('solana')) {
    ecosystem = 'Solana';
  } else if (srcLower.includes('avax') || srcLower.includes('avalanche')) {
    ecosystem = 'Avalanche';
  } else if (srcLower.includes('ethereum')) {
    ecosystem = 'Ethereum';
  }

  return {
    id: `live-${Date.now()}-${index}`,
    title: l.title,
    company,
    source: l.source,
    source_url: l.applyUrl.includes('lever.co') ? 'https://jobs.lever.co' : l.applyUrl.split('/').slice(0,3).join('/'),
    apply_url: l.applyUrl,
    location: l.location || 'Remote',
    remote: true,
    work_mode: 'Remote' as WorkMode,
    employment_type: 'Full-time' as EmploymentType,
    category,
    seniority: 'Mid' as Seniority,
    description: `Live opportunity scraped from ${l.source}. Check the original posting for full details, requirements, and compensation.`,
    requirements: [],
    responsibilities: [],
    nice_to_have: [],
    tags: liveTags,
    ecosystem,
    company_type: 'Startup' as CompanyType,
    date_posted: today,
    date_added: now.toISOString(),
    featured: false,
    expired: false,
  };
}

function dedupeByTitleCompany(existing: Job[], incoming: Job[]): Job[] {
  const keys = new Set(
    existing.map(j => (j.company + '|' + j.title).toLowerCase().slice(0, 55))
  );
  const added: Job[] = [];
  for (const j of incoming) {
    const k = (j.company + '|' + j.title).toLowerCase().slice(0, 55);
    if (!keys.has(k)) {
      keys.add(k);
      added.push(j);
    }
  }
  return added;
}

/**
 * GET /api/jobs
 *
 * Now "live on local" by default:
 * - Starts with high-signal curated jobs
 * - Enriches with freshly scraped jobs from real sources (Lever boards, etc.)
 * - In-memory cache (refreshes every ~4min during dev)
 *
 * Query params:
 *   ?featured=true
 *   ?curatedOnly=1   → skip live scraping (pure curated)
 *   ?refresh=1       → force bypass cache
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featured') === 'true';
  const curatedOnly = searchParams.get('curatedOnly') === '1' || searchParams.get('curatedOnly') === 'true';
  const forceRefresh = searchParams.get('refresh') === '1' || searchParams.get('refresh') === 'true';

  // Base curated list
  let result: Job[] = curatedJobs.filter(j => !j.expired);

  if (featuredOnly) {
    result = result.filter(j => j.featured);
  }

  let liveAdded = 0;
  let refreshedAt = new Date().toISOString();
  let usedCache = false;

  if (!curatedOnly && !featuredOnly) {
    const now = Date.now();
    const cacheValid = liveCache && (now - liveCache.ts < CACHE_TTL_MS) && !forceRefresh;

    let liveJobs: Job[] = [];

    if (cacheValid && liveCache) {
      liveJobs = liveCache.jobs;
      usedCache = true;
      refreshedAt = new Date(liveCache.ts).toISOString();
    } else {
      try {
        const scraped: ScrapedJob[] = await fetchLiveJobs();
        // Extra filter for quality
        const goodScraped = scraped.filter(s => s.title.length > 6 && !/post job|work when|search jobs/i.test(s.title));
        liveJobs = goodScraped.map((s, i) => toJobFromScraped(s, i));
        liveCache = { jobs: liveJobs, ts: now, count: liveJobs.length };
        refreshedAt = new Date().toISOString();
      } catch (e) {
        if (liveCache) liveJobs = liveCache.jobs;
      }
    }

    // Merge live on top without heavy dups
    const fresh = dedupeByTitleCompany(result, liveJobs);
    result = [...fresh, ...result];
    liveAdded = fresh.length;
  }

  if (featuredOnly) {
    result = result.filter(j => j.featured).slice(0, 8);
  }

  return NextResponse.json({
    count: result.length,
    updated: refreshedAt,
    liveMerged: liveAdded,
    cached: usedCache,
    note: curatedOnly 
      ? "Pure curated snapshot (curatedOnly=1)."
      : featuredOnly
        ? "Featured curated roles only."
        : "Live-enriched from your sources: jobs.solana.com, jobs.avax.network, eco-jobs.monad.xyz, ethereumjobboard.com, web3.career, cryptojobslist, cryptocurrencyjobs.co, midnight.network, dragonfly, block.xyz, crypto-careers, beincrypto, jobstash, remote3.co",
    sources: ["curated", "solana", "avax", "monad-eco", "ethereumjobboard", "web3.career", "cryptojobslist", "cryptocurrencyjobs", "midnight", "dragonfly", "block", "crypto-careers", "beincrypto", "jobstash", "remote3", "perle-rippling"],
    jobs: result,
  });
}
