import AdminDashboardClient from "@/components/talent/AdminDashboardClient";
import { notFound } from "next/navigation";
import { getAdminStats, listAllCandidates } from "@/lib/talent/store";
import { storageMode } from "@/lib/talent/db";
import { isAdminRequest } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin | care3r",
  robots: { index: false, follow: false },
  description: "Review candidates and manage CV Power scores.",
};

export default async function AdminPage() {
  if (!(await isAdminRequest())) notFound();
  const candidates = await listAllCandidates();
  const stats = await getAdminStats(candidates);
  const mode = storageMode();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <div className="mb-10">
        <p className="section-title">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Talent pool dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Review candidates, feature the strongest, rescore, and export lists.
        </p>
        {mode === "unconfigured" && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Storage isn&apos;t connected, so new submissions can&apos;t be saved. Connect Upstash Redis
            in Vercel (KV_REST_API_URL / KV_REST_API_TOKEN) and redeploy.
          </p>
        )}
      </div>
      <AdminDashboardClient
        initialCandidates={candidates}
        initialStats={stats}
      />
    </div>
  );
}
