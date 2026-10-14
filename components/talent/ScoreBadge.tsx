import type { ScoreColor, ScoreLabel } from "@/lib/talent/types";
import { scoreColorClasses } from "@/lib/talent/scoring";

export default function ScoreBadge({
  score,
  label,
  color,
  size = "md",
}: {
  score: number;
  label: ScoreLabel;
  color: ScoreColor;
  size?: "sm" | "md" | "lg";
}) {
  const c = scoreColorClasses(color);
  const pad =
    size === "lg"
      ? "px-4 py-2 text-sm"
      : size === "sm"
        ? "px-2.5 py-0.5 text-xs"
        : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${pad} ${c.bg} ${c.border} ${c.text}`}
    >
      <span className="font-semibold tabular-nums">{score}/100</span>
      <span className="opacity-80">·</span>
      <span>{label}</span>
    </span>
  );
}
