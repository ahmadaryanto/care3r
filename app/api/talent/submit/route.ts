import { NextRequest, NextResponse } from "next/server";
import { createCandidate } from "@/lib/talent/store";
import { StorageNotConfiguredError } from "@/lib/talent/db";
import { CvFileError, extractTextFromFile, validateCvFile } from "@/lib/talent/cv-text";
import type { Availability, RemotePreference } from "@/lib/talent/types";

export const runtime = "nodejs";

const AVAILABILITY: Availability[] = ["full-time", "part-time", "freelance", "contract", "internship"];
const REMOTE: RemotePreference[] = ["remote", "hybrid", "onsite", "open"];

function splitList(value: FormDataEntryValue | null, max = 40): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(/[,;\n]+/)
    .map((s) => s.trim().slice(0, 80))
    .filter(Boolean)
    .slice(0, max);
}

function asBool(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

const text = (form: FormData, key: string, max = 300) =>
  String(form.get(key) || "").trim().slice(0, max);

const url = (form: FormData, key: string) => {
  const v = text(form, key, 300);
  return /^https?:\/\//i.test(v) ? v : undefined;
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const full_name = text(form, "full_name", 120);
    const email = text(form, "email", 200);
    const country = text(form, "country", 80);
    const timezone = text(form, "timezone", 80);
    const main_role = text(form, "main_role", 120);
    const bio = text(form, "bio", 2000);

    if (!full_name || !email || !country || !timezone || !main_role || !bio) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!asBool(form.get("consent"))) {
      return NextResponse.json(
        { error: "Please agree to private storage of your profile to continue." },
        { status: 400 }
      );
    }

    const availability = form
      .getAll("availability")
      .map(String)
      .filter((a): a is Availability => AVAILABILITY.includes(a as Availability));
    const remoteRaw = text(form, "remote_preference", 20) as RemotePreference;

    // The CV file is read in memory for its text and never stored.
    let cv_text = text(form, "cv_text", 20000);
    const file = form.get("cv_file");
    if (file && file instanceof File && file.size > 0) {
      validateCvFile(file);
      const extracted = await extractTextFromFile(file);
      if (extracted && extracted.length > 40) {
        cv_text = (cv_text ? `${cv_text}\n\n${extracted}` : extracted).slice(0, 20000);
      }
    }

    const candidate = await createCandidate({
      full_name,
      email,
      country,
      timezone,
      main_role,
      secondary_role: text(form, "secondary_role", 120),
      years_experience: Math.max(0, Math.min(60, Number(form.get("years_experience") || 0))),
      expected_monthly_salary_usd: Math.max(0, Number(form.get("expected_monthly_salary_usd") || 0)),
      expected_hourly_rate_usd: form.get("expected_hourly_rate_usd")
        ? Math.max(0, Number(form.get("expected_hourly_rate_usd")))
        : undefined,
      availability: availability.length ? availability : ["full-time"],
      remote_preference: REMOTE.includes(remoteRaw) ? remoteRaw : "remote",
      skills: splitList(form.get("skills")),
      tools: splitList(form.get("tools")),
      languages: splitList(form.get("languages"), 10),
      portfolio_url: url(form, "portfolio_url"),
      linkedin_url: url(form, "linkedin_url"),
      github_url: url(form, "github_url"),
      twitter_url: url(form, "twitter_url"),
      website_url: url(form, "website_url"),
      bio,
      work_samples: text(form, "work_samples", 2000) || undefined,
      preferred_industries: splitList(form.get("preferred_industries"), 15),
      open_to_relocate: asBool(form.get("open_to_relocate")),
      public_profile_enabled: false,
      cv_text,
    });

    return NextResponse.json({
      id: candidate.id,
      score: candidate.ai_score,
      label: candidate.ai_score_label,
    });
  } catch (err) {
    if (err instanceof CvFileError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { error: "Profile saving isn't available yet. Please try again soon." },
        { status: 503 }
      );
    }
    console.error("talent submit error", err);
    return NextResponse.json({ error: "Failed to process submission." }, { status: 500 });
  }
}
