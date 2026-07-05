"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { jobs as staticJobs } from "@/lib/mock-data";
import { Job } from "@/lib/types";
import { format } from "date-fns";
import { ArrowLeft, ExternalLink, MapPin, Briefcase, Calendar } from "lucide-react";

export default function JobDetail() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [similar, setSimilar] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setLoading(false);
      return;
    }

    // Try static curated first (fast, no network)
    let found = staticJobs.find((j) => j.id === id);
    if (found) {
      setJob(found);
      const sim = staticJobs
        .filter((j) => j.id !== id && (j.category === found!.category || j.ecosystem === found!.ecosystem))
        .slice(0, 3);
      setSimilar(sim);
      setLoading(false);
      return;
    }

    // Fallback: fetch full list (includes live scraped jobs)
    (async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        const allJobs: Job[] = Array.isArray(data?.jobs) ? data.jobs : [];
        found = allJobs.find((j) => j.id === id);
        if (found) {
          setJob(found);
          const sim = allJobs
            .filter((j) => j.id !== id && (j.category === found!.category || j.ecosystem === found!.ecosystem))
            .slice(0, 3);
          setSimilar(sim);
        }
      } catch {
        // keep undefined -> not found UI
      }
      setLoading(false);
    })();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-sm text-zinc-400">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold">Job not found</h2>
        <p className="mt-3 text-zinc-400">It may have been removed or the link is outdated.</p>
        <Link href="/jobs" className="inline-block mt-8 btn-secondary">Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
        <ArrowLeft size={16} /> Back to all jobs
      </Link>

      <div className="grid lg:grid-cols-12 gap-9">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="badge badge-accent">{job.ecosystem}</span>
            <span className="badge">{job.category}</span>
            <span className="badge">{job.seniority}</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.8px] leading-tight">{job.title}</h1>
          <div className="mt-2 flex items-center gap-x-3 text-xl text-zinc-300">
            <span className="font-medium">{job.company}</span>
            <span className="text-zinc-600">·</span>
            <span>{job.source}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 bg-[#111114] border border-[#1f1f24] px-4 py-1.5 rounded-xl">
              <MapPin size={16} className="text-zinc-400" /> {job.location} · {job.work_mode}
            </div>
            <div className="flex items-center gap-2 bg-[#111114] border border-[#1f1f24] px-4 py-1.5 rounded-xl">
              <Briefcase size={16} className="text-zinc-400" /> {job.employment_type}
            </div>
            <div className="flex items-center gap-2 bg-[#111114] border border-[#1f1f24] px-4 py-1.5 rounded-xl">
              <Calendar size={16} className="text-zinc-400" /> Posted {format(new Date(job.date_posted), "MMM d, yyyy")}
            </div>
            {job.compensation && (
              <div className="flex items-center gap-2 bg-[#111114] border border-[#9b6dff]/40 px-4 py-1.5 rounded-xl text-[#c9a8ff]">
                {job.compensation}
              </div>
            )}
          </div>

          {job.curator_note && (
            <div className="mt-7 p-5 border-l-4 border-[#9b6dff] bg-[#111114] rounded-r-xl text-sm text-zinc-300">
              <span className="font-medium text-[#c9a8ff]">Curator note: </span>
              {job.curator_note}
            </div>
          )}

          <div className="mt-10 detail-section">
            <h3>Description</h3>
            <p className="leading-relaxed text-[15px] text-zinc-300">{job.description}</p>
          </div>

          {job.responsibilities.length > 0 && (
            <div className="mt-9 detail-section">
              <h3>Responsibilities</h3>
              <ul className="space-y-2 text-sm">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="list-item text-zinc-300">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements.length > 0 && (
            <div className="mt-9 detail-section">
              <h3>Requirements</h3>
              <ul className="space-y-2 text-sm">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="list-item text-zinc-300">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.nice_to_have.length > 0 && (
            <div className="mt-9 detail-section">
              <h3>Nice to have</h3>
              <ul className="space-y-2 text-sm">
                {job.nice_to_have.map((item, idx) => (
                  <li key={idx} className="list-item text-zinc-300">{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-9">
            <h3 className="section-title mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, i) => (
                <span key={i} className="tag px-3 py-1">{tag}</span>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#1f1f24]">
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex px-8 text-base"
            >
              Apply on {job.source} <ExternalLink size={16} className="ml-2" />
            </a>
            <div className="text-xs text-zinc-500 mt-3">
              Opens in new tab · Original posting at{" "}
              <a href={job.source_url} target="_blank" className="underline hover:text-white">{job.source}</a>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="card p-6 sticky top-20">
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-zinc-500 text-xs">COMPANY</div>
                <div className="font-medium mt-0.5">{job.company}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-xs">ECOSYSTEM</div>
                <div className="mt-0.5">{job.ecosystem}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-xs">COMPANY TYPE</div>
                <div className="mt-0.5">{job.company_type}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-xs">SOURCE</div>
                <a href={job.source_url} target="_blank" className="mt-0.5 text-[#c9a8ff] hover:underline block">{job.source}</a>
              </div>
              <div>
                <div className="text-zinc-500 text-xs">LOCATION &amp; WORK</div>
                <div className="mt-0.5">{job.location} · {job.work_mode}</div>
              </div>
              {job.compensation && (
                <div>
                  <div className="text-zinc-500 text-xs">COMPENSATION</div>
                  <div className="mt-0.5 text-[#c9a8ff]">{job.compensation}</div>
                </div>
              )}
            </div>

            <div className="my-6 border-t border-[#1f1f24]" />

            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center"
            >
              Apply Now
            </a>
            <Link href="/jobs" className="btn-ghost w-full justify-center mt-2 text-sm">
              Explore more roles
            </Link>
          </div>

          {similar.length > 0 && (
            <div className="mt-8">
              <div className="text-sm font-medium text-zinc-400 mb-3 px-1">Similar roles</div>
              <div className="space-y-3">
                {similar.map((s) => (
                  <Link href={`/jobs/${s.id}`} key={s.id} className="block card p-4 hover:border-[#9b6dff] transition-colors">
                    <div className="font-medium text-sm leading-tight">{s.title}</div>
                    <div className="text-xs text-zinc-400 mt-1">{s.company} · {s.ecosystem}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
