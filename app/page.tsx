import HomePageClient from "@/components/HomePageClient";
import { getJobsFeed } from "@/lib/jobs-feed";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const feed = await getJobsFeed({
    curatedOnly: true,
    includeLive: false,
    slim: true,
  });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newThisWeek = feed.jobs.filter((j) => {
    const d = new Date(j.date_posted);
    return d >= weekAgo && !j.expired;
  }).length;

  return (
    <HomePageClient
      initialJobs={feed.jobs}
      totalListings={feed.count}
      newThisWeek={newThisWeek}
    />
  );
}