import { Suspense } from "react";
import JobsPageClient from "@/components/JobsPageClient";
import { getJobsFeed } from "@/lib/jobs-feed";

export default function JobsPage() {
  const feed = getJobsFeed({ slim: true });

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-20 text-center text-sm text-zinc-400">Loading jobs...</div>}>
      <JobsPageClient
        jobs={feed.jobs}
        lastUpdated={feed.updated}
        bitgetCount={feed.bitgetImported}
        liveMerged={feed.liveMerged}
      />
    </Suspense>
  );
}