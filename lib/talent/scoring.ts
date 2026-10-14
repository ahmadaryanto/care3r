import type {
  AiScoreResult,
  CandidateSubmission,
  ScoreColor,
  ScoreLabel,
} from "./types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hasUrl(url?: string) {
  return Boolean(url && url.trim().length > 8);
}

function wordCount(text?: string) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasMetrics(text: string) {
  return /(\d+%|\$\d|\d+x|\d+\+|increased|reduced|grew|scaled|revenue|users|ARR|MRR)/i.test(
    text
  );
}

export function getScoreMeta(score: number): {
  score_label: ScoreLabel;
  score_color: ScoreColor;
  message: string;
} {
  if (score <= 20) {
    return {
      score_label: "Needs Work",
      score_color: "red",
      message: "Your CV needs major improvement before applying.",
    };
  }
  if (score <= 40) {
    return {
      score_label: "Needs Improvement",
      score_color: "orange",
      message:
        "Your CV has potential but needs stronger structure, proof, and clarity.",
    };
  }
  if (score <= 60) {
    return {
      score_label: "Getting There",
      score_color: "yellow",
      message:
        "Your profile is promising but still needs clearer achievements and stronger positioning.",
    };
  }
  if (score <= 80) {
    return {
      score_label: "Strong Candidate",
      score_color: "green",
      message: "Your CV is strong and ready for recruiter review.",
    };
  }
  return {
    score_label: "Top Talent",
    score_color: "purple",
    message:
      "Your profile is highly polished and stands out for global opportunities.",
  };
}

export function scoreColorClasses(color: ScoreColor) {
  const map: Record<
    ScoreColor,
    { text: string; bg: string; border: string; ring: string; bar: string }
  > = {
    red: {
      text: "text-red-400",
      bg: "bg-red-500/15",
      border: "border-red-500/30",
      ring: "ring-red-500/20",
      bar: "bg-red-500",
    },
    orange: {
      text: "text-orange-400",
      bg: "bg-orange-500/15",
      border: "border-orange-500/30",
      ring: "ring-orange-500/20",
      bar: "bg-orange-500",
    },
    yellow: {
      text: "text-yellow-400",
      bg: "bg-yellow-500/15",
      border: "border-yellow-500/30",
      ring: "ring-yellow-500/20",
      bar: "bg-yellow-500",
    },
    green: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/30",
      ring: "ring-emerald-500/20",
      bar: "bg-emerald-500",
    },
    purple: {
      text: "text-violet-300",
      bg: "bg-violet-500/15",
      border: "border-violet-500/35",
      ring: "ring-violet-500/25",
      bar: "bg-violet-500",
    },
  };
  return map[color];
}

/**
 * Deterministic, rule-based CV Power scoring (no AI model involved).
 * Uses form data + CV text signals. No external API required.
 * Produces actionable, encouraging feedback (not harsh).
 */
export function analyzeCandidate(input: CandidateSubmission): AiScoreResult {
  const bio = input.bio || "";
  const cv = input.cv_text || "";
  const samples = input.work_samples || "";
  const combined = `${bio}\n${cv}\n${samples}`;
  const skills = input.skills || [];
  const tools = input.tools || [];
  const years = Number(input.years_experience) || 0;
  const role = input.main_role || "Professional";

  // 1. CV Clarity (0-20)
  let cv_clarity = 6;
  const wc = wordCount(bio) + wordCount(cv);
  if (wc >= 40) cv_clarity += 4;
  if (wc >= 100) cv_clarity += 3;
  if (wc >= 180) cv_clarity += 2;
  if (bio.length >= 80) cv_clarity += 2;
  if (input.full_name && input.email && input.country && input.timezone)
    cv_clarity += 2;
  if (input.main_role) cv_clarity += 1;
  cv_clarity = clamp(cv_clarity, 0, 20);

  // 2. Experience Strength (0-20)
  let experience_strength = 4;
  if (years >= 1) experience_strength += 3;
  if (years >= 3) experience_strength += 4;
  if (years >= 5) experience_strength += 4;
  if (years >= 8) experience_strength += 3;
  if (input.secondary_role) experience_strength += 1;
  if (hasMetrics(combined)) experience_strength += 2;
  experience_strength = clamp(experience_strength, 0, 20);

  // 3. Skills Match (0-20)
  let skills_match = 5;
  if (skills.length >= 3) skills_match += 4;
  if (skills.length >= 5) skills_match += 3;
  if (skills.length >= 8) skills_match += 2;
  if (tools.length >= 2) skills_match += 2;
  if (tools.length >= 5) skills_match += 2;
  const roleTokens = role.toLowerCase().split(/[\s/,&-]+/).filter((t) => t.length > 2);
  const skillBlob = skills.join(" ").toLowerCase();
  const overlap = roleTokens.filter((t) => skillBlob.includes(t)).length;
  skills_match += Math.min(2, overlap);
  skills_match = clamp(skills_match, 0, 20);

  // 4. Portfolio / Proof of Work (0-15)
  let portfolio_strength = 2;
  if (hasUrl(input.portfolio_url)) portfolio_strength += 4;
  if (hasUrl(input.github_url)) portfolio_strength += 3;
  if (hasUrl(input.linkedin_url)) portfolio_strength += 2;
  if (hasUrl(input.website_url)) portfolio_strength += 2;
  if (wordCount(samples) >= 20) portfolio_strength += 2;
  portfolio_strength = clamp(portfolio_strength, 0, 15);

  // 5. Impact & Achievements (0-15)
  let impact_achievements = 3;
  if (hasMetrics(combined)) impact_achievements += 6;
  if (/(led|owned|built|launched|shipped|designed|grew)/i.test(combined))
    impact_achievements += 3;
  if (wordCount(samples) >= 40) impact_achievements += 2;
  if (years >= 3 && hasMetrics(combined)) impact_achievements += 1;
  impact_achievements = clamp(impact_achievements, 0, 15);

  // 6. Hiring Readiness (0-10)
  let hiring_readiness = 2;
  if (input.email) hiring_readiness += 1;
  if (input.availability?.length) hiring_readiness += 1;
  if (input.remote_preference) hiring_readiness += 1;
  if (input.expected_monthly_salary_usd > 0) hiring_readiness += 1;
  if (input.languages?.length) hiring_readiness += 1;
  if (input.public_profile_enabled) hiring_readiness += 1;
  if (hasUrl(input.linkedin_url) || hasUrl(input.portfolio_url))
    hiring_readiness += 1;
  if (input.preferred_industries?.length) hiring_readiness += 1;
  hiring_readiness = clamp(hiring_readiness, 0, 10);

  const overall_score = clamp(
    cv_clarity +
      experience_strength +
      skills_match +
      portfolio_strength +
      impact_achievements +
      hiring_readiness,
    0,
    100
  );

  const meta = getScoreMeta(overall_score);
  const topSkills = skills.slice(0, 5);
  const skillsText =
    topSkills.length > 0 ? topSkills.join(", ") : "core professional skills";

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommended_improvements: string[] = [];
  const improvement_checklist: string[] = [];

  if (cv_clarity >= 14)
    strengths.push("Clear and readable profile presentation");
  else {
    weaknesses.push("Profile clarity could be stronger for recruiters scanning quickly");
    recommended_improvements.push(
      "Rewrite your bio with a 2–3 sentence headline: role, specialty, and biggest win"
    );
    improvement_checklist.push("Tighten bio into a recruiter-ready summary");
  }

  if (experience_strength >= 14)
    strengths.push(`${years}+ years of relevant experience with solid positioning`);
  else {
    weaknesses.push("Experience story is underdeveloped relative to target role");
    recommended_improvements.push(
      "Add 2–3 bullet points that show ownership, scope, and outcomes from recent roles"
    );
    improvement_checklist.push("Add quantified experience bullets");
  }

  if (skills_match >= 14)
    strengths.push(`Strong skill set aligned with ${role}`);
  else {
    weaknesses.push("Skills list is thin or weakly aligned to the target role");
    recommended_improvements.push(
      `List 6–10 skills that match ${role} hiring keywords (tools + domain expertise)`
    );
    improvement_checklist.push("Expand role-aligned skills & tools");
  }

  if (portfolio_strength >= 10)
    strengths.push("Good proof-of-work via portfolio or public links");
  else {
    weaknesses.push("Limited public proof of work for recruiters to verify");
    recommended_improvements.push(
      "Add portfolio, GitHub, case studies, or 2 concrete work sample links"
    );
    improvement_checklist.push("Add portfolio / GitHub / work samples");
  }

  if (impact_achievements >= 10)
    strengths.push("Shows measurable impact and achievement language");
  else {
    weaknesses.push("Achievements lack metrics that prove impact");
    recommended_improvements.push(
      "Add numbers: % growth, users reached, revenue influenced, time saved, or launch outcomes"
    );
    improvement_checklist.push("Add metrics to achievements");
  }

  if (hiring_readiness >= 7)
    strengths.push("Profile is complete enough for recruiter outreach");
  else {
    weaknesses.push("Some hiring-critical fields are incomplete");
    recommended_improvements.push(
      "Complete availability, salary expectation, languages, and public contact links"
    );
    improvement_checklist.push("Complete salary, availability, and contact links");
  }

  if (strengths.length === 0) {
    strengths.push("You took the first step — your profile foundation is ready to improve");
  }
  if (improvement_checklist.length === 0) {
    improvement_checklist.push("Keep portfolio links updated every quarter");
    improvement_checklist.push("Refresh achievements with latest metrics");
  }

  // Suggested salary bands (rough heuristic by experience + score)
  const base =
    years < 1
      ? 1200
      : years < 3
        ? 2000
        : years < 5
          ? 3200
          : years < 8
            ? 4500
            : 6000;
  const scoreBoost = overall_score >= 70 ? 1.15 : overall_score >= 50 ? 1.0 : 0.9;
  const monthly_mid = Math.round(
    (input.expected_monthly_salary_usd || base) * scoreBoost
  );
  const monthly_min = Math.max(800, Math.round(monthly_mid * 0.75));
  // Keep the band ordered even for very low inputs (min has an $800 floor).
  const monthly_max = Math.max(monthly_min + 200, Math.round(monthly_mid * 1.25));
  const hourly_min = Math.max(10, Math.round(monthly_min / 160));
  const hourly_max = Math.max(hourly_min + 5, Math.round(monthly_max / 140));

  const suggested_roles = [
    role,
    input.secondary_role || `${role} Specialist`,
    years >= 5 ? `Senior ${role}` : `${role} (Growth Track)`,
  ].filter(Boolean) as string[];

  const candidate_summary = `${input.full_name || "Candidate"} is a ${role} with ${years} year${years === 1 ? "" : "s"} of experience. Profile score: ${overall_score}/100 (${meta.score_label}). Strongest signals: ${strengths[0]}.`;

  const recruiter_summary = `${input.full_name} — ${role} based in ${input.country || "Global"}, open to ${input.remote_preference || "remote"} work. Expects ~$${input.expected_monthly_salary_usd || monthly_mid}/mo. Top skills: ${skillsText}. CV Power: ${meta.score_label} (${overall_score}/100). ${strengths[0]}.`;

  const share_card_summary =
    overall_score >= 61
      ? `Strong ${role.toLowerCase()} profile with clear experience and solid proof of work. Could improve by adding more measurable results.`
      : `Promising ${role.toLowerCase()} profile with room to grow. Strengthen structure, proof of work, and quantified achievements to unlock more opportunities.`;

  return {
    overall_score,
    score_label: meta.score_label,
    score_color: meta.score_color,
    category_scores: {
      cv_clarity,
      experience_strength,
      skills_match,
      portfolio_strength,
      impact_achievements,
      hiring_readiness,
    },
    strengths,
    weaknesses,
    recommended_improvements,
    suggested_roles,
    suggested_salary_range_usd: {
      monthly_min,
      monthly_max,
      hourly_min,
      hourly_max,
    },
    recruiter_summary,
    candidate_summary,
    share_card_summary,
    improvement_checklist,
  };
}
