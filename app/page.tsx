import HomePageClient from "@/components/HomePageClient";
import CvScorePromo from "@/components/talent/CvScorePromo";
import { getJobsFeed } from "@/lib/jobs-feed";
import { MOCK_CANDIDATES } from "@/lib/talent/mock-candidates";

export default function Home() {
  const feed = getJobsFeed({ slim: true });

  // Relative to the snapshot date so the statically rendered page stays consistent.
  const weekAgo = new Date(new Date(feed.updated).getTime() - 7 * 24 * 60 * 60 * 1000);
  const newThisWeek = feed.jobs.filter((j) => {
    const d = new Date(j.date_posted);
    return d >= weekAgo && !j.expired;
  }).length;

  // Showcase card is a labelled sample profile, not a real candidate.
  const sampleCard = MOCK_CANDIDATES.find((c) => c.id === "ashley-tan") ?? MOCK_CANDIDATES[0];

  return (
    <HomePageClient
      initialJobs={feed.jobs}
      totalListings={feed.count}
      newThisWeek={newThisWeek}
      lastUpdated={feed.updated}
      talentSection={<CvScorePromo sampleCard={sampleCard} />}
    />
  );
}
