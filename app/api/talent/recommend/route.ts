import { NextRequest, NextResponse } from "next/server";
import {
  createRecommendation,
  listRecommendations,
  updateRecommendationStatus,
} from "@/lib/talent/recommendations";
import { getCandidateById } from "@/lib/talent/store";
import { matchCandidateToJobs } from "@/lib/talent/match-jobs";
import { getJobsFeed } from "@/lib/jobs-feed";
import { adminGuard } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const denied = adminGuard(req);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const candidate_id = searchParams.get("candidate_id") || undefined;
  const job_id = searchParams.get("job_id") || undefined;
  const matches = searchParams.get("matches") === "1";

  if (matches && candidate_id) {
    const candidate = await getCandidateById(candidate_id);
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }
    const { jobs } = getJobsFeed({ slim: true });
    const jobMatches = matchCandidateToJobs(candidate, jobs, 20).map((m) => ({
      job_id: m.job.id,
      title: m.job.title,
      company: m.job.company,
      location: m.job.location,
      remote: m.job.remote,
      employment_type: m.job.employment_type,
      category: m.job.category,
      apply_url: m.job.apply_url,
      score: m.score,
      reasons: m.reasons,
    }));
    const saved = await listRecommendations({ candidate_id });
    return NextResponse.json({ matches: jobMatches, recommendations: saved });
  }

  const recommendations = await listRecommendations({ candidate_id, job_id });
  return NextResponse.json({ recommendations });
}

export async function POST(req: NextRequest) {
  const denied = adminGuard(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const candidate_id = String(body.candidate_id || "");
    const job_id = String(body.job_id || "");
    if (!candidate_id || !job_id) {
      return NextResponse.json(
        { error: "candidate_id and job_id required" },
        { status: 400 }
      );
    }

    const candidate = await getCandidateById(candidate_id);
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const { jobs } = getJobsFeed({ slim: true });
    const job = jobs.find((j) => j.id === job_id);
    if (!job) {
      return NextResponse.json({ error: "Job not found on local board" }, { status: 404 });
    }

    const rec = await createRecommendation({
      candidate_id,
      job_id: job.id,
      job_title: job.title,
      company: job.company,
      match_score: body.match_score != null ? Number(body.match_score) : undefined,
      note: String(body.note || ""),
    });

    return NextResponse.json({ recommendation: rec });
  } catch (err) {
    console.error("recommend error", err);
    return NextResponse.json({ error: "Failed to save recommendation" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = adminGuard(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const status = body.status as "recommended" | "contacted" | "archived";
    if (!id || !["recommended", "contacted", "archived"].includes(status)) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }
    const updated = await updateRecommendationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ recommendation: updated });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
