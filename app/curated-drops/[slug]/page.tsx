import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { curatedDrops, getJobsByIds } from "@/lib/mock-data";
import JobCard from "@/components/JobCard";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return curatedDrops.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const drop = curatedDrops.find((d) => d.slug === slug);
  if (!drop) return { title: "Collection not found | care3r" };
  return {
    title: `${drop.title} | care3r Curated Drops`,
    description: drop.description,
    alternates: { canonical: `/curated-drops/${drop.slug}` },
    openGraph: { title: drop.title, description: drop.description },
  };
}

export default async function CuratedDropDetail({ params }: Props) {
  const { slug } = await params;
  const drop = curatedDrops.find((d) => d.slug === slug);
  if (!drop) notFound();

  const jobsInDrop = getJobsByIds(drop.job_ids);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/curated-drops" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft size={16} /> All Curated Drops
      </Link>

      <div className="max-w-3xl">
        <div className="mb-3 flex items-center gap-3">
          {drop.featured && <span className="badge badge-accent">Featured</span>}
          <span className="text-xs text-zinc-400">
            {new Date(drop.date_published).toLocaleDateString("en-US", { timeZone: "UTC" })}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.6px] sm:text-4xl">{drop.title}</h1>
        <p className="mt-4 text-lg text-zinc-300 sm:text-xl">{drop.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {drop.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 text-sm font-medium text-zinc-400">{jobsInDrop.length} selected roles</div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobsInDrop.length ? (
            jobsInDrop.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <p className="text-zinc-400">No jobs in this collection yet.</p>
          )}
        </div>
      </div>

      <div className="mt-12 text-sm text-zinc-400">
        These roles were hand-selected by the care3r curators.
        <Link href="/jobs" className="ml-2 text-[#c9a8ff] hover:underline">Browse full directory →</Link>
      </div>
    </div>
  );
}
