import React from "react";
import SourceCard from "@/components/SourceCard";
import { sources } from "@/lib/mock-data";

export default function SourcesPage() {
  const activeSources = sources.filter((s) => s.active);
  const totalJobs = sources.reduce((sum, s) => sum + s.indexed_jobs_count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-9 max-w-2xl">
        <div className="section-title">Transparency</div>
        <h1 className="text-4xl font-semibold tracking-tight">Tracked Sources</h1>
        <p className="mt-3 text-lg text-zinc-400">
          We pull from high-quality, regularly updated job sources across Web3. 
          All sources are reviewed for signal before being added to the system.
        </p>
        <div className="mt-2 text-sm text-zinc-500">{activeSources.length} active sources • ~{totalJobs} indexed listings</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeSources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>

      <div className="mt-14 max-w-lg text-xs text-zinc-500">
        Want to suggest a new source? <a href="/submit-source" className="text-[#c9a8ff] hover:underline">Submit it here</a>.
      </div>

      <div className="mt-10 p-6 border border-[#201c2b] rounded-2xl bg-[#0c0814] text-sm text-zinc-400">
        <div className="font-medium text-[#c9a8ff] mb-2">About data accuracy</div>
        <p>
          Apply links point to real opportunities on company career pages (Lever, Ashby, direct) or the original boards.
          The listings are a high-signal curated snapshot pulled from the live sources above.
          Many boards are heavily JavaScript-rendered, so we currently combine manual verification with real links.
        </p>
        <p className="mt-3">
          Full automated scraping (RSS + targeted server scrapers) is planned. See <code className="text-xs">lib/scrapers.ts</code>.
        </p>
      </div>
    </div>
  );
}
