import { jobs as curatedJobs, getLocationTag } from '@/lib/mock-data';
import { getBitgetJobs, BITGET_JOBS_COUNT, BITGET_SCRAPED_AT } from '@/lib/bitget-jobs';
import { fetchLiveJobs, ScrapedJob } from '@/lib/scrapers';
import type { Job, Ecosystem, WorkMode, EmploymentType, Seniority, Category, CompanyType } from '@/lib/types';

type LiveCache = { jobs: Job[]; ts: number; count: number } | null;
let liveCache: LiveCache = null;
const CACHE_TTL_MS = 1000 * 60 * 4;

export interface JobsFeedOptions {
  featuredOnly?: boolean;
  curatedOnly?: boolean;
  includeLive?: boolean;
  forceRefresh?: boolean;
  slim?: boolean;
}

export interface JobsFeedResult {
  jobs: Job[];
  count: number;
  updated: string;
  liveMerged: number;
  bitgetImported: number;
  bitgetScrapedAt: string;
  cached: boolean;
}

function toJobFromScraped(l: ScrapedJob, index: number): Job {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const category: Category =
    l.title.toLowerCase().includes('engineer') || l.title.toLowerCase().includes('developer')
      ? 'Engineering'
      : 'Engineering';

  let company = (l.company || 'Web3 Team')
    .replace(/Location|Posted|Compensation|Remote|Hybrid|Senior|Mid|Lead|Full Time|Contract/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const bad = ['Crypto Startup', 'Crypto Company', 'Find a job', 'logo', 'Senior NetSuite'];
  if (
    bad.some((b) => company.toLowerCase().includes(b.toLowerCase())) ||
    company.length < 3 ||
    company.length > 45
  ) {
    company = l.source.split(' ')[0] || 'Web3 Company';
  }

  const liveLocTag = getLocationTag(l.location || 'Remote');
  const liveTags = ['Live', ...(liveLocTag !== 'Remote' ? [liveLocTag] : [])];

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
    source_url: l.applyUrl.includes('lever.co')
      ? 'https://jobs.lever.co'
      : l.applyUrl.split('/').slice(0, 3).join('/'),
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
    existing.map((j) => (j.company + '|' + j.title).toLowerCase().slice(0, 55))
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

function slimJob(job: Job): Job {
  return {
    ...job,
    description: job.description.length > 320 ? `${job.description.slice(0, 320)}…` : job.description,
    requirements: job.requirements.slice(0, 4),
    responsibilities: job.responsibilities.slice(0, 4),
  };
}

export async function getJobsFeed(options: JobsFeedOptions = {}): Promise<JobsFeedResult> {
  const {
    featuredOnly = false,
    curatedOnly = false,
    includeLive = true,
    forceRefresh = false,
    slim = false,
  } = options;

  const bitgetJobs = getBitgetJobs();
  let result: Job[] = curatedJobs.filter((j) => !j.expired);
  const bitgetFresh = dedupeByTitleCompany(result, bitgetJobs);
  result = [...bitgetFresh, ...result];

  if (featuredOnly) {
    result = result.filter((j) => j.featured);
  }

  let liveAdded = 0;
  let refreshedAt = new Date().toISOString();
  let usedCache = false;

  if (!curatedOnly && !featuredOnly && includeLive) {
    const now = Date.now();
    const cacheValid = liveCache && now - liveCache.ts < CACHE_TTL_MS && !forceRefresh;

    let liveJobs: Job[] = [];

    if (cacheValid && liveCache) {
      liveJobs = liveCache.jobs;
      usedCache = true;
      refreshedAt = new Date(liveCache.ts).toISOString();
    } else {
      try {
        const scraped: ScrapedJob[] = await fetchLiveJobs();
        const goodScraped = scraped.filter(
          (s) => s.title.length > 6 && !/post job|work when|search jobs/i.test(s.title)
        );
        liveJobs = goodScraped.map((s, i) => toJobFromScraped(s, i));
        liveCache = { jobs: liveJobs, ts: now, count: liveJobs.length };
        refreshedAt = new Date().toISOString();
      } catch {
        if (liveCache) liveJobs = liveCache.jobs;
      }
    }

    const fresh = dedupeByTitleCompany(result, liveJobs);
    result = [...fresh, ...result];
    liveAdded = fresh.length;
  }

  if (featuredOnly) {
    result = result.filter((j) => j.featured).slice(0, 8);
  }

  if (slim) {
    result = result.map(slimJob);
  }

  return {
    jobs: result,
    count: result.length,
    updated: refreshedAt,
    liveMerged: liveAdded,
    bitgetImported: BITGET_JOBS_COUNT,
    bitgetScrapedAt: BITGET_SCRAPED_AT,
    cached: usedCache,
  };
}