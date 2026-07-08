import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="section-title mb-3">About</div>
      <h1 className="text-5xl font-semibold tracking-[-1.2px] leading-none">High-signal discovery for the people actually building.</h1>

      <div className="mt-8 space-y-6 text-lg text-zinc-300">
        <p>
          care3r is a curated discovery layer for Web3 roles and remote crypto careers. We don&apos;t aggregate everything. 
          We focus on quality over quantity — roles at serious protocols, ambitious startups, funds, and infrastructure teams.
        </p>
        <p>
          Our goal is simple: surface the best opportunities before they become obvious on the broader timeline.
        </p>
      </div>

      <div className="my-12 border-y border-[#1f1f24] py-8 text-sm grid md:grid-cols-2 gap-y-8">
        <div>
          <div className="font-medium text-white mb-2">What we curate</div>
          <ul className="space-y-1 text-zinc-400">
            <li>• Protocol &amp; infrastructure engineering</li>
            <li>• Ecosystem growth, BD, and developer relations</li>
            <li>• Research, product, design, and operations</li>
            <li>• AI x Crypto and frontier primitives</li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-white mb-2">How it works</div>
          <ul className="space-y-1 text-zinc-400">
            <li>• We track trusted primary sources</li>
            <li>• Roles are reviewed and tagged</li>
            <li>• We publish editorial collections</li>
            <li>• You get signal without the noise</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/jobs" className="btn-primary px-8">Browse jobs</Link>
        <Link href="/submit-source" className="btn-secondary px-8">Submit a source</Link>
        <Link href="/curated-drops" className="btn-ghost px-4">Explore drops</Link>
      </div>

      <div className="mt-16 text-xs text-zinc-500">
        Built as a modern, data-ready system. Ready to be connected to real APIs, scraping pipelines, or Supabase.
      </div>
    </div>
  );
}
