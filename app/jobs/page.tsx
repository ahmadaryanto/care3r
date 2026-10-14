import type { Metadata } from "next";
import JobsPageClient from "@/components/JobsPageClient";
import { getJobsFeed } from "@/lib/jobs-feed";

export const metadata: Metadata = {
  title: "Remote Web3 Jobs & Crypto Careers | care3r",
  description:
    "Browse curated remote Web3 jobs: engineering, growth, BD, research, design, and operations roles at protocols, funds, and crypto startups. Filter by ecosystem, category, and seniority.",
  alternates: { canonical: "/jobs" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Filters come from the URL on the server so the full list is in the initial HTML
// (no client-only fallback, no layout shift, crawlable listings).
export default async function JobsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const initialParams = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v ?? ""])
  );
  const feed = getJobsFeed({ slim: true });

  return (
    <JobsPageClient
      jobs={feed.jobs}
      lastUpdated={feed.updated}
      bitgetCount={feed.bitgetImported}
      liveMerged={feed.liveMerged}
      initialParams={initialParams}
    />
  );
}
