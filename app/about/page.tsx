import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | care3r",
  description:
    "care3r is a curated discovery layer for Web3 roles and remote crypto careers: quality over quantity, from trusted primary sources.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="section-title mb-3">About</div>
      <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        High-signal discovery for the people actually building.
      </h1>

      <div className="mt-8 space-y-6 text-lg text-zinc-300">
        <p>
          care3r is a curated discovery layer for Web3 roles and remote crypto careers. We
          don&apos;t aggregate everything. We focus on quality over quantity: roles at serious
          protocols, ambitious startups, funds, and infrastructure teams.
        </p>
        <p>
          Our goal is simple: surface the best opportunities before they become obvious on the
          broader timeline.
        </p>
        <p className="text-base text-zinc-400">
          Looking for your next role? Get a free{" "}
          <Link href="/cv" className="text-violet-300 hover:underline">
            CV Power Score
          </Link>{" "}
          with feedback and a shareable card. Profiles stay private and help us match you with
          roles on the board.
        </p>
      </div>

      <div className="my-12 grid gap-y-8 border-y border-[#1f1f24] py-8 text-sm md:grid-cols-2">
        <div>
          <div className="mb-2 font-medium text-white">What we curate</div>
          <ul className="space-y-1 text-zinc-400">
            <li>• Protocol &amp; infrastructure engineering</li>
            <li>• Ecosystem growth, BD, and developer relations</li>
            <li>• Research, product, design, and operations</li>
            <li>• AI x Crypto and frontier primitives</li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-medium text-white">How it works</div>
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
    </div>
  );
}
