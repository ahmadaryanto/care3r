"use client";

import type { ScoreColor } from "@/lib/talent/types";

const strokeMap: Record<ScoreColor, string> = {
  red: "#f87171",
  orange: "#fb923c",
  yellow: "#facc15",
  green: "#34d399",
  purple: "#a78bfa",
};

export default function ScoreRing({
  score,
  color,
  size = 120,
  stroke = 10,
  label,
}: {
  score: number;
  color: ScoreColor;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeMap[color]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight tabular-nums text-white">
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          {label || "/ 100"}
        </span>
      </div>
    </div>
  );
}
