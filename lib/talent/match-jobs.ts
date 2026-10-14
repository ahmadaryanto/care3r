import type { Job } from "@/lib/types";
import type { Candidate } from "./types";

export type JobMatch = {
  job: Job;
  score: number;
  reasons: string[];
};

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#./]+/)
    .filter((t) => t.length > 2);
}

/**
 * Score how well a private talent profile fits a job board listing.
 */
export function matchCandidateToJobs(
  candidate: Candidate,
  jobs: Job[],
  limit = 12
): JobMatch[] {
  const skillSet = new Set(candidate.skills.map((s) => s.toLowerCase()));
  const toolSet = new Set(candidate.tools.map((s) => s.toLowerCase()));
  const roleTokens = tokens(
    `${candidate.main_role} ${candidate.secondary_role} ${candidate.bio}`
  );
  const candidateBlob = [
    candidate.main_role,
    candidate.secondary_role,
    ...candidate.skills,
    ...candidate.tools,
    candidate.bio,
    ...candidate.preferred_industries,
  ]
    .join(" ")
    .toLowerCase();

  const results: JobMatch[] = [];

  for (const job of jobs) {
    if (job.expired) continue;
    let score = 0;
    const reasons: string[] = [];

    const jobText = [
      job.title,
      job.category,
      job.description,
      ...job.tags,
      ...job.requirements,
      ...job.responsibilities,
    ]
      .join(" ")
      .toLowerCase();

    // Title / role overlap
    const titleTokens = tokens(job.title);
    const titleHits = titleTokens.filter((t) => roleTokens.includes(t) || candidateBlob.includes(t));
    if (titleHits.length) {
      score += Math.min(35, titleHits.length * 10);
      reasons.push(`Role overlap: ${titleHits.slice(0, 3).join(", ")}`);
    }

    // Skill hits
    let skillHits = 0;
    for (const s of skillSet) {
      if (jobText.includes(s)) skillHits++;
    }
    for (const t of toolSet) {
      if (jobText.includes(t)) skillHits++;
    }
    if (skillHits) {
      score += Math.min(40, skillHits * 6);
      reasons.push(`${skillHits} skill/tool match(es)`);
    }

    // Tag overlap
    const tagHits = job.tags.filter((tag) => candidateBlob.includes(tag.toLowerCase()));
    if (tagHits.length) {
      score += Math.min(15, tagHits.length * 4);
      reasons.push(`Tags: ${tagHits.slice(0, 3).join(", ")}`);
    }

    // Remote preference
    if (candidate.remote_preference === "remote" && job.remote) {
      score += 8;
      reasons.push("Remote-compatible");
    }

    // Employment type vs availability
    const emp = job.employment_type.toLowerCase();
    if (emp.includes("full") && candidate.availability.includes("full-time")) {
      score += 6;
      reasons.push("Full-time availability");
    }
    if (emp.includes("contract") && candidate.availability.includes("contract")) {
      score += 6;
      reasons.push("Contract availability");
    }
    if (emp.includes("part") && candidate.availability.includes("part-time")) {
      score += 5;
      reasons.push("Part-time availability");
    }
    if (emp.includes("intern") && candidate.availability.includes("internship")) {
      score += 5;
      reasons.push("Internship availability");
    }

    // Category soft boost for AI / product / eng keywords
    if (
      /engineer|developer|design|product|marketing|growth|community|security|data|ai/i.test(
        candidate.main_role
      ) &&
      job.category
    ) {
      const cat = job.category.toLowerCase();
      if (candidate.main_role.toLowerCase().includes(cat.split(" ")[0])) {
        score += 5;
      }
    }

    if (score >= 12) {
      results.push({ job, score: Math.min(100, score), reasons: reasons.slice(0, 4) });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
