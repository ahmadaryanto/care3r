"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import JobCard from "@/components/JobCard";
import CompanyLogo from "@/components/CompanyLogo";
import NewsletterForm from "@/components/NewsletterForm";
import SearchBar from "@/components/SearchBar";
import type { Job } from "@/lib/types";

type Count = { name: string; count: number };

export interface HomeInsights {
  totalRoles: number;
  companies: number;
  newThisWeek: number;
  activeSources: number;
  remoteShare: number;
  topEcosystems: Count[];
  topCategories: Count[];
  hiring: Count[];
}

interface HomePageClientProps {
  showcaseJobs: Job[];
  insights: HomeInsights;
  lastUpdated: string;
  /** Server-rendered Curated Drops grid. */
  dropsSection?: React.ReactNode;
  /** Server-rendered section shown between Curated Drops and "Why care3r". */
  talentSection?: React.ReactNode;
}

const fmt = (n: number) => n.toLocaleString("en-US");

function SectionHeader({ eyebrow, title, href, cta }: { eyebrow: string; title: string; href: string; cta: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="section-title mb-1.5">{eyebrow}</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">{title}</h2>
      </div>
      <Link href={href} className="group hidden shrink-0 items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white sm:flex">
        {cta}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

/** Single-series horizontal bars: value at the tip, per-bar tooltip, each bar links to a filtered list. */
function CategoryBars({ data, total }: { data: Count[]; total: number }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <ul className="space-y-2.5" aria-label="Open roles by category">
      {data.map((d) => {
        const share = Math.round((d.count / Math.max(total, 1)) * 100);
        return (
          <li key={d.name}>
            <Link
              href={`/jobs?categories=${encodeURIComponent(d.name)}`}
              className="group relative grid grid-cols-[110px_1fr] items-center gap-3 rounded-md focus-visible:outline-none sm:grid-cols-[140px_1fr]"
            >
              <span className="truncate text-[13px] text-zinc-300 group-hover:text-white">{d.name}</span>
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 rounded-r-[4px] bg-[#9b6dff] transition-[filter] group-hover:brightness-125"
                  style={{ width: `${Math.max((d.count / max) * 100, 4)}%`, maxWidth: "calc(100% - 3rem)" }}
                />
                <span className="text-[12px] font-medium tabular-nums text-zinc-300">{fmt(d.count)}</span>
              </span>
              <span
                role="tooltip"
                className="pointer-events-none absolute -top-9 right-0 z-10 whitespace-nowrap sm:right-auto rounded-md border border-white/10 bg-[#140f20] px-2.5 py-1 text-xs text-zinc-300 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:left-[150px]"
              >
                <strong className="font-semibold text-white">{fmt(d.count)} roles</strong> · {d.name} · {share}%
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function HomePageClient({ showcaseJobs, insights, lastUpdated, dropsSection, talentSection }: HomePageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/jobs?search=${encodeURIComponent(q)}` : "/jobs");
  };

  const updated = new Date(lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const kpis = [
    { label: "Open roles", value: fmt(insights.totalRoles) },
    { label: "Companies hiring", value: fmt(insights.companies) },
    { label: "Remote roles", value: `${insights.remoteShare}%` },
    { label: "Sources tracked", value: fmt(insights.activeSources) },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="hero-grid" aria-hidden="true" />
        <div
          className="pointer-events-none absolute left-1/2 top-[-120px] h-[420px] w-[min(900px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(155,109,255,0.22),transparent)] blur-2xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pt-20 lg:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <Link
              href="/jobs"
              className="rise-in inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] py-1 pl-2 pr-3 text-xs text-zinc-300 transition-colors hover:border-white/[0.16]"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>
                <span className="font-medium text-white">{fmt(insights.totalRoles)} roles</span> · {fmt(insights.newThisWeek)} new in the
                latest snapshot · updated {updated}
              </span>
              <ArrowRight size={12} className="text-zinc-400" />
            </Link>

            <h1 className="rise-in mt-7 text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[72px]" style={{ "--i": 1 } as React.CSSProperties}>
              <span className="text-gradient">Curated Web3 jobs</span>
              <br />
              <span className="text-zinc-400">for builders, operators &amp; crypto&#8209;native talent.</span>
            </h1>

            <p className="rise-in mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg" style={{ "--i": 2 } as React.CSSProperties}>
              High-signal roles across protocols, funds, startups, and infrastructure teams, reviewed and organized
              so you can find the right one fast.
            </p>

            <form onSubmit={handleSearchSubmit} className="rise-in mx-auto mt-9 max-w-2xl" style={{ "--i": 3 } as React.CSSProperties} role="search">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} size="lg" shortcut placeholder="Search roles, companies, or skills…" />
                </div>
                <button type="submit" className="btn-primary h-14 px-7 text-[15px]">
                  Search
                </button>
              </div>
            </form>

            <div className="rise-in mt-5 flex flex-wrap items-center justify-center gap-2" style={{ "--i": 4 } as React.CSSProperties}>
              <span className="mr-1 text-xs text-zinc-400">Popular:</span>
              {insights.topEcosystems.map((e) => (
                <Link
                  key={e.name}
                  href={`/jobs?ecosystems=${encodeURIComponent(e.name)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-[#9b6dff]/50 hover:text-white"
                >
                  {e.name}
                  <span className="tabular-nums text-zinc-400">{e.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Market overview */}
        <section className="grid gap-4 py-12 lg:grid-cols-[1fr_1.15fr]" aria-label="Market overview">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06]">
            {kpis.map((k) => (
              <div key={k.label} className="bg-[#0a0710] p-5 sm:p-6">
                <dt className="text-xs text-zinc-400">{k.label}</dt>
                <dd className="mt-1.5 text-3xl font-semibold tabular-nums tracking-tight text-white">{k.value}</dd>
              </div>
            ))}
          </dl>
          <div className="panel p-5 sm:p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-sm font-medium text-white">Open roles by category</h2>
              <Link href="/jobs" className="text-xs text-zinc-400 hover:text-white">
                All {fmt(insights.totalRoles)} →
              </Link>
            </div>
            <CategoryBars data={insights.topCategories} total={insights.totalRoles} />
          </div>
        </section>

        {/* Hiring now */}
        {insights.hiring.length > 0 && (
          <section className="pb-14" aria-label="Companies hiring now">
            <p className="mb-4 text-center text-xs uppercase tracking-[0.16em] text-zinc-400">Hiring now on care3r</p>
            <div className="marquee overflow-hidden">
              <div className="marquee-track gap-3">
                {[...insights.hiring, ...insights.hiring].map((c, i) => (
                  <Link
                    key={`${c.name}-${i}`}
                    href={`/jobs?search=${encodeURIComponent(c.name)}`}
                    aria-hidden={i >= insights.hiring.length}
                    tabIndex={i >= insights.hiring.length ? -1 : undefined}
                    className="mr-3 flex shrink-0 items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2 pl-2 pr-3.5 transition-colors hover:border-white/[0.14]"
                  >
                    <CompanyLogo company={c.name} size={26} />
                    <span className="text-[13px] font-medium text-zinc-200">{c.name}</span>
                    <span className="text-xs tabular-nums text-zinc-400">{c.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured roles */}
        <section className="pb-20">
          <SectionHeader eyebrow="Featured" title="High-signal roles this week" href="/jobs" cta="View all jobs" />
          {showcaseJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {showcaseJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <div className="panel py-8 text-center text-sm text-zinc-400">No featured roles at the moment.</div>
          )}
          <Link href="/jobs" className="btn-secondary mt-5 flex justify-center sm:hidden">
            Browse all jobs
          </Link>
        </section>

        {/* Curated Drops */}
        {dropsSection && (
          <section className="pb-20">
            <SectionHeader eyebrow="Editorial" title="Curated Drops" href="/curated-drops" cta="See all drops" />
            {dropsSection}
          </section>
        )}

        {talentSection}

        {/* Why care3r */}
        <section className="panel relative mb-20 overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#9b6dff]/10 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#c9a8ff]">
              <Sparkles size={13} /> Why care3r
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Not another job board.</h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-400 sm:text-lg">
              We curate and organize opportunities from the best sources across crypto. Every role is reviewed for
              signal, with compensation shown when it&apos;s available and a focus on teams that are actually building.
            </p>
          </div>
          <div className="relative mt-8 grid gap-3 text-sm sm:grid-cols-3">
            {["Only the highest-signal sources", "Thematic collections, not endless scrolling", "Built for crypto-native talent"].map((t) => (
              <div key={t} className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-zinc-300">
                <span className="mt-0.5 text-[#9b6dff]">→</span>
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mx-auto max-w-xl pb-20 text-center">
          <div className="section-title mb-2">Stay ahead</div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Get the best Web3 jobs before the timeline finds them.</h2>
          <div className="mt-6">
            <NewsletterForm compact />
          </div>
        </section>
      </div>
    </div>
  );
}
