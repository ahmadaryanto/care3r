"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  ScanSearch,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import type { ExtractedProfile, MissingField } from "@/lib/talent/extract";

const AVAILABILITY = [
  "full-time",
  "part-time",
  "freelance",
  "internship",
  "contract",
] as const;

const REMOTE = ["remote", "hybrid", "onsite", "open"] as const;

type Step = "scan" | "complete" | "saving";

const fieldClass =
  "w-full rounded-xl border border-[#201c2b] bg-[#0c0814] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

function emptyForm(): ExtractedProfile {
  return {
    full_name: "",
    email: "",
    country: "",
    timezone: "",
    main_role: "",
    secondary_role: "",
    years_experience: null,
    expected_monthly_salary_usd: null,
    expected_hourly_rate_usd: null,
    availability: [],
    remote_preference: "",
    skills: [],
    tools: [],
    languages: [],
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
    website_url: "",
    bio: "",
    work_samples: "",
    preferred_industries: [],
    open_to_relocate: null,
    cv_text: "",
  };
}

export default function SubmitProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("scan");
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [missingRequired, setMissingRequired] = useState<MissingField[]>([]);
  const [missingOptional, setMissingOptional] = useState<MissingField[]>([]);
  const [form, setForm] = useState<ExtractedProfile>(emptyForm());

  const missingKeys = useMemo(
    () => new Set(missingRequired.map((m) => m.key)),
    [missingRequired]
  );

  function setField<K extends keyof ExtractedProfile>(key: K, value: ExtractedProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAvailability(value: string) {
    setForm((prev) => {
      const has = prev.availability.includes(value as never);
      return {
        ...prev,
        availability: has
          ? prev.availability.filter((v) => v !== value)
          : [...prev.availability, value as never],
      };
    });
  }

  async function runScan() {
    if (!cvFile && pasteText.trim().length < 20) {
      toast.error("Upload a CV or paste CV text first");
      return;
    }

    setScanning(true);
    try {
      const fd = new FormData();
      if (cvFile) fd.append("cv_file", cvFile);
      if (pasteText.trim()) fd.append("cv_text", pasteText.trim());

      const res = await fetch("/api/talent/scan", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");

      setForm({
        ...emptyForm(),
        ...data.profile,
        availability: data.profile.availability?.length
          ? data.profile.availability
          : [],
      });
      setMissingRequired(data.missing_required || []);
      setMissingOptional(data.missing_optional || []);
      setNotes(data.confidence_notes || []);
      setStep("complete");

      const missCount = (data.missing_required || []).length;
      if (missCount === 0) {
        toast.success("Scan complete — all required fields found. Review & save.");
      } else {
        toast.success(
          `Scan complete — ${missCount} required field${missCount === 1 ? "" : "s"} still needed`
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  async function saveToPool(e: React.FormEvent) {
    e.preventDefault();

    if (!form.full_name.trim() || !form.email.trim() || !form.main_role.trim()) {
      toast.error("Name, email, and main role are required");
      return;
    }
    if (!form.country.trim() || !form.timezone.trim()) {
      toast.error("Country and timezone are required");
      return;
    }
    if (!form.bio.trim()) {
      toast.error("Short bio is required");
      return;
    }
    if (!form.skills.length) {
      toast.error("Add at least one skill");
      return;
    }
    if (!form.availability.length) {
      toast.error("Select at least one availability option");
      return;
    }
    if (!form.remote_preference) {
      toast.error("Select remote preference");
      return;
    }
    if (form.years_experience == null) {
      toast.error("Years of experience is required");
      return;
    }
    if (form.expected_monthly_salary_usd == null) {
      toast.error("Expected monthly salary (USD) is required");
      return;
    }

    setSaving(true);
    setStep("saving");
    try {
      const fd = new FormData();
      fd.set("full_name", form.full_name);
      fd.set("email", form.email);
      fd.set("country", form.country);
      fd.set("timezone", form.timezone);
      fd.set("main_role", form.main_role);
      fd.set("secondary_role", form.secondary_role || "");
      fd.set("years_experience", String(form.years_experience ?? 0));
      fd.set("expected_monthly_salary_usd", String(form.expected_monthly_salary_usd ?? 0));
      if (form.expected_hourly_rate_usd != null) {
        fd.set("expected_hourly_rate_usd", String(form.expected_hourly_rate_usd));
      }
      form.availability.forEach((a) => fd.append("availability", a));
      fd.set("remote_preference", form.remote_preference || "remote");
      fd.set("skills", form.skills.join(", "));
      fd.set("tools", form.tools.join(", "));
      fd.set("languages", form.languages.join(", "));
      fd.set("portfolio_url", form.portfolio_url || "");
      fd.set("linkedin_url", form.linkedin_url || "");
      fd.set("github_url", form.github_url || "");
      fd.set("twitter_url", form.twitter_url || "");
      fd.set("website_url", form.website_url || "");
      fd.set("bio", form.bio);
      fd.set("work_samples", form.work_samples || "");
      fd.set("preferred_industries", form.preferred_industries.join(", "));
      if (form.open_to_relocate) fd.set("open_to_relocate", "true");
      // Force private pool
      fd.set("public_profile_enabled", "false");
      fd.set("cv_text", form.cv_text || pasteText || "");
      if (cvFile) fd.set("cv_file", cvFile);
      if (consent) fd.set("consent", "true");

      const res = await fetch("/api/talent/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      toast.success("Your CV Power Score is ready");
      router.push(`/analysis/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      setStep("complete");
    } finally {
      setSaving(false);
    }
  }

  function highlight(key: string) {
    return missingKeys.has(key as never)
      ? "ring-1 ring-amber-500/50 border-amber-500/40"
      : "";
  }

  return (
    <div className="space-y-6">
      {/* Steps */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: "scan", label: "1. Scan CV" },
          { id: "complete", label: "2. Fill missing" },
          { id: "saving", label: "3. Save to private pool" },
        ].map((s) => (
          <span
            key={s.id}
            className={`rounded-full border px-3 py-1 ${
              step === s.id
                ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
                : "border-[#201c2b] text-zinc-500"
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>

      {step === "scan" && (
        <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <ScanSearch size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Scan CV first</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Upload a PDF, DOCX, or TXT (max 5 MB) or paste your CV text. We pull out
                what we can, so you only fill in what&apos;s missing. Your file is read once
                and not stored.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className={labelClass}>Upload CV</label>
              <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#322c42] bg-[#0c0814] px-4 py-10 transition hover:border-violet-500/40">
                <Upload className="mb-2 text-zinc-500" size={22} />
                <span className="text-sm text-zinc-400">
                  {fileName || "Click to upload PDF, DOCX, or TXT"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setCvFile(f);
                    setFileName(f?.name || "");
                  }}
                />
              </label>
            </div>

            <div className="relative text-center text-xs text-zinc-600">
              <span className="bg-[#0f0c18] px-2">or paste CV text</span>
              <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-[#201c2b]" />
            </div>

            <div>
              <label className={labelClass}>Paste CV text</label>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={8}
                className={fieldClass}
                placeholder="Paste full CV / resume text here…"
              />
            </div>

            <button
              type="button"
              onClick={runScan}
              disabled={scanning}
              className="btn-primary w-full justify-center gap-2 py-3 text-sm disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
            >
              {scanning ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Scanning…
                </>
              ) : (
                <>
                  <ScanSearch size={16} />
                  Scan CV
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {step === "complete" && (
        <form onSubmit={saveToPool} className="space-y-6">
          <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
            <div className="flex items-start gap-2 text-sm">
              <FileText className="mt-0.5 shrink-0 text-violet-300" size={16} />
              <div>
                <p className="font-medium text-violet-100">Scan results</p>
                <ul className="mt-2 space-y-1 text-zinc-400">
                  {notes.map((n) => (
                    <li key={n}>· {n}</li>
                  ))}
                </ul>
                {missingRequired.length > 0 ? (
                  <div className="mt-3 flex items-start gap-2 text-amber-200/90">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <p>
                      <strong>{missingRequired.length} required</strong> field
                      {missingRequired.length === 1 ? "" : "s"} still missing — complete
                      the highlighted fields below.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 flex items-start gap-2 text-emerald-300">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                    <p>All required fields detected. Review and save to private pool.</p>
                  </div>
                )}
                {missingOptional.length > 0 && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Optional gaps ({missingOptional.length}):{" "}
                    {missingOptional.map((m) => m.label).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </section>

          {missingRequired.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {missingRequired.map((m) => (
                <span
                  key={m.key}
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200"
                >
                  Missing: {m.label}
                </span>
              ))}
            </div>
          )}

          <section className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white">Profile details</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Saved privately to the care3r talent pool so we can match you with roles.
              Never listed publicly.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full name *</label>
                <input
                  className={`${fieldClass} ${highlight("full_name")}`}
                  value={form.full_name}
                  onChange={(e) => setField("full_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input
                  type="email"
                  className={`${fieldClass} ${highlight("email")}`}
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Country *</label>
                <input
                  className={`${fieldClass} ${highlight("country")}`}
                  value={form.country}
                  onChange={(e) => setField("country", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Timezone *</label>
                <input
                  className={`${fieldClass} ${highlight("timezone")}`}
                  value={form.timezone}
                  onChange={(e) => setField("timezone", e.target.value)}
                  placeholder="GMT+7"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Main role *</label>
                <input
                  className={`${fieldClass} ${highlight("main_role")}`}
                  value={form.main_role}
                  onChange={(e) => setField("main_role", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Secondary role</label>
                <input
                  className={fieldClass}
                  value={form.secondary_role}
                  onChange={(e) => setField("secondary_role", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Years of experience *</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  step={0.5}
                  className={`${fieldClass} ${highlight("years_experience")}`}
                  value={form.years_experience ?? ""}
                  onChange={(e) =>
                    setField(
                      "years_experience",
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Expected monthly salary (USD) *</label>
                <input
                  type="number"
                  min={0}
                  className={`${fieldClass} ${highlight("expected_monthly_salary_usd")}`}
                  value={form.expected_monthly_salary_usd ?? ""}
                  onChange={(e) =>
                    setField(
                      "expected_monthly_salary_usd",
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Hourly rate (USD)</label>
                <input
                  type="number"
                  min={0}
                  className={fieldClass}
                  value={form.expected_hourly_rate_usd ?? ""}
                  onChange={(e) =>
                    setField(
                      "expected_hourly_rate_usd",
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Remote preference *</label>
                <select
                  className={`${fieldClass} ${highlight("remote_preference")}`}
                  value={form.remote_preference}
                  onChange={(e) =>
                    setField("remote_preference", e.target.value as never)
                  }
                  required
                >
                  <option value="">Select…</option>
                  {REMOTE.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Availability *</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AVAILABILITY.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAvailability(a)}
                      className={`filter-chip capitalize ${
                        form.availability.includes(a) ? "active" : ""
                      } ${missingKeys.has("availability") && !form.availability.length ? "ring-1 ring-amber-500/40" : ""}`}
                    >
                      {a.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Skills * (comma-separated)</label>
                <input
                  className={`${fieldClass} ${highlight("skills")}`}
                  value={form.skills.join(", ")}
                  onChange={(e) =>
                    setField(
                      "skills",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Tools</label>
                <input
                  className={fieldClass}
                  value={form.tools.join(", ")}
                  onChange={(e) =>
                    setField(
                      "tools",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Languages</label>
                <input
                  className={fieldClass}
                  value={form.languages.join(", ")}
                  onChange={(e) =>
                    setField(
                      "languages",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Short bio *</label>
                <textarea
                  rows={4}
                  className={`${fieldClass} ${highlight("bio")}`}
                  value={form.bio}
                  onChange={(e) => setField("bio", e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Work samples / achievements</label>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={form.work_samples}
                  onChange={(e) => setField("work_samples", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Portfolio URL</label>
                <input
                  className={fieldClass}
                  value={form.portfolio_url}
                  onChange={(e) => setField("portfolio_url", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>LinkedIn</label>
                <input
                  className={fieldClass}
                  value={form.linkedin_url}
                  onChange={(e) => setField("linkedin_url", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>GitHub</label>
                <input
                  className={fieldClass}
                  value={form.github_url}
                  onChange={(e) => setField("github_url", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Preferred industries</label>
                <input
                  className={fieldClass}
                  value={form.preferred_industries.join(", ")}
                  onChange={(e) =>
                    setField(
                      "preferred_industries",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>
            </div>
          </section>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#201c2b] bg-[#0f0c18] p-5 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-violet-500"
              required
            />
            <span>
              I agree that care3r may store my profile and CV text privately and use it to
              match me with job opportunities. It is never published, and I can ask for it to
              be deleted at any time.
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep("scan")}
              className="btn-ghost inline-flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={15} />
              Re-scan CV
            </button>
            <button
              type="submit"
              disabled={saving || !consent}
              className="btn-primary min-w-[220px] justify-center gap-2 px-6 py-3 text-sm disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving…
                </>
              ) : (
                <>
                  Get my CV Power Score
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {step === "saving" && (
        <div className="rounded-2xl border border-[#201c2b] bg-[#0f0c18] py-16 text-center">
          <Loader2 className="mx-auto animate-spin text-violet-300" size={28} />
          <p className="mt-4 text-sm text-zinc-400">
            Scoring your CV…
          </p>
        </div>
      )}
    </div>
  );
}
