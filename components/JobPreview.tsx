"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Briefcase, Calendar, MapPin, MousePointerClick } from "lucide-react";
import type { Job } from "@/lib/types";
import CompanyLogo from "@/components/CompanyLogo";

/** Desktop quick-view pane for the jobs dashboard. */
export default function JobPreview({ job }: { job: Job | null }) {
  if (!job) {
    return (
      <div className="panel flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-400">
          <MousePointerClick size={18} />
        </span>
        <p className="text-sm text-zinc-400">Select a role to preview it here.</p>
      </div>
    );
  }

  const placeholder = /^Opportunity from /i.test(job.description.trim());

  return (
    <article key={job.id} className="panel rise-in overflow-hidden" aria-label={`Preview: ${job.title}`}>
      <div className="border-b border-white/[0.06] bg-gradient-to-b from-[#9b6dff]/[0.07] to-transparent p-5">
        <div className="flex items-start gap-3.5">
          <CompanyLogo company={job.company} size={48} />
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-zinc-300">{job.company}</div>
            <h2 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-white [overflow-wrap:anywhere]">{job.title}</h2>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.featured && <span className="badge badge-accent text-[11px]">Featured</span>}
          <span className="badge text-[11px] text-zinc-300">{job.ecosystem}</span>
          <span className="badge text-[11px] text-zinc-300">{job.category}</span>
          <span className="badge text-[11px] text-zinc-300">{job.seniority}</span>
          {job.compensation && <span className="badge border-[#9b6dff]/35 text-[11px] text-[#c9a8ff]">{job.compensation}</span>}
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-2 text-[13px] text-zinc-400">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-zinc-400" />
            <dt className="sr-only">Location</dt>
            <dd>{job.location} · {job.work_mode}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-zinc-400" />
            <dt className="sr-only">Type</dt>
            <dd>{job.employment_type}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-zinc-400" />
            <dt className="sr-only">Posted</dt>
            <dd suppressHydrationWarning>Posted {formatDistanceToNow(new Date(job.date_posted), { addSuffix: true })}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-5 p-5">
        {job.curator_note && (
          <p className="rounded-xl border border-[#9b6dff]/20 bg-[#9b6dff]/[0.06] p-3 text-[13px] leading-relaxed text-zinc-300">
            <span className="font-medium text-[#c9a8ff]">Curator note: </span>
            {job.curator_note}
          </p>
        )}
        <p className="text-[13.5px] leading-relaxed text-zinc-300">
          {placeholder ? `Listed on ${job.source}. Open the original posting for the full description and compensation.` : job.description}
        </p>
        {job.requirements.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Requirements</h3>
            <ul className="space-y-1.5 text-[13px] text-zinc-300">
              {job.requirements.map((r) => (
                <li key={r} className="list-item">{r}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 gap-1.5 py-2.5 text-sm">
            Apply <ArrowUpRight size={15} />
          </a>
          <Link href={`/jobs/${job.id}`} className="btn-secondary flex-1 py-2.5 text-sm">
            Full details
          </Link>
        </div>
        <p className="text-center text-[11px] text-zinc-400">via {job.source}</p>
      </div>
    </article>
  );
}
