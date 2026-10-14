import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Share2,
} from "lucide-react";
import { getCandidateById } from "@/lib/talent/store";
import { getScoreMeta } from "@/lib/talent/scoring";
import ScoreRing from "@/components/talent/ScoreRing";
import CategoryBars from "@/components/talent/CategoryBars";
import ScoreBadge from "@/components/talent/ScoreBadge";
import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

// Results are link-access only: keep them out of search engines.
export const metadata: Metadata = {
  title: "Your CV Power results | care3r",
  robots: { index: false, follow: false },
};

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateById(id);
  if (!candidate) notFound();

  const result = candidate.ai_result;
  const meta = getScoreMeta(candidate.ai_score);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <div className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-violet-100/90">
        Your profile is saved <strong>privately</strong>. We&apos;ll reach out if a role on
        care3r fits. Bookmark this page: it&apos;s the only link to your results.
      </div>
      <div className="mb-8">
        <p className="section-title">CV Power analysis</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          CV Power results
        </h1>
        <p className="mt-2 text-zinc-400">
          {candidate.full_name} · {candidate.main_role}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6 text-center">
          <ScoreRing
            score={candidate.ai_score}
            color={candidate.ai_score_color}
            size={140}
            stroke={11}
          />
          <div className="mt-4 flex justify-center">
            <ScoreBadge
              score={candidate.ai_score}
              label={candidate.ai_score_label}
              color={candidate.ai_score_color}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            {meta.message}
          </p>
          <div className="mt-6 space-y-2">
            <Link
              href={`/card/${candidate.id}`}
              className="btn-primary w-full justify-center gap-2 py-2.5 text-sm"
            >
              <Share2 size={15} />
              Share your CV Power Card
            </Link>
            <Link
              href="/jobs"
              className="btn-secondary w-full justify-center gap-2 py-2.5 text-sm"
            >
              Browse jobs
              <ArrowRight size={15} />
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Rule-based score from your CV and profile details.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Want your profile deleted?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Delete my care3r profile")}&body=${encodeURIComponent("Profile ID: " + candidate.id)}`}
              className="text-violet-300 hover:underline"
            >
              Email us
            </a>
            .
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
            <h2 className="text-lg font-semibold text-white">
              Score breakdown
            </h2>
            <div className="mt-5">
              <CategoryBars scores={result.category_scores} />
            </div>
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
              <div className="mb-3 flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={16} />
                <h2 className="font-semibold text-white">Strengths</h2>
              </div>
              <ul className="space-y-2 text-sm text-zinc-400">
                {result.strengths.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-emerald-400">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
              <div className="mb-3 flex items-center gap-2 text-amber-300">
                <AlertTriangle size={16} />
                <h2 className="font-semibold text-white">Growth areas</h2>
              </div>
              <ul className="space-y-2 text-sm text-zinc-400">
                {result.weaknesses.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-amber-400">·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
            <div className="mb-3 flex items-center gap-2 text-violet-300">
              <Lightbulb size={16} />
              <h2 className="font-semibold text-white">
                Recommended improvements
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              {result.recommended_improvements.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="text-violet-400">→</span>
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <h3 className="text-sm font-medium text-zinc-300">
                Improvement checklist
              </h3>
              <ul className="mt-2 space-y-2">
                {result.improvement_checklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-zinc-400"
                  >
                    <input type="checkbox" className="mt-0.5" readOnly />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
              <h2 className="font-semibold text-white">Suggested role fit</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.suggested_roles.map((r) => (
                  <span
                    key={r}
                    className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs text-violet-200"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <h3 className="mt-5 text-sm font-medium text-zinc-300">
                Suggested salary range (USD)
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                ${result.suggested_salary_range_usd.monthly_min.toLocaleString("en-US")}{" "}
                – $
                {result.suggested_salary_range_usd.monthly_max.toLocaleString("en-US")}
                /mo
              </p>
              <p className="text-xs text-zinc-500">
                Hourly: $
                {result.suggested_salary_range_usd.hourly_min} – $
                {result.suggested_salary_range_usd.hourly_max}
              </p>
            </div>
            <div className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
              <h2 className="font-semibold text-white">How recruiters see you</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {result.recruiter_summary}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                <span className="text-zinc-300">For you: </span>
                {result.candidate_summary}
              </p>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={`/card/${candidate.id}`} className="btn-primary gap-2 px-5 py-2.5 text-sm">
              <Share2 size={15} />
              Share your card
            </Link>
            <Link href="/jobs" className="btn-secondary gap-2 px-5 py-2.5 text-sm">
              Find a role
              <ArrowRight size={15} />
            </Link>
            <Link href="/submit" className="btn-ghost px-4 py-2.5 text-sm">
              Improve and rescan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
