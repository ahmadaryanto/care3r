import { randomBytes } from "crypto";
import type { Candidate, CandidateStatus, CandidateSubmission } from "./types";
import { analyzeCandidate } from "./scoring";
import { deleteRecord, getRecord, listRecords, putRecord } from "./db";

const COLLECTION = "talent-candidates" as const;

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

/** Unguessable id: readable slug + 10 random hex chars (results pages are link-access only). */
function newCandidateId(fullName: string) {
  return `${slugify(fullName) || "candidate"}-${randomBytes(5).toString("hex")}`;
}

const byNewest = (a: Candidate, b: Candidate) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

/** Every saved candidate (private talent pool). */
export async function listAllCandidates(): Promise<Candidate[]> {
  return (await listRecords<Candidate>(COLLECTION)).sort(byNewest);
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  return getRecord<Candidate>(COLLECTION, id);
}

export async function createCandidate(submission: CandidateSubmission): Promise<Candidate> {
  const result = analyzeCandidate(submission);
  const now = new Date().toISOString();

  const candidate: Candidate = {
    id: newCandidateId(submission.full_name),
    full_name: submission.full_name,
    email: submission.email,
    country: submission.country,
    timezone: submission.timezone,
    main_role: submission.main_role,
    secondary_role: submission.secondary_role || "",
    years_experience: Number(submission.years_experience) || 0,
    expected_monthly_salary_usd: Number(submission.expected_monthly_salary_usd) || 0,
    expected_hourly_rate_usd: submission.expected_hourly_rate_usd
      ? Number(submission.expected_hourly_rate_usd)
      : undefined,
    availability: submission.availability || [],
    remote_preference: submission.remote_preference,
    skills: submission.skills || [],
    tools: submission.tools || [],
    languages: submission.languages || [],
    portfolio_url: submission.portfolio_url,
    linkedin_url: submission.linkedin_url,
    github_url: submission.github_url,
    twitter_url: submission.twitter_url,
    website_url: submission.website_url,
    cv_text: submission.cv_text,
    bio: submission.bio,
    work_samples: submission.work_samples,
    preferred_industries: submission.preferred_industries || [],
    open_to_relocate: Boolean(submission.open_to_relocate),
    // The pool is private: profiles are never listed publicly.
    public_profile_enabled: false,
    ai_score: result.overall_score,
    ai_score_label: result.score_label,
    ai_score_color: result.score_color,
    ai_summary: result.share_card_summary,
    ai_result: result,
    status: "pending",
    consent_at: now,
    created_at: now,
    updated_at: now,
  };

  return putRecord(COLLECTION, candidate);
}

export async function updateCandidateStatus(
  id: string,
  status: CandidateStatus
): Promise<Candidate | null> {
  const existing = await getCandidateById(id);
  if (!existing) return null;
  return putRecord(COLLECTION, { ...existing, status, updated_at: new Date().toISOString() });
}

export async function rescoreCandidate(id: string): Promise<Candidate | null> {
  const existing = await getCandidateById(id);
  if (!existing) return null;

  const result = analyzeCandidate({
    full_name: existing.full_name,
    email: existing.email,
    country: existing.country,
    timezone: existing.timezone,
    main_role: existing.main_role,
    secondary_role: existing.secondary_role,
    years_experience: existing.years_experience,
    expected_monthly_salary_usd: existing.expected_monthly_salary_usd,
    expected_hourly_rate_usd: existing.expected_hourly_rate_usd,
    availability: existing.availability,
    remote_preference: existing.remote_preference,
    skills: existing.skills,
    tools: existing.tools,
    languages: existing.languages,
    portfolio_url: existing.portfolio_url,
    linkedin_url: existing.linkedin_url,
    github_url: existing.github_url,
    twitter_url: existing.twitter_url,
    website_url: existing.website_url,
    bio: existing.bio,
    work_samples: existing.work_samples,
    preferred_industries: existing.preferred_industries,
    open_to_relocate: existing.open_to_relocate,
    public_profile_enabled: existing.public_profile_enabled,
    cv_text: existing.cv_text,
  });

  return putRecord(COLLECTION, {
    ...existing,
    ai_score: result.overall_score,
    ai_score_label: result.score_label,
    ai_score_color: result.score_color,
    ai_summary: result.share_card_summary,
    ai_result: result,
    updated_at: new Date().toISOString(),
  });
}

/** Permanently remove a candidate (data-removal requests). */
export async function deleteCandidate(id: string): Promise<boolean> {
  return deleteRecord(COLLECTION, id);
}

export async function getAdminStats(all?: Candidate[]) {
  const list = all ?? (await listAllCandidates());
  const scores = list.map((c) => c.ai_score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return {
    total: list.length,
    pending: list.filter((c) => c.status === "pending").length,
    approved: list.filter((c) => c.status === "approved").length,
    featured: list.filter((c) => c.status === "featured").length,
    rejected: list.filter((c) => c.status === "rejected").length,
    hidden: list.filter((c) => c.status === "hidden").length,
    avg_score: avg,
    distribution: {
      needs_work: list.filter((c) => c.ai_score <= 20).length,
      needs_improvement: list.filter((c) => c.ai_score > 20 && c.ai_score <= 40).length,
      getting_there: list.filter((c) => c.ai_score > 40 && c.ai_score <= 60).length,
      strong: list.filter((c) => c.ai_score > 60 && c.ai_score <= 80).length,
      top: list.filter((c) => c.ai_score > 80).length,
    },
  };
}
