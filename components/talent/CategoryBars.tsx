import type { CategoryScores } from "@/lib/talent/types";

const LABELS: { key: keyof CategoryScores; label: string; max: number }[] = [
  { key: "cv_clarity", label: "CV Clarity", max: 20 },
  { key: "experience_strength", label: "Experience Strength", max: 20 },
  { key: "skills_match", label: "Skills Match", max: 20 },
  { key: "portfolio_strength", label: "Portfolio / Proof", max: 15 },
  { key: "impact_achievements", label: "Impact & Achievements", max: 15 },
  { key: "hiring_readiness", label: "Hiring Readiness", max: 10 },
];

export default function CategoryBars({ scores }: { scores: CategoryScores }) {
  return (
    <div className="space-y-3">
      {LABELS.map(({ key, label, max }) => {
        const value = scores[key];
        const pct = Math.round((value / max) * 100);
        return (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-zinc-300">{label}</span>
              <span className="tabular-nums text-zinc-500">
                {value}/{max}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
