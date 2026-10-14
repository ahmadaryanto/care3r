import TalentDirectoryClient from "@/components/talent/TalentDirectoryClient";
import { notFound } from "next/navigation";
import { listAllCandidates } from "@/lib/talent/store";
import { isAdminRequest } from "@/lib/admin-auth";

export const metadata = {
  title: "Talent Pool (Admin) | care3r",
  robots: { index: false, follow: false },
  description: "Private internal talent pool — not a public directory.",
};

export default async function TalentPoolPage() {
  if (!(await isAdminRequest())) notFound();
  // Private pool: all non-hidden, non-rejected candidates
  const candidates = (await listAllCandidates()).filter(
    (c) => c.status !== "hidden" && c.status !== "rejected"
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
        <strong className="font-medium">Internal only</strong> — this pool is private.
        Use it to review candidates and recommend them to roles on the care3r board. Not for
        public discovery.
      </div>
      <div className="mb-10 max-w-2xl">
        <p className="section-title">Internal talent pool</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Saved talent
        </h1>
        <p className="mt-3 text-zinc-400">
          Filter and open profiles to match against the job board. Open a profile →
          recommend to roles.
        </p>
      </div>
      <TalentDirectoryClient candidates={candidates} />
    </div>
  );
}
