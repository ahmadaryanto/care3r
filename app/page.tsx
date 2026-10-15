import HomePageClient, { type HomeInsights } from "@/components/HomePageClient";
import CuratedDropCard from "@/components/CuratedDropCard";
import CvScorePromo from "@/components/talent/CvScorePromo";
import { getJobsFeed } from "@/lib/jobs-feed";
import { curatedDrops, sources } from "@/lib/mock-data";
import { hasCompanyLogo } from "@/lib/company-logos";
import { MOCK_CANDIDATES } from "@/lib/talent/mock-candidates";
import type { Job } from "@/lib/types";

const countBy = (jobs: Job[], pick: (j: Job) => string) => {
  const m = new Map<string, number>();
  for (const j of jobs) m.set(pick(j), (m.get(pick(j)) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
};

export default function Home() {
  const feed = getJobsFeed({ slim: true });
  const jobs = feed.jobs;

  // Relative to the snapshot date so the statically rendered page stays consistent.
  const snapshot = new Date(feed.updated).getTime();
  const newThisWeek = jobs.filter((j) => snapshot - new Date(j.date_posted).getTime() <= 7 * 864e5).length;

  // Featured first, then most recent, 6 total.
  const byRecent = [...jobs].sort((a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime());
  const showcase: Job[] = [];
  for (const job of [...jobs.filter((j) => j.featured), ...byRecent]) {
    if (showcase.length >= 6) break;
    if (!showcase.some((p) => p.id === job.id)) showcase.push(job);
  }

  const companies = countBy(jobs, (j) => j.company);
  const insights: HomeInsights = {
    totalRoles: jobs.length,
    companies: companies.length,
    newThisWeek,
    activeSources: sources.filter((s) => s.active).length,
    remoteShare: Math.round((jobs.filter((j) => j.work_mode === "Remote").length / Math.max(jobs.length, 1)) * 100),
    topEcosystems: countBy(jobs, (j) => j.ecosystem).slice(0, 6),
    topCategories: countBy(jobs, (j) => j.category).slice(0, 6),
    hiring: companies.filter((c) => hasCompanyLogo(c.name)).slice(0, 18),
  };

  // Showcase card is a labelled sample profile, not a real candidate.
  const sampleCard = MOCK_CANDIDATES.find((c) => c.id === "ashley-tan") ?? MOCK_CANDIDATES[0];
  const featuredDrops = curatedDrops.filter((d) => d.featured).slice(0, 3);

  return (
    <HomePageClient
      showcaseJobs={showcase}
      insights={insights}
      lastUpdated={feed.updated}
      dropsSection={
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDrops.map((drop, i) => (
            <CuratedDropCard key={drop.id} drop={drop} index={i} />
          ))}
        </div>
      }
      talentSection={<CvScorePromo sampleCard={sampleCard} />}
    />
  );
}
