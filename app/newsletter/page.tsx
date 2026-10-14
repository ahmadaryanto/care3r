import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Join care3r Drops: Web3 Jobs Newsletter | care3r",
  description:
    "Get the best Web3 jobs in your inbox before the timeline finds them.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center mb-9">
        <div className="section-title mb-3">The Drops</div>
        <h1 className="text-4xl font-semibold tracking-tight">Get the best Web3 jobs before the timeline finds them.</h1>
        <p className="mt-3 text-zinc-400">1–2 emails per week. Only the highest signal roles.</p>
      </div>

      <NewsletterForm />
    </div>
  );
}
