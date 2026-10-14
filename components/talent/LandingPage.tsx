"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ScanSearch,
  Gauge,
  Lock,
  Link2,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  Briefcase,
} from "lucide-react";
import type { Candidate } from "@/lib/talent/types";
import CvPowerCard from "./CvPowerCard";

const easeOut = [0.23, 1, 0.32, 1] as const;

export default function LandingPage({ sampleCard }: { sampleCard: Candidate }) {
  const reduce = useReducedMotion();

  const enter = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12, scale: 0.98 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true, margin: "-48px" as const, amount: 0.2 },
          transition: { duration: 0.5, delay, ease: easeOut },
        };

  const steps = [
    {
      icon: ScanSearch,
      title: "Scan your CV",
      desc: "Upload a PDF, DOCX, or TXT, or paste text. We pull out your role, skills, and links.",
    },
    {
      icon: BadgeCheck,
      title: "Fill the gaps",
      desc: "Only what's missing is highlighted: salary, timezone, availability, and more.",
    },
    {
      icon: Gauge,
      title: "Get your score",
      desc: "A CV Power Score out of 100 with strengths, gaps, and concrete fixes.",
    },
    {
      icon: Link2,
      title: "Share & get matched",
      desc: "Share your card anywhere. Your profile stays private and we match you to roles.",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:pb-20 lg:pt-16">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(100%,36rem)] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl"
          aria-hidden
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-400">
              <Lock size={12} className="text-violet-300" />
              Free · private · 3 minutes
            </div>

            <h1 className="max-w-[16ch] text-[2rem] font-semibold tracking-[-0.035em] text-white sm:text-5xl sm:leading-[1.08] lg:text-[3.15rem] lg:leading-[1.08]">
              How strong is{" "}
              <span className="text-[#c9a8ff]">your CV</span>{" "}
              for Web3 roles?
            </h1>

            <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-zinc-400 sm:text-lg">
              Scan your CV, fill in what&apos;s missing, and get a CV Power Score with
              feedback you can act on, plus a card to share. Your profile is never public.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/submit"
                className="btn-primary gap-2 px-6 py-3 text-sm sm:text-base"
              >
                Get my score
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight size={14} />
                </span>
              </Link>
              <Link
                href="/jobs"
                className="btn-secondary px-6 py-3 text-sm sm:text-base"
              >
                Browse jobs
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <ScanSearch size={14} className="text-violet-300/90" />
                Scan first
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock size={14} className="text-amber-300/90" />
                Never public
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Link2 size={14} className="text-emerald-300/90" />
                Shareable card
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.08, ease: easeOut }}
            className="relative"
          >
            <div className="shell">
              <div className="shell-inner p-3 sm:p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-200">
                    Example card
                  </span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-400">
                    Sample profile, not a real person
                  </span>
                </div>
                <CvPowerCard candidate={sampleCard} compact />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works — asymmetric: hero step + 3 */}
      <section className="border-y border-[#201c2b] bg-[#08050f]/70 py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div {...enter()} className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              From CV to score in four steps
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              No account needed. Your file is read once and not kept.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, i) => (
              <motion.div
                key={item.title}
                {...enter(i * 0.05)}
                className={`rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-5 transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  i === 0
                    ? "border-violet-500/20 bg-gradient-to-b from-violet-500/[0.08] to-[#0f0c18] sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12 text-violet-300">
                  <item.icon size={18} strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs bridge */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <motion.div {...enter()}>
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Ready for your next role?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Browse curated Web3 roles at protocols, funds, and startups. A strong CV
              makes every application count.
            </p>
          </motion.div>
          <motion.div {...enter(0.06)}>
            <Link
              href="/jobs"
              className="btn-secondary inline-flex shrink-0 gap-2 px-5 py-2.5 text-sm"
            >
              <Briefcase size={15} strokeWidth={1.75} />
              Browse jobs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            {...enter()}
            className="relative overflow-hidden rounded-3xl border border-[#201c2b] bg-[#0f0c18] px-6 py-12 text-center sm:px-12"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(155,109,255,0.12),transparent_55%)]"
              aria-hidden
            />
            <div className="relative">
              <Sparkles className="mx-auto text-violet-300" size={20} strokeWidth={1.75} />
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                See where your CV stands
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400 sm:text-base">
                Free, private, and done in a few minutes.
              </p>
              <Link
                href="/submit"
                className="btn-primary mt-8 inline-flex gap-2 px-6 py-3 text-sm"
              >
                Get my CV Power Score
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
