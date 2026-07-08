"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import CuratedDropCard from "@/components/CuratedDropCard";
import NewsletterForm from "@/components/NewsletterForm";
import SearchBar from "@/components/SearchBar";
import { curatedDrops, sources } from "@/lib/mock-data";
import type { Job } from "@/lib/types";

interface HomePageClientProps {
  initialJobs: Job[];
  totalListings: number;
  newThisWeek: number;
  lastUpdated: string;
}

export default function HomePageClient({
  initialJobs,
  totalListings,
  newThisWeek,
  lastUpdated,
}: HomePageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const showcaseJobs = useMemo(() => {
    const featured = initialJobs.filter((j) => j.featured && !j.expired);
    const recent = initialJobs
      .filter((j) => !j.expired && !j.featured)
      .sort(
        (a, b) =>
          new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime()
      );

    const picked: Job[] = [];
    for (const job of [...featured, ...recent]) {
      if (picked.length >= 6) break;
      if (!picked.some((p) => p.id === job.id)) picked.push(job);
    }
    return picked;
  }, [initialJobs]);

  const featuredDrops = curatedDrops.filter((d) => d.featured).slice(0, 3);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="pt-16 pb-12 md:pt-20 md:pb-16 text-center">
        <div className="inline-flex items-center rounded-full border border-[#1f1f24] bg-[#111114] px-3.5 py-1 text-xs tracking-[0.5px] text-zinc-400 mb-6">
          CURATED • HIGH-SIGNAL • WEB3
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-semibold tracking-[-1.6px] leading-[1.05] max-w-5xl mx-auto">
          Curated Web3 Jobs for Builders,<br className="hidden sm:block" />Operators, and Crypto-Native Talent.
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto tracking-tight">
          Discover high-signal opportunities across ecosystems, protocols, funds, startups, and crypto-native teams.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search roles, companies, ecosystems, or skills…"
            />
          </form>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link href="/jobs" className="btn-primary px-9 py-3 text-base w-full sm:w-auto justify-center">Explore Jobs</Link>
            <Link href="/submit-source" className="btn-secondary px-6 py-3 text-base w-full sm:w-auto justify-center">Submit a Job Source</Link>
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {totalListings.toLocaleString()} roles in snapshot • updated {new Date(lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1f1f24] rounded-2xl mb-16 overflow-hidden">
        {[
          { label: "Active Sources", value: sources.filter((s) => s.active).length.toString() },
          { label: "Curated Listings", value: totalListings.toLocaleString() },
          { label: "Featured Drops", value: curatedDrops.filter((d) => d.featured).length.toString() },
          { label: "New This Week", value: newThisWeek.toString() },
        ].map((s, i) => (
          <div key={i} className="bg-[#0a0a0f] py-4 sm:py-5 px-4 sm:px-6 text-center">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tighter text-white">{s.value}</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="section-title mb-1">Featured</div>
            <h2 className="text-3xl font-semibold tracking-tight">High-signal roles this week</h2>
          </div>
          <Link href="/jobs" className="btn-ghost hidden md:block">View all jobs →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {showcaseJobs.length > 0 ? (
            showcaseJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="col-span-3 py-8 text-center text-sm text-zinc-400">No featured roles at the moment.</div>
          )}
        </div>

        <div className="mt-5 flex justify-center md:hidden">
          <Link href="/jobs" className="btn-secondary px-8">Browse all jobs</Link>
        </div>
      </div>

      <div className="mb-20">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="section-title mb-1">Editorial</div>
            <h2 className="text-3xl font-semibold tracking-tight">Curated Drops</h2>
          </div>
          <Link href="/curated-drops" className="text-sm hover:text-white text-zinc-400 flex items-center gap-1">See all drops →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {featuredDrops.map((drop) => (
            <CuratedDropCard key={drop.id} drop={drop} />
          ))}
        </div>
      </div>

      <div className="border border-[#1f1f24] rounded-3xl px-8 py-12 mb-20 bg-[#111114]">
        <div className="max-w-2xl">
          <div className="text-[#c9a8ff] text-sm tracking-[1px] mb-3">WHY CARE3R</div>
          <h3 className="text-3xl font-semibold tracking-tight">Not another job board.</h3>
          <p className="mt-3 text-lg text-zinc-400">
            We manually curate and organize opportunities from the best sources across crypto.
            Every role is reviewed for signal. We prioritize quality, compensation transparency when available, and teams that are actually building.
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-3 gap-6 text-sm">
          {[
            "Only the highest signal sources",
            "Thematic collections, not endless scrolling",
            "Built for crypto-native talent",
          ].map((t, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="mt-1 text-[#9b6dff]">→</div>
              <div>{t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto text-center pb-20">
        <div className="mb-6">
          <div className="section-title mb-2">Stay ahead</div>
          <h3 className="text-3xl font-semibold tracking-tight">Get the best Web3 jobs before the timeline finds them.</h3>
        </div>
        <div className="mx-auto">
          <NewsletterForm compact />
        </div>
      </div>
    </div>
  );
}