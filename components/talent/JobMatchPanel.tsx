"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Link2, Check } from "lucide-react";

type Match = {
  job_id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  employment_type: string;
  category: string;
  apply_url: string;
  score: number;
  reasons: string[];
};

type Rec = {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  status: string;
  match_score?: number;
};

export default function JobMatchPanel({ candidateId }: { candidateId: string }) {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    const res = await fetch(
      `/api/talent/recommend?candidate_id=${encodeURIComponent(candidateId)}&matches=1`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");
    return data as { matches?: Match[]; recommendations?: Rec[] };
  }, [candidateId]);

  const apply = (data: { matches?: Match[]; recommendations?: Rec[] }) => {
    setMatches(data.matches || []);
    setRecs(data.recommendations || []);
  };

  // Refresh after an action (event handler, not an effect).
  async function load() {
    setLoading(true);
    try {
      apply(await fetchMatches());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    fetchMatches()
      .then((data) => active && apply(data))
      .catch((err) => active && toast.error(err instanceof Error ? err.message : "Failed to load matches"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [fetchMatches]);

  const recommendedIds = new Set(recs.map((r) => r.job_id));

  async function recommend(m: Match) {
    setBusy(m.job_id);
    try {
      const res = await fetch("/api/talent/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          job_id: m.job_id,
          match_score: m.score,
          note: m.reasons.join("; "),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(`Recommended to ${m.company} — ${m.title}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6 text-sm text-zinc-500">
        <Loader2 className="inline animate-spin" size={16} /> Matching against local job
        board…
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">Recommend to job board</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Admin only: match this candidate to roles on the care3r job board.
          </p>
        </div>
        <Link href="/jobs" className="text-xs text-violet-300 hover:underline">
          Open jobs board →
        </Link>
      </div>

      {recs.length > 0 && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="text-xs font-medium uppercase tracking-wider text-emerald-300/90">
            Saved recommendations ({recs.length})
          </div>
          <ul className="mt-2 space-y-1 text-sm text-zinc-400">
            {recs.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2">
                <Check size={13} className="text-emerald-400" />
                <Link href={`/jobs/${r.job_id}`} className="text-zinc-200 hover:underline">
                  {r.job_title}
                </Link>
                <span className="text-zinc-600">@ {r.company}</span>
                <span className="text-[11px] capitalize text-zinc-500">({r.status})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {matches.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          No strong matches yet. Add more skills/role detail and re-score, or browse jobs
          manually.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {matches.map((m) => {
            const already = recommendedIds.has(m.job_id);
            return (
              <div
                key={m.job_id}
                className="rounded-xl border border-[#201c2b] bg-[#0c0814] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/jobs/${m.job_id}`}
                      className="font-medium text-white hover:text-violet-200"
                    >
                      {m.title}
                    </Link>
                    <div className="mt-0.5 text-sm text-zinc-500">
                      {m.company} · {m.location}
                      {m.remote ? " · Remote" : ""} · {m.employment_type}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[11px] text-violet-200">
                        Match {m.score}/100
                      </span>
                      {m.reasons.map((r) => (
                        <span
                          key={r}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={busy === m.job_id || already}
                    onClick={() => recommend(m)}
                    className="btn-primary shrink-0 gap-1.5 px-3 py-2 text-xs disabled:opacity-50"
                  >
                    {busy === m.job_id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Link2 size={14} />
                    )}
                    {already ? "Recommended" : "Recommend"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
