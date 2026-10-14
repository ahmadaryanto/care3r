import Link from "next/link";
import { MapPin, DollarSign, Briefcase, ExternalLink } from "lucide-react";
import type { Candidate } from "@/lib/talent/types";
import ScoreBadge from "./ScoreBadge";

export default function TalentCard({ candidate }: { candidate: Candidate }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">
            {candidate.full_name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-zinc-400">
            {candidate.main_role}
          </p>
        </div>
        <ScoreBadge
          score={candidate.ai_score}
          label={candidate.ai_score_label}
          color={candidate.ai_score_color}
          size="sm"
        />
      </div>

      <div className="mt-4 space-y-2 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="shrink-0 text-zinc-500" />
          <span className="truncate">
            {candidate.country} · {candidate.timezone}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="shrink-0 text-zinc-500" />
          <span>
            ${candidate.expected_monthly_salary_usd.toLocaleString("en-US")}/mo USD
          </span>
        </div>
        <div className="flex items-center gap-2 capitalize">
          <Briefcase size={14} className="shrink-0 text-zinc-500" />
          <span>
            {candidate.years_experience} yrs · {candidate.remote_preference} ·{" "}
            {candidate.availability[0]?.replace("-", " ") || "open"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {candidate.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-md border border-[#201c2b] bg-[#0c0814] px-2 py-0.5 text-[11px] text-zinc-400"
          >
            {s}
          </span>
        ))}
        {candidate.skills.length > 4 && (
          <span className="text-[11px] text-zinc-500">
            +{candidate.skills.length - 4}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-5">
        <Link
          href={`/talent/${candidate.id}`}
          className="btn-primary flex-1 py-2 text-center text-xs"
        >
          View profile
        </Link>
        {candidate.portfolio_url && (
          <a
            href={candidate.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center justify-center px-3 py-2"
            aria-label="Portfolio"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
