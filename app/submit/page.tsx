import type { Metadata } from "next";
import { Lock } from "lucide-react";
import SubmitProfileForm from "@/components/talent/SubmitProfileForm";

export const metadata: Metadata = {
  title: "Get your CV Power Score | care3r",
  description:
    "Scan your CV, fill in the gaps, and get a free CV Power Score with feedback and a shareable card. Your profile stays private.",
  alternates: { canonical: "/submit" },
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-10">
        <p className="section-title">CV Power Score</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Scan your CV. Get your score.
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Upload your CV and we&apos;ll pull out your role, skills, and links. Fill in anything
          missing, then get your CV Power Score with concrete feedback and a card you can share.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#201c2b] bg-[#0f0c18] px-3 py-1.5 text-xs text-zinc-400">
          <Lock size={12} className="text-violet-300" />
          Private: your profile is never listed publicly, and the file itself isn&apos;t kept.
        </p>
      </div>
      <SubmitProfileForm />
    </div>
  );
}
