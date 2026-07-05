import React from "react";
import Link from "next/link";
import { CuratedDrop, Job } from "@/lib/types";
import { getJobsByIds } from "@/lib/mock-data";
import { Calendar } from "lucide-react";

interface CuratedDropCardProps {
  drop: CuratedDrop;
}

export default function CuratedDropCard({ drop }: CuratedDropCardProps) {
  const jobs = getJobsByIds(drop.job_ids).slice(0, 3);

  return (
    <Link href={`/curated-drops/${drop.slug}`} className="block group">
      <div className="card p-7 h-full flex flex-col hover:border-[#9b6dff]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {drop.featured && (
              <span className="badge badge-accent text-[10px]">Featured Drop</span>
            )}
            <span className="badge text-[10px]">{drop.job_ids.length} roles</span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight group-hover:text-[#c9a8ff] transition-colors">
            {drop.title}
          </h3>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-2">
            {drop.description}
          </p>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-1 mb-4">
            {drop.tags.map((tag, idx) => (
              <span key={idx} className="tag text-xs">{tag}</span>
            ))}
          </div>

          <div className="text-xs text-zinc-500 flex items-center gap-1.5 mb-3">
            <Calendar size={13} /> {new Date(drop.date_published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>

          {jobs.length > 0 && (
            <div className="text-xs text-zinc-400 space-y-1">
              {jobs.map((job, i) => (
                <div key={i} className="truncate">• {job.title} at {job.company}</div>
              ))}
              {drop.job_ids.length > 3 && (
                <div className="text-[#c9a8ff]">+{drop.job_ids.length - 3} more</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
