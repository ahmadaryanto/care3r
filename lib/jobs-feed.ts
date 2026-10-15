import jobsFeedData from "@/data/jobs-feed.json";
import type { Job } from "./types";
import { applyQuality } from "./job-quality";

export interface JobsFeedOptions {
  featuredOnly?: boolean;
  slim?: boolean;
}

export interface JobsFeedResult {
  jobs: Job[];
  count: number;
  updated: string;
  liveMerged: number;
  bitgetImported: number;
  bitgetScrapedAt: string;
}

interface JobsFeedFile {
  scrapedAt: string;
  count: number;
  bitgetImported: number;
  liveMerged: number;
  jobs: Job[];
}

const feed = jobsFeedData as JobsFeedFile;

// Guard against scraper artefacts (e.g. CSS captured as a job title).
const looksLikeJunk = (j: Job) => /[{};]|\.css-|:not\(/.test(j.title) || j.title.length > 140;

/** Listed jobs: not expired, not junk, cleaned and de-duplicated (computed once). */
const LISTED: Job[] = applyQuality((feed.jobs || []).filter((j) => !j.expired && !looksLikeJunk(j)));
const BY_ID = new Map(LISTED.map((j) => [j.id, j]));

function slimJob(job: Job): Job {
  return {
    ...job,
    description:
      job.description.length > 320 ? `${job.description.slice(0, 320)}…` : job.description,
    requirements: job.requirements.slice(0, 4),
    responsibilities: job.responsibilities.slice(0, 4),
  };
}

/** Read pre-scraped static snapshot — no network scraping at runtime. */
export function getJobsFeed(options: JobsFeedOptions = {}): JobsFeedResult {
  const { featuredOnly = false, slim = false } = options;

  let jobs = LISTED;

  if (featuredOnly) {
    jobs = jobs.filter((j) => j.featured).slice(0, 8);
  }

  if (slim) {
    jobs = jobs.map(slimJob);
  }

  return {
    jobs,
    count: jobs.length,
    updated: feed.scrapedAt,
    liveMerged: feed.liveMerged,
    bitgetImported: LISTED.filter((j) => j.id.startsWith("bitget-")).length,
    bitgetScrapedAt: feed.scrapedAt,
  };
}

export function getJobById(id: string): Job | undefined {
  return BY_ID.get(id);
}

export function getAllJobs(): Job[] {
  return LISTED;
}

export const JOBS_FEED_META = {
  scrapedAt: feed.scrapedAt,
  count: LISTED.length,
  bitgetImported: feed.bitgetImported,
  liveMerged: feed.liveMerged,
};
