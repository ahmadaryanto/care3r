"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { curatedDrops, getJobsByIds } from "@/lib/mock-data";
import JobCard from "@/components/JobCard";
import { ArrowLeft } from "lucide-react";

export default function CuratedDropDetail() {
  const params = useParams<{ slug: string }>();
  const drop = curatedDrops.find((d) => d.slug === params.slug);

  if (!drop) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/curated-drops" className="text-sm flex items-center gap-1 text-zinc-400 hover:text-white mb-4">
          <ArrowLeft size={16} /> Back to Curated Drops
        </Link>
        <h1 className="text-2xl">Collection not found</h1>
      </div>
    );
  }

  const jobsInDrop = getJobsByIds(drop.job_ids);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Link href="/curated-drops" className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-4 gap-1">
        <ArrowLeft size={16} /> All Curated Drops
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-3">
          {drop.featured && <span className="badge badge-accent">Featured</span>}
          <span className="text-xs text-zinc-400">{new Date(drop.date_published).toLocaleDateString('en-US')}</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.6px]">{drop.title}</h1>
        <p className="mt-4 text-xl text-zinc-300">{drop.description}</p>
        <div className="flex gap-2 mt-4">
          {drop.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
        </div>
      </div>

      <div className="mt-10">
        <div className="text-sm font-medium text-zinc-400 mb-4">{jobsInDrop.length} selected roles</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
