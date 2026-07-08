import { Suspense } from "react";
import JobsPageClient from "@/components/JobsPageClient";
import { getJobsFeed } from "@/lib/jobs-feed";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JobsPage() {
  const feed = await getJobsFeed({
    curatedOnly: true,
    includeLive: false,
    slim: true,
  });

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-20 text-center text-sm text-zinc-400">Loading jobs...</div>}>
      <JobsPageClient
        initialJobs={feed.jobs}
        initialUpdated={feed.updated}
        initialBitgetCount={feed.bitgetImported}
        initialLiveMerged={feed.liveMerged}
      />
    </Suspense>
  );
}