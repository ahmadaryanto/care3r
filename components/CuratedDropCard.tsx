import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CuratedDrop } from "@/lib/types";
import { getJobsByIds } from "@/lib/mock-data";
import CompanyLogo from "@/components/CompanyLogo";

interface CuratedDropCardProps {
  drop: CuratedDrop;
  index?: number;
}

export default function CuratedDropCard({ drop, index = 0 }: CuratedDropCardProps) {
  const jobs = getJobsByIds(drop.job_ids);
  const companies = [...new Set(jobs.map((j) => j.company))];
  const published = new Date(drop.date_published).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return (
    <Link
      href={`/curated-drops/${drop.slug}`}
      className="card group rise-in relative flex h-full min-w-0 flex-col overflow-hidden p-0"
      style={{ "--i": index, padding: 0 } as React.CSSProperties}
    >
      <div className="relative border-b border-white/[0.06] bg-gradient-to-br from-[#9b6dff]/[0.12] via-transparent to-[#e8a04a]/[0.05] p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {drop.featured && <span className="badge badge-accent text-[10px]">Featured</span>}
            <span className="badge text-[10px] text-zinc-300">{drop.job_ids.length} roles</span>
          </div>
          <span className="text-xs text-zinc-400">{published}</span>
        </div>
        <h3 className="mt-4 flex items-start justify-between gap-3 text-lg font-semibold leading-snug tracking-tight text-white [overflow-wrap:anywhere]">
          <span className="transition-colors group-hover:text-[#c9a8ff]">{drop.title}</span>
          <ArrowUpRight size={18} className="mt-0.5 shrink-0 text-zinc-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#c9a8ff]" />
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">{drop.description}</p>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <ul className="space-y-2">
          {jobs.slice(0, 3).map((job) => (
            <li key={job.id} className="flex min-w-0 items-center gap-2.5 text-[13px]">
              <CompanyLogo company={job.company} size={22} />
              <span className="truncate text-zinc-200">{job.title}</span>
              <span className="shrink-0 truncate text-zinc-400">{job.company}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {drop.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag text-[11px]">{tag}</span>
            ))}
          </div>
          {companies.length > 0 && (
            <div className="flex shrink-0 -space-x-2" aria-label={`${companies.length} companies`}>
              {companies.slice(0, 4).map((c) => (
                <CompanyLogo key={c} company={c} size={24} className="ring-2 ring-[#0f0c18]" />
              ))}
              {companies.length > 4 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] text-[10px] text-zinc-300 ring-2 ring-[#0f0c18]">
                  +{companies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
