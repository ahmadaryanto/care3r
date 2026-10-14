"use client";

import Link from "next/link";
import type { Candidate } from "@/lib/talent/types";
import { scoreColorClasses } from "@/lib/talent/scoring";
import ScoreRing from "./ScoreRing";

export default function CvPowerCard({
  candidate,
  showActions = false,
  compact = false,
}: {
  candidate: Candidate;
  showActions?: boolean;
  compact?: boolean;
}) {
  const c = scoreColorClasses(candidate.ai_score_color);
  const skills = candidate.skills.slice(0, 5);
  const availability = candidate.availability
    .map((a) => a.replace("-", " "))
    .join(" · ");

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#120e1c] via-[#0f0c18] to-[#0a0710] ${c.border} ${
        compact ? "p-5" : "p-6 sm:p-8"
      } shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300/90">
            CV Power
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {candidate.full_name}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">{candidate.main_role}</p>
        </div>
        <ScoreRing
          score={candidate.ai_score}
          color={candidate.ai_score_color}
          size={compact ? 88 : 108}
          stroke={compact ? 8 : 9}
        />
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${c.bg} ${c.border} ${c.text}`}
        >
          {candidate.ai_score_label}
        </span>
        {(candidate.remote_preference === "remote" || candidate.remote_preference === "open") && (
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Remote-ready
          </span>
        )}
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          ${candidate.expected_monthly_salary_usd.toLocaleString("en-US")}/mo USD
        </span>
      </div>

      <div className="relative mt-5 grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            Availability
          </div>
          <div className="mt-0.5 capitalize text-zinc-200">
            {candidate.remote_preference} / {availability || "Open"}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            Location
          </div>
          <div className="mt-0.5 text-zinc-200">
            {candidate.country} · {candidate.timezone}
          </div>
        </div>
      </div>

      <div className="relative mt-5">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">
          Top skills
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <p className="relative mt-5 text-sm leading-relaxed text-zinc-400">
        <span className="font-medium text-zinc-300">Summary: </span>
        “{candidate.ai_summary || candidate.ai_result.share_card_summary}”
      </p>

      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-[11px] text-zinc-500">
          CV Power Score by <span className="text-violet-300">care3r</span>
        </span>
        <Link
          href="/submit"
          className={showActions ? "btn-primary px-4 py-2 text-xs" : "text-xs font-medium text-violet-300 hover:text-violet-200"}
        >
          Get your own score →
        </Link>
      </div>
    </div>
  );
}
