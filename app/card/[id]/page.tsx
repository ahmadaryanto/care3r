import { notFound } from "next/navigation";
import Link from "next/link";
import { getCandidateById } from "@/lib/talent/store";
import CvPowerCard from "@/components/talent/CvPowerCard";
import ShareCardActions from "@/components/talent/ShareCardActions";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = await getCandidateById(id);
  if (!c) return { title: "CV Power Card | care3r", robots: { index: false } };
  const title = `${c.full_name}: CV Power ${c.ai_score}/100 | care3r`;
  const description = `${c.main_role} · ${c.ai_score_label}. Get your own free CV Power Score on care3r.`;
  return {
    title,
    description,
    // Shared by link only; personal data stays out of search results.
    robots: { index: false, follow: true },
    openGraph: { title, description, type: "profile" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateById(id);
  if (!candidate) notFound();

  return (
    <div className="mx-auto max-w-xl px-6 py-12 sm:py-16">
      <div className="mb-8 text-center">
        <p className="section-title">Shareable card</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          CV Power Card
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Optimized for LinkedIn, X, Telegram, Discord & WhatsApp
        </p>
      </div>

      <div id="cv-power-card-export">
        <CvPowerCard candidate={candidate} showActions />
      </div>

      <div className="mt-6">
        <ShareCardActions
          candidateId={candidate.id}
          candidateName={candidate.full_name}
          score={candidate.ai_score}
          role={candidate.main_role}
        />
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Want your own score?{" "}
        <Link href="/submit" className="text-violet-300 hover:underline">
          Upload your CV
        </Link>
      </p>
    </div>
  );
}
