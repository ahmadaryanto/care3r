import jobsFeedData from "@/data/jobs-feed.json";
import type { Job } from "./types";

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

  let jobs = (feed.jobs || []).filter((j) => !j.expired);

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
    bitgetImported: feed.bitgetImported,
    bitgetScrapedAt: feed.scrapedAt,
  };
}

export function getJobById(id: string): Job | undefined {
  return feed.jobs.find((j) => j.id === id && !j.expired);
}

export function getAllJobs(): Job[] {
  return feed.jobs.filter((j) => !j.expired);
}

export const JOBS_FEED_META = {
  scrapedAt: feed.scrapedAt,
  count: feed.count,
  bitgetImported: feed.bitgetImported,
  liveMerged: feed.liveMerged,
};