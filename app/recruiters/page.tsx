import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "For recruiters | care3r",
  description:
    "Hiring for a Web3 role? care3r matches curated candidates from a private talent pool to your open roles. No public directory.",
  alternates: { canonical: "/recruiters" },
};

const points = [
  {
    icon: Sparkles,
    title: "Scored profiles",
    desc: "Every candidate comes with a CV Power Score, skills, availability, and salary expectations.",
  },
  {
    icon: ShieldCheck,
    title: "Consent-first",
    desc: "Candidates opt in to being matched. Profiles are never published or sold.",
  },
  {
    icon: Lock,
    title: "Private by design",
    desc: "There's no public talent directory. We introduce relevant candidates to your role.",
  },
];

export default function RecruitersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="section-title mb-3">For recruiters</div>
      <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
        Hiring for a Web3 role?
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-zinc-400">
        care3r keeps a private, consent-based pool of candidates who scanned their CVs with us.
        Tell us about your role and we&apos;ll introduce people who fit.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {points.map((p) => (
          <div key={p.title} className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12 text-violet-300">
              <p.icon size={18} strokeWidth={1.75} />
            </div>
            <h2 className="text-sm font-semibold text-white">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Hiring via care3r")}`}
          className="btn-primary gap-2 px-6 py-3 text-sm"
        >
          <Mail size={16} />
          Tell us about your role
        </a>
        <Link href="/submit-source" className="btn-secondary px-6 py-3 text-sm">
          List your jobs board as a source
        </Link>
      </div>
    </div>
  );
}
