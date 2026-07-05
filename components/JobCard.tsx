"use client";

import React from "react";
import Link from "next/link";
import { Job } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock, ExternalLink } from "lucide-react";

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export default function JobCard({ job, compact = false }: JobCardProps) {
  const postedAgo = formatDistanceToNow(new Date(job.date_posted), { addSuffix: true });

  return (
    <div className="job-card p-5 sm:p-6 flex flex-col h-full group">
      <Link href={`/jobs/${job.id}`} className="block flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-[17px] leading-tight tracking-[-0.2px] group-hover:text-[#c9a8ff] transition-colors">
              {job.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-sm">
              <span className="font-medium text-zinc-100">{job.company}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{job.ecosystem}</span>
            </div>
          </div>
          {job.featured && (
            <div className="badge badge-accent text-xs whitespace-nowrap">Featured</div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          <div className="badge text-xs">{job.work_mode}</div>
          <div className="badge text-xs">{job.employment_type}</div>
          <div className="badge text-xs">{job.seniority}</div>
          <div className="badge text-xs">{job.category}</div>
          {job.compensation && <div className="badge text-xs border-[#9b6dff]/40 text-[#c9a8ff]">{job.compensation}</div>}
        </div>

        {!compact && (
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
          {job.tags.length > 4 && <span className="tag">+{job.tags.length - 4}</span>}
        </div>
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-[#1f1f24] text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{postedAgo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${job.id}`}
            className="btn-ghost text-xs px-3 py-1"
          >
            View
          </Link>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg border border-[#2a2a31] hover:border-[#9b6dff] hover:text-[#c9a8ff] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Apply <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
