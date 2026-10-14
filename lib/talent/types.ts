export type Availability =
  | "full-time"
  | "part-time"
  | "freelance"
  | "internship"
  | "contract";

export type RemotePreference = "remote" | "hybrid" | "onsite" | "open";

export type CandidateStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "hidden"
  | "featured";

export type ScoreLabel =
  | "Needs Work"
  | "Needs Improvement"
  | "Getting There"
  | "Strong Candidate"
  | "Top Talent";

export type ScoreColor = "red" | "orange" | "yellow" | "green" | "purple";

export interface CategoryScores {
  cv_clarity: number;
  experience_strength: number;
  skills_match: number;
  portfolio_strength: number;
  impact_achievements: number;
  hiring_readiness: number;
}

export interface SalaryRange {
  monthly_min: number;
  monthly_max: number;
  hourly_min: number;
  hourly_max: number;
}

export interface AiScoreResult {
  overall_score: number;
  score_label: ScoreLabel;
  score_color: ScoreColor;
  category_scores: CategoryScores;
  strengths: string[];
  weaknesses: string[];
  recommended_improvements: string[];
  suggested_roles: string[];
  suggested_salary_range_usd: SalaryRange;
  recruiter_summary: string;
  candidate_summary: string;
  share_card_summary: string;
  improvement_checklist: string[];
}

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  country: string;
  timezone: string;
  main_role: string;
  secondary_role: string;
  years_experience: number;
  expected_monthly_salary_usd: number;
  expected_hourly_rate_usd?: number;
  availability: Availability[];
  remote_preference: RemotePreference;
  skills: string[];
  tools: string[];
  languages: string[];
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
  cv_file_url?: string;
  cv_text?: string;
  bio: string;
  work_samples?: string;
  preferred_industries: string[];
  open_to_relocate: boolean;
  public_profile_enabled: boolean;
  ai_score: number;
  ai_score_label: ScoreLabel;
  ai_score_color: ScoreColor;
  ai_summary: string;
  ai_result: AiScoreResult;
  status: CandidateStatus;
  /** When the candidate agreed to private storage and job matching. */
  consent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateSubmission {
  full_name: string;
  email: string;
  country: string;
  timezone: string;
  main_role: string;
  secondary_role?: string;
  years_experience: number;
  expected_monthly_salary_usd: number;
  expected_hourly_rate_usd?: number;
  availability: Availability[];
  remote_preference: RemotePreference;
  skills: string[];
  tools: string[];
  languages: string[];
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
  bio: string;
  work_samples?: string;
  preferred_industries: string[];
  open_to_relocate: boolean;
  public_profile_enabled: boolean;
  cv_text?: string;
  cv_file_name?: string;
}

export interface TalentFilters {
  q?: string;
  role?: string;
  skill?: string;
  country?: string;
  timezone?: string;
  salary_min?: number;
  salary_max?: number;
  availability?: string;
  experience_min?: number;
  experience_max?: number;
  remote_preference?: string;
  score_min?: number;
  score_max?: number;
  language?: string;
  industry?: string;
  open_to_freelance?: boolean;
  open_to_full_time?: boolean;
}
