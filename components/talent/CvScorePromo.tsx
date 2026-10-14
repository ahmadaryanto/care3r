import Link from "next/link";
import { ArrowRight, Lock, ScanSearch, Share2 } from "lucide-react";
import type { Candidate } from "@/lib/talent/types";
import CvPowerCard from "./CvPowerCard";

/** Homepage section promoting the free CV Power Score. */
export default function CvScorePromo({ sampleCard }: { sampleCard: Candidate }) {
  return (
    <section className="mb-20 overflow-hidden rounded-3xl border border-[#201c2b] bg-gradient-to-br from-violet-500/[0.07] via-[#0f0c18] to-[#0b0812]">
      <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-12">
        <div>
          <div className="section-title mb-3">For candidates</div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            How strong is your CV for Web3 roles?
          </h2>
          <p className="mt-4 max-w-lg text-lg text-zinc-400">
            Scan your CV and get a free CV Power Score with strengths, gaps, and concrete fixes,
            plus a card you can share on X, LinkedIn, or Telegram.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-zinc-300">
            <li className="flex items-center gap-2.5">
              <ScanSearch size={16} className="text-violet-300" />
              Upload a PDF, DOCX, or TXT. Done in about three minutes.
            </li>
            <li className="flex items-center gap-2.5">
              <Lock size={16} className="text-violet-300" />
              Private: never listed publicly, and the file isn&apos;t kept.
            </li>
            <li className="flex items-center gap-2.5">
              <Share2 size={16} className="text-violet-300" />
              Strong profiles get matched to roles on care3r.
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/submit" className="btn-primary gap-2 px-6 py-3 text-base">
              Get my CV Power Score
              <ArrowRight size={16} />
            </Link>
            <Link href="/cv" className="btn-ghost px-4 py-3 text-base">
              How it works
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <span className="absolute -top-3 left-4 z-10 rounded-full border border-violet-500/30 bg-[#140d22] px-3 py-1 text-[11px] font-medium text-violet-200">
            Example card · sample profile
          </span>
          <CvPowerCard candidate={sampleCard} compact />
        </div>
      </div>
    </section>
  );
}
