import type { MetadataRoute } from "next";
import { getAllJobs, JOBS_FEED_META } from "@/lib/jobs-feed";
import { curatedDrops } from "@/lib/mock-data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(JOBS_FEED_META.scrapedAt || Date.now());

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: updated, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/jobs`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/curated-drops`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/cv`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/submit`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/sources`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/recruiters`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/submit-source`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const drops = curatedDrops.map((d) => ({
    url: `${SITE_URL}/curated-drops/${d.slug}`,
    lastModified: new Date(d.date_published),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const jobs = getAllJobs().map((j) => ({
    url: `${SITE_URL}/jobs/${j.id}`,
    lastModified: new Date(j.date_posted),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...pages, ...drops, ...jobs];
}
