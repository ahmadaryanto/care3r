"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Candidate } from "@/lib/talent/types";
import TalentCard from "./TalentCard";

export default function TalentDirectoryClient({
  candidates,
}: {
  candidates: Candidate[];
}) {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");
  const [country, setCountry] = useState("");
  const [availability, setAvailability] = useState("");
  const [remote, setRemote] = useState("");
  const [scoreMin, setScoreMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(20000);
  const [showFilters, setShowFilters] = useState(false);
  const [openFreelance, setOpenFreelance] = useState(false);
  const [openFullTime, setOpenFullTime] = useState(false);

  const roles = useMemo(
    () =>
      Array.from(new Set(candidates.map((c) => c.main_role))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [candidates]
  );
  const countries = useMemo(
    () =>
      Array.from(new Set(candidates.map((c) => c.country))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [candidates]
  );
  const skills = useMemo(() => {
    const s = new Set<string>();
    candidates.forEach((c) => c.skills.forEach((x) => s.add(x)));
    return Array.from(s).sort((a, b) => a.localeCompare(b)).slice(0, 80);
  }, [candidates]);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (q) {
        const hay = [
          c.full_name,
          c.main_role,
          c.secondary_role,
          c.country,
          c.bio,
          ...c.skills,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      if (role && c.main_role !== role) return false;
      if (skill && !c.skills.some((s) => s === skill)) return false;
      if (country && c.country !== country) return false;
      if (availability && !c.availability.includes(availability as never))
        return false;
      if (remote && c.remote_preference !== remote) return false;
      if (c.ai_score < scoreMin) return false;
      if (c.expected_monthly_salary_usd > salaryMax) return false;
      if (openFreelance && !c.availability.includes("freelance")) return false;
      if (openFullTime && !c.availability.includes("full-time")) return false;
      return true;
    });
  }, [
    candidates,
    q,
    role,
    skill,
    country,
    availability,
    remote,
    scoreMin,
    salaryMax,
    openFreelance,
    openFullTime,
  ]);

  const selectClass =
    "rounded-xl border border-[#201c2b] bg-[#0c0814] px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, role, skill, country…"
            className="search-input"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="btn-secondary inline-flex items-center gap-2 text-sm"
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 grid gap-3 rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-4 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className={selectClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            <option value="">All skills</option>
            {skills.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">Any availability</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="freelance">Freelance</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <select
            className={selectClass}
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
          >
            <option value="">Any remote preference</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
            <option value="open">Open</option>
          </select>
          <div className="text-sm text-zinc-400">
            <label className="mb-1 block text-xs text-zinc-500">
              Min CV Power: {scoreMin}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={scoreMin}
              onChange={(e) => setScoreMin(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="text-sm text-zinc-400">
            <label className="mb-1 block text-xs text-zinc-500">
              Max monthly USD: ${salaryMax.toLocaleString("en-US")}
            </label>
            <input
              type="range"
              min={500}
              max={20000}
              step={100}
              value={salaryMax}
              onChange={(e) => setSalaryMax(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex flex-col justify-center gap-2 text-sm text-zinc-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={openFullTime}
                onChange={(e) => setOpenFullTime(e.target.checked)}
              />
              Open to full-time
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={openFreelance}
                onChange={(e) => setOpenFreelance(e.target.checked)}
              />
              Open to freelance
            </label>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
        <span>
          Showing{" "}
          <span className="font-medium text-zinc-300">{filtered.length}</span>{" "}
          candidates
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#322c42] py-16 text-center text-zinc-500">
          No candidates match these filters. Try broadening your search.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <TalentCard key={c.id} candidate={c} />
          ))}
        </div>
      )}
    </div>
  );
}
