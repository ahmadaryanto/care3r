import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  ExternalLink,
  Mail,
  Globe,
} from "lucide-react";
import { getCandidateById } from "@/lib/talent/store";
import { isAdminRequest } from "@/lib/admin-auth";
import ScoreBadge from "@/components/talent/ScoreBadge";
import ScoreRing from "@/components/talent/ScoreRing";
import CategoryBars from "@/components/talent/CategoryBars";
import JobMatchPanel from "@/components/talent/JobMatchPanel";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminRequest())) notFound();
  const { id } = await params;
  const c = await getCandidateById(id);
  if (!c) notFound();

  // Admin view; fully hidden profiles stay out of the way
  if (c.status === "hidden") notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
        <strong className="font-medium">Private profile</strong> (admin only). Not published
        publicly. Use the job matches below to recommend this candidate to roles.
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ScoreBadge
              score={c.ai_score}
              label={c.ai_score_label}
              color={c.ai_score_color}
            />
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-300">
              Private pool
            </span>
            {c.status === "featured" && (
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">
                Featured (internal)
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {c.full_name}
          </h1>
          <p className="mt-1 text-lg text-zinc-400">
            {c.main_role}
            {c.secondary_role ? ` · ${c.secondary_role}` : ""}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} /> {c.country}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> {c.timezone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DollarSign size={14} /> $
              {c.expected_monthly_salary_usd.toLocaleString("en-US")}/mo USD
            </span>
            <span className="inline-flex items-center gap-1.5 capitalize">
              <Briefcase size={14} /> {c.years_experience} yrs ·{" "}
              {c.remote_preference}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {c.availability.map((a) => (
              <span
                key={a}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize text-zinc-300"
              >
                {a.replace("-", " ")}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={`mailto:${c.email}?subject=care3r: a role for you, ${c.full_name}`}
              className="btn-primary gap-2 px-4 py-2 text-sm"
            >
              <Mail size={15} />
              Contact
            </a>
            <Link
              href={`/card/${c.id}`}
              className="btn-secondary px-4 py-2 text-sm"
            >
              CV Power card
            </Link>
            {c.portfolio_url && (
              <a
                href={c.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost gap-1.5 px-3 py-2 text-sm"
              >
                <ExternalLink size={14} /> Portfolio
              </a>
            )}
          </div>
        </div>

        <div className="shrink-0 self-center sm:self-start">
          <ScoreRing score={c.ai_score} color={c.ai_score_color} size={120} />
        </div>
      </div>

      <div className="mt-6">
        <JobMatchPanel candidateId={c.id} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
            <h2 className="font-semibold text-white">About</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{c.bio}</p>
          </section>

          {c.work_samples && (
            <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
              <h2 className="font-semibold text-white">Work samples</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                {c.work_samples}
              </p>
            </section>
          )}

          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
            <h2 className="font-semibold text-white">Summary</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {c.ai_result.recruiter_summary}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              {c.ai_summary}
            </p>
          </section>

          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
            <h2 className="mb-4 font-semibold text-white">CV Power breakdown</h2>
            <CategoryBars scores={c.ai_result.category_scores} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
            <h2 className="font-semibold text-white">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-[#201c2b] bg-[#0c0814] px-2 py-0.5 text-xs text-zinc-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          {c.tools.length > 0 && (
            <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
              <h2 className="font-semibold text-white">Tools</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-[#201c2b] bg-[#0c0814] px-2 py-0.5 text-xs text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
            <h2 className="font-semibold text-white">Details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Experience</dt>
                <dd className="text-zinc-300">{c.years_experience} years</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Languages</dt>
                <dd className="text-right text-zinc-300">
                  {c.languages.join(", ") || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Industries</dt>
                <dd className="text-right text-zinc-300">
                  {c.preferred_industries.join(", ") || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Relocate</dt>
                <dd className="text-zinc-300">
                  {c.open_to_relocate ? "Yes" : "No"}
                </dd>
              </div>
              {c.expected_hourly_rate_usd != null && (
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500">Hourly</dt>
                  <dd className="text-zinc-300">
                    ${c.expected_hourly_rate_usd}/hr USD
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
            <h2 className="font-semibold text-white">Links</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {c.website_url && (
                <a
                  href={c.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-300 hover:underline"
                >
                  <Globe size={14} /> Website
                </a>
              )}
              {c.linkedin_url && (
                <a
                  href={c.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-300 hover:underline"
                >
                  <ExternalLink size={14} /> LinkedIn
                </a>
              )}
              {c.github_url && (
                <a
                  href={c.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-300 hover:underline"
                >
                  <ExternalLink size={14} /> GitHub
                </a>
              )}
              {c.twitter_url && (
                <a
                  href={c.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-300 hover:underline"
                >
                  <ExternalLink size={14} /> X / Twitter
                </a>
              )}
              {!c.website_url &&
                !c.linkedin_url &&
                !c.github_url &&
                !c.twitter_url &&
                !c.portfolio_url && (
                  <span className="text-zinc-500">No public links listed</span>
                )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
