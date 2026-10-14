"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Candidate, CandidateStatus } from "@/lib/talent/types";
import ScoreBadge from "./ScoreBadge";

type Stats = {
  total: number;
  pending: number;
  approved: number;
  featured: number;
  rejected: number;
  hidden: number;
  avg_score: number;
  distribution: {
    needs_work: number;
    needs_improvement: number;
    getting_there: number;
    strong: number;
    top: number;
  };
};

export default function AdminDashboardClient({
  initialCandidates,
  initialStats,
}: {
  initialCandidates: Candidate[];
  initialStats: Stats;
}) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [stats, setStats] = useState(initialStats);
  const [filter, setFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (filter === "all") return candidates;
    return candidates.filter((c) => c.status === filter);
  }, [candidates, filter]);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch("/api/talent/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setCandidates((prev) => {
        const next = prev.map((c) =>
          c.id === id ? (data.candidate as Candidate) : c
        );
        return next;
      });

      const refresh = await fetch("/api/talent/admin");
      const full = await refresh.json();
      if (full.stats) setStats(full.stats);
      if (full.candidates) setCandidates(full.candidates);

      toast.success("Updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Permanently delete ${name}'s profile? This can't be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/talent/admin?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      const full = await (await fetch("/api/talent/admin")).json();
      if (full.stats) setStats(full.stats);
      toast.success("Profile deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setBusyId(null);
    }
  }

  function setStatus(id: string, status: CandidateStatus) {
    return patch(id, { status });
  }

  function rescore(id: string) {
    return patch(id, { action: "rescore" });
  }

  function exportCsv() {
    const rows = [
      [
        "id",
        "name",
        "email",
        "role",
        "country",
        "salary_usd",
        "score",
        "label",
        "status",
      ],
      ...visible.map((c) => [
        c.id,
        c.full_name,
        c.email,
        c.main_role,
        c.country,
        String(c.expected_monthly_salary_usd),
        String(c.ai_score),
        c.ai_score_label,
        c.status,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "talentpool-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  }

  const chips: { key: string; label: string }[] = [
    { key: "all", label: `All (${stats.total})` },
    { key: "pending", label: `Pending (${stats.pending})` },
    { key: "approved", label: `Approved (${stats.approved})` },
    { key: "featured", label: `Featured (${stats.featured})` },
    { key: "rejected", label: `Rejected (${stats.rejected})` },
    { key: "hidden", label: `Hidden (${stats.hidden})` },
  ];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total candidates", value: stats.total },
          { label: "Pending review", value: stats.pending },
          { label: "Approved / featured", value: stats.approved + stats.featured },
          { label: "Avg CV Power", value: stats.avg_score },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-5"
          >
            <div className="text-xs uppercase tracking-wider text-zinc-500">
              {s.label}
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums text-white">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-5">
        <h2 className="text-sm font-semibold text-white">Score distribution</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {[
            { label: "Needs Work", n: stats.distribution.needs_work, color: "bg-red-500" },
            {
              label: "Needs Improvement",
              n: stats.distribution.needs_improvement,
              color: "bg-orange-500",
            },
            {
              label: "Getting There",
              n: stats.distribution.getting_there,
              color: "bg-yellow-500",
            },
            { label: "Strong", n: stats.distribution.strong, color: "bg-emerald-500" },
            { label: "Top Talent", n: stats.distribution.top, color: "bg-violet-500" },
          ].map((d) => (
            <div key={d.label} className="text-center">
              <div className={`mx-auto h-2 w-full rounded-full ${d.color}/30`}>
                <div
                  className={`h-2 rounded-full ${d.color}`}
                  style={{
                    width: `${stats.total ? Math.max(8, (d.n / stats.total) * 100) : 0}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{d.n}</div>
              <div className="text-[11px] text-zinc-500">{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              className={`filter-chip ${filter === c.key ? "active" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={exportCsv} className="btn-secondary text-sm">
          Export list (CSV)
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#201c2b]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0c0814] text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Salary</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201c2b] bg-[#0f0c18]">
            {visible.map((c) => (
              <tr key={c.id} className="align-top">
                <td className="px-4 py-4">
                  <div className="font-medium text-white">{c.full_name}</div>
                  <div className="text-xs text-zinc-500">
                    {c.main_role} · {c.country}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600">{c.email}</div>
                  <Link
                    href={`/talent/${c.id}`}
                    className="mt-1 inline-block text-xs text-violet-300 hover:underline"
                  >
                    View profile
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <ScoreBadge
                    score={c.ai_score}
                    label={c.ai_score_label}
                    color={c.ai_score_color}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-4 tabular-nums text-zinc-300">
                  ${c.expected_monthly_salary_usd.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-4 capitalize text-zinc-400">{c.status}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        ["approved", "Approve"],
                        ["featured", "Feature"],
                        ["rejected", "Reject"],
                        ["hidden", "Hide"],
                        ["pending", "Pending"],
                      ] as [CandidateStatus, string][]
                    ).map(([status, label]) => (
                      <button
                        key={status}
                        type="button"
                        disabled={busyId === c.id || c.status === status}
                        onClick={() => setStatus(c.id, status)}
                        className="rounded-lg border border-[#201c2b] bg-[#0c0814] px-2 py-1 text-[11px] text-zinc-300 hover:border-violet-500/40 disabled:opacity-40"
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={busyId === c.id}
                      onClick={() => rescore(c.id)}
                      className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[11px] text-violet-200 disabled:opacity-40"
                    >
                      Rescore
                    </button>
                    <button
                      type="button"
                      disabled={busyId === c.id}
                      onClick={() => remove(c.id, c.full_name)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-200 disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
