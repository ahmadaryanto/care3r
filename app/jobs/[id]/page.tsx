import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById, getAllJobs } from "@/lib/jobs-feed";
import { format } from "date-fns";
import { ArrowLeft, ExternalLink, MapPin, Briefcase, Calendar } from "lucide-react";
import type { Metadata } from "next";
import type { Job } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import CompanyLogo from "@/components/CompanyLogo";

type Props = { params: Promise<{ id: string }> };

// Scraped listings often carry a placeholder blurb instead of the real posting.
function hasRealDescription(job: Job) {
  const d = (job.description || "").trim();
  return d.length >= 300 && !/^Opportunity from /i.test(d);
}

function summary(job: Job) {
  if (hasRealDescription(job)) return job.description.replace(/\s+/g, " ").slice(0, 155);
  return `${job.seniority} ${job.employment_type.toLowerCase()} role at ${job.company} (${job.location}). Curated by care3r from ${job.source}.`;
}

const EMPLOYMENT: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
  Freelance: "CONTRACTOR",
};

// Prebuild every job page; unknown ids are a real 404 (no on-demand render).
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllJobs().map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return { title: "Job not found | care3r" };
  const title = `${job.title} at ${job.company} | care3r`;
  return {
    title,
    description: summary(job),
    alternates: { canonical: `/jobs/${job.id}` },
    openGraph: { title, description: summary(job), type: "article" },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const similar = getAllJobs()
    .filter(
      (j) =>
        j.id !== id &&
        (j.category === job.category || j.ecosystem === job.ecosystem)
    )
    .slice(0, 3);

  // JobPosting structured data only for listings with a real description (Google job-posting policy).
  const jsonLd = hasRealDescription(job)
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        datePosted: job.date_posted,
        validThrough: new Date(new Date(job.date_posted).getTime() + 60 * 864e5).toISOString().slice(0, 10),
        employmentType: EMPLOYMENT[job.employment_type],
        hiringOrganization: { "@type": "Organization", name: job.company },
        ...(job.remote
          ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Worldwide" } }
          : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } } }),
        url: `${SITE_URL}/jobs/${job.id}`,
        directApply: false,
      }
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
        <ArrowLeft size={16} /> Back to all jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-9">
        <div className="lg:col-span-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="badge badge-accent">{job.ecosystem}</span>
            <span className="badge">{job.category}</span>
            <span className="badge">{job.seniority}</span>
          </div>

          <div className="flex items-start gap-4">
            <CompanyLogo company={job.company} size={56} className="mt-1" />
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-4xl [overflow-wrap:anywhere]">{job.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 text-lg text-zinc-300">
                <span className="font-medium">{job.company}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">via {job.source}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] px-4 py-1.5 rounded-xl">
              <MapPin size={16} className="text-zinc-400" /> {job.location} · {job.work_mode}
            </div>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] px-4 py-1.5 rounded-xl">
              <Briefcase size={16} className="text-zinc-400" /> {job.employment_type}
            </div>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] px-4 py-1.5 rounded-xl">
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
            <p className="leading-relaxed text-[15px] text-zinc-300 whitespace-pre-line">{job.description}</p>
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