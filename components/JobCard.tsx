"use client";

import React from "react";
import Link from "next/link";
import { Job } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, MapPin } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";

interface JobCardProps {
  job: Job;
  /** "card" for grids (homepage, drops), "row" for the dense jobs list. */
  variant?: "card" | "row";
  /** Kept for backwards compatibility with older call sites. */
  compact?: boolean;
  selected?: boolean;
  /** Return true to take over the click (e.g. desktop quick view). */
  onSelect?: (job: Job) => boolean;
  index?: number;
}

function postedAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true }).replace("about ", "");
}

export default function JobCard({ job, variant = "card", selected = false, onSelect, index = 0 }: JobCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!onSelect || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (onSelect(job)) e.preventDefault();
  };

  const applyLink = (
    <a
      href={job.apply_url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 inline-flex items-center gap-1 rounded-lg border border-[#2a2338] px-2.5 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-[#9b6dff] hover:text-[#c9a8ff]"
      aria-label={`Apply to ${job.title} at ${job.company} (opens in a new tab)`}
    >
      Apply <ArrowUpRight size={12} />
    </a>
  );

  if (variant === "row") {
    return (
      <article className="job-row rise-in group" data-selected={selected} style={{ "--i": Math.min(index, 12) } as React.CSSProperties}>
        <CompanyLogo company={job.company} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="job-row-title min-w-0 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-white transition-colors [overflow-wrap:anywhere]">
              <Link href={`/jobs/${job.id}`} onClick={handleClick} className="after:absolute after:inset-0 after:rounded-[14px] after:content-[''] focus-visible:outline-none">
                {job.title}
              </Link>
            </h3>
            <span className="shrink-0 pt-0.5 text-xs text-zinc-400" suppressHydrationWarning>
              {postedAgo(job.date_posted)}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center text-[13px] text-zinc-400">
            <span className="font-medium text-zinc-200">{job.company}</span>
            <span className="meta-dot">{job.ecosystem}</span>
            <span className="meta-dot hidden items-center gap-1 sm:inline-flex">
              <MapPin size={12} className="text-zinc-400" />
              {job.location}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {job.featured && <span className="badge badge-accent text-[11px]">Featured</span>}
            <span className="badge text-[11px] text-zinc-300">{job.work_mode}</span>
            <span className="badge text-[11px] text-zinc-300">{job.employment_type}</span>
            <span className="badge text-[11px] text-zinc-300">{job.seniority}</span>
            {job.compensation && (
              <span className="badge border-[#9b6dff]/35 text-[11px] text-[#c9a8ff]">{job.compensation}</span>
            )}
            <span className="job-row-cta ml-auto hidden sm:inline-flex">{applyLink}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="job-card group relative flex h-full flex-col p-5 rise-in" style={{ "--i": Math.min(index, 12) } as React.CSSProperties}>
      <div className="flex items-start gap-3.5">
        <CompanyLogo company={job.company} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[13px] text-zinc-400">
            <span className="truncate font-medium text-zinc-200">{job.company}</span>
            {job.featured && <span className="badge badge-accent shrink-0 text-[10px]">Featured</span>}
          </div>
          <h3 className="mt-1 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-white transition-colors group-hover:text-[#c9a8ff] [overflow-wrap:anywhere]">
            <Link href={`/jobs/${job.id}`} onClick={handleClick} className="after:absolute after:inset-0 after:rounded-[16px] after:content-[''] focus-visible:outline-none">
              {job.title}
            </Link>
          </h3>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="badge text-[11px] text-zinc-300">{job.work_mode}</span>
        <span className="badge text-[11px] text-zinc-300">{job.seniority}</span>
        <span className="badge text-[11px] text-zinc-300">{job.category}</span>
        {job.compensation && (
          <span className="badge border-[#9b6dff]/35 text-[11px] text-[#c9a8ff]">{job.compensation}</span>
        )}
      </div>

      <div className="min-h-4 flex-1" />
      <div className="flex items-center justify-between gap-3 border-t hairline pt-4 text-xs text-zinc-400">
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin size={12} className="shrink-0 text-zinc-400" />
          <span className="truncate">{job.location}</span>
          <span className="meta-dot shrink-0" suppressHydrationWarning>{postedAgo(job.date_posted)}</span>
        </span>
        {applyLink}
      </div>
    </article>
  );
}
