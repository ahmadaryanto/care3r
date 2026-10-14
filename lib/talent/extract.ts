import type { Availability, RemotePreference } from "./types";

export type ExtractedProfile = {
  full_name: string;
  email: string;
  country: string;
  timezone: string;
  main_role: string;
  secondary_role: string;
  years_experience: number | null;
  expected_monthly_salary_usd: number | null;
  expected_hourly_rate_usd: number | null;
  availability: Availability[];
  remote_preference: RemotePreference | "";
  skills: string[];
  tools: string[];
  languages: string[];
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  website_url: string;
  bio: string;
  work_samples: string;
  preferred_industries: string[];
  open_to_relocate: boolean | null;
  cv_text: string;
};

export type FieldKey = keyof ExtractedProfile;

export type MissingField = {
  key: FieldKey;
  label: string;
  required: boolean;
  reason: string;
};

const REQUIRED_FOR_SAVE: { key: FieldKey; label: string }[] = [
  { key: "full_name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "country", label: "Location / country" },
  { key: "timezone", label: "Timezone" },
  { key: "main_role", label: "Main role" },
  { key: "years_experience", label: "Years of experience" },
  { key: "expected_monthly_salary_usd", label: "Expected monthly salary (USD)" },
  { key: "availability", label: "Availability" },
  { key: "remote_preference", label: "Remote preference" },
  { key: "skills", label: "Skills" },
  { key: "bio", label: "Short bio" },
];

const OPTIONAL_HELPFUL: { key: FieldKey; label: string }[] = [
  { key: "secondary_role", label: "Secondary role" },
  { key: "tools", label: "Tools" },
  { key: "languages", label: "Languages" },
  { key: "portfolio_url", label: "Portfolio URL" },
  { key: "linkedin_url", label: "LinkedIn URL" },
  { key: "github_url", label: "GitHub URL" },
  { key: "work_samples", label: "Work samples / achievements" },
  { key: "preferred_industries", label: "Preferred industries" },
];

const SKILL_LEXICON = [
  "typescript",
  "javascript",
  "react",
  "next.js",
  "nextjs",
  "node.js",
  "nodejs",
  "python",
  "rust",
  "solidity",
  "go",
  "java",
  "sql",
  "postgresql",
  "mongodb",
  "aws",
  "docker",
  "kubernetes",
  "figma",
  "product management",
  "product marketing",
  "growth",
  "seo",
  "content strategy",
  "ui/ux",
  "design systems",
  "community",
  "devrel",
  "smart contracts",
  "defi",
  "web3",
  "ai",
  "machine learning",
  "llm",
  "data analysis",
  "analytics",
  "sales",
  "business development",
  "operations",
  "copywriting",
  "technical writing",
  "react native",
  "ios",
  "android",
  "security",
  "solidity",
  "foundry",
  "hardhat",
  "tailwind",
  "graphql",
  "redis",
  "prisma",
  "supabase",
];

const TOOL_LEXICON = [
  "notion",
  "linear",
  "jira",
  "slack",
  "hubspot",
  "figma",
  "vercel",
  "github",
  "gitlab",
  "postman",
  "amplitude",
  "mixpanel",
  "ga4",
  "google analytics",
  "airtable",
  "asana",
  "midjourney",
  "openai",
  "chatgpt",
  "docker",
  "kubernetes",
  "terraform",
];

function emptyProfile(): ExtractedProfile {
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

function firstMatch(text: string, re: RegExp): string {
  const m = text.match(re);
  return m?.[1]?.trim() || "";
}

function uniqueStrings(list: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const key = item.toLowerCase();
    if (!seen.has(key) && item.trim()) {
      seen.add(key);
      out.push(item.trim());
    }
  }
  return out;
}

function findLexiconHits(text: string, lexicon: string[]) {
  const lower = text.toLowerCase();
  return lexicon
    .filter((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}\\b`, "i").test(lower);
    })
    .map((t) =>
      t
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
        .replace("Next.js", "Next.js")
        .replace("Node.js", "Node.js")
        .replace("Ui/ux", "UI/UX")
        .replace("Ai", "AI")
        .replace("Llm", "LLM")
        .replace("Seo", "SEO")
        .replace("Defi", "DeFi")
        .replace("Web3", "Web3")
        .replace("Devrel", "DevRel")
        .replace("Sql", "SQL")
        .replace("Aws", "AWS")
        .replace("Ios", "iOS")
    );
}

/**
 * Heuristic CV scanner — extracts what it can, flags missing fields.
 * No external API required (works fully on localhost).
 */
export function extractProfileFromCvText(rawText: string): {
  profile: ExtractedProfile;
  missing_required: MissingField[];
  missing_optional: MissingField[];
  confidence_notes: string[];
} {
  const text = (rawText || "").replace(/\r/g, "\n").replace(/[ \t]+/g, " ").trim();
  const profile = emptyProfile();
  profile.cv_text = text.slice(0, 20000);
  const notes: string[] = [];

  if (!text || text.length < 20) {
    notes.push("Very little text extracted — fill the form manually.");
    return {
      profile,
      missing_required: REQUIRED_FOR_SAVE.map((f) => ({
        ...f,
        required: true,
        reason: "Not found in CV scan",
      })),
      missing_optional: OPTIONAL_HELPFUL.map((f) => ({
        ...f,
        required: false,
        reason: "Not found in CV scan",
      })),
      confidence_notes: notes,
    };
  }

  // Email
  profile.email = firstMatch(text, /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);

  // URLs
  const urls = text.match(/https?:\/\/[^\s)\]>",]+/gi) || [];
  for (const url of urls) {
    const u = url.replace(/[.,;]+$/, "");
    if (/linkedin\.com/i.test(u) && !profile.linkedin_url) profile.linkedin_url = u;
    else if (/github\.com/i.test(u) && !profile.github_url) profile.github_url = u;
    else if (/(twitter\.com|x\.com)\//i.test(u) && !profile.twitter_url)
      profile.twitter_url = u;
    else if (!profile.portfolio_url && !/linkedin|github|twitter|x\.com/i.test(u))
      profile.portfolio_url = u;
  }

  // Name — first non-empty line that looks like a name (not email/url)
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    if (
      line.length >= 3 &&
      line.length <= 60 &&
      !/@/.test(line) &&
      !/https?:/i.test(line) &&
      !/curriculum|resume|cv\b|profile|experience|skills/i.test(line) &&
      /^[A-Za-z][A-Za-z .'-]+$/.test(line) &&
      line.split(/\s+/).length <= 5
    ) {
      profile.full_name = line;
      break;
    }
  }

  // Role / title
  const role =
    firstMatch(text, /(?:title|role|position)\s*[:|-]\s*([^\n]{3,60})/i) ||
    firstMatch(
      text,
      /\b((?:Senior |Staff |Lead |Principal |Junior |Head of )?[\w/&+-]+(?: Engineer| Developer| Designer| Manager| Marketer| Analyst| Scientist| Writer| Lead| Product Manager| Product Designer| Community Manager| Growth| Founder| Operator)s?)\b/i
    );
  if (role) profile.main_role = role.replace(/\s+/g, " ").trim();

  // Years
  const years =
    firstMatch(text, /(\d{1,2})\+?\s*(?:\+)?\s*years?(?:\s+of)?\s+experience/i) ||
    firstMatch(text, /experience\s*[:|-]\s*(\d{1,2})/i);
  if (years) profile.years_experience = Number(years);

  // Location
  const loc =
    firstMatch(text, /(?:location|based in|lives? in|city)\s*[:|-]\s*([^\n,]{2,40})/i) ||
    firstMatch(
      text,
      /\b(Singapore|Indonesia|Malaysia|Philippines|Vietnam|Thailand|India|Japan|Korea|China|Australia|Germany|France|UK|United Kingdom|USA|United States|Canada|Brazil|Mexico|Nigeria|UAE|Netherlands|Spain|Portugal|Argentina|Poland|Remote)\b/i
    );
  if (loc) profile.country = loc;

  // Timezone
  const tz = firstMatch(text, /\b(GMT[+-]?\d{1,2}(?::\d{2})?|UTC[+-]?\d{1,2}|PST|EST|CET|WIB|WITA|WIT)\b/i);
  if (tz) profile.timezone = tz.toUpperCase().startsWith("GMT") || tz.toUpperCase().startsWith("UTC")
    ? tz.toUpperCase()
    : tz;

  // Salary
  const salary =
    firstMatch(text, /\$\s?([\d,]+)\s*(?:\/|per)?\s*(?:mo|month|monthly)/i) ||
    firstMatch(text, /(?:salary|compensation|rate)\s*[:|-]?\s*\$?\s*([\d,]+)/i);
  if (salary) {
    const n = Number(salary.replace(/,/g, ""));
    if (n > 0 && n < 500000) profile.expected_monthly_salary_usd = n;
  }

  // Availability
  const avail: Availability[] = [];
  if (/full[-\s]?time/i.test(text)) avail.push("full-time");
  if (/part[-\s]?time/i.test(text)) avail.push("part-time");
  if (/freelance|freelancer/i.test(text)) avail.push("freelance");
  if (/internship|intern\b/i.test(text)) avail.push("internship");
  if (/contract|contractor/i.test(text)) avail.push("contract");
  profile.availability = avail;

  // Remote
  if (/\bremote\b/i.test(text)) profile.remote_preference = "remote";
  else if (/\bhybrid\b/i.test(text)) profile.remote_preference = "hybrid";
  else if (/\bon[-\s]?site|onsite\b/i.test(text)) profile.remote_preference = "onsite";
  else if (/\bopen to (?:any|all|relocat)/i.test(text)) profile.remote_preference = "open";

  if (/open to relocate|willing to relocate/i.test(text)) profile.open_to_relocate = true;

  // Skills / tools
  profile.skills = uniqueStrings(findLexiconHits(text, SKILL_LEXICON)).slice(0, 16);
  profile.tools = uniqueStrings(findLexiconHits(text, TOOL_LEXICON)).slice(0, 12);

  // Languages section
  const langLine = firstMatch(text, /languages?\s*[:|-]\s*([^\n]{3,120})/i);
  if (langLine) {
    profile.languages = uniqueStrings(
      langLine.split(/[,/|•·]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 30)
    );
  } else {
    const langs = ["English", "Spanish", "French", "German", "Portuguese", "Mandarin", "Indonesian", "Japanese", "Korean", "Arabic", "Hindi"];
    profile.languages = langs.filter((l) => new RegExp(`\\b${l}\\b`, "i").test(text));
  }

  // Bio from first substantial paragraph
  const para = lines.find(
    (l) =>
      l.length > 80 &&
      l.length < 600 &&
      !/@/.test(l) &&
      !/https?:/i.test(l)
  );
  if (para) profile.bio = para;
  else if (profile.main_role) {
    profile.bio = `${profile.full_name || "Candidate"} — ${profile.main_role}${
      profile.years_experience != null
        ? ` with ${profile.years_experience}+ years of experience`
        : ""
    }. Skills include ${profile.skills.slice(0, 5).join(", ") || "various professional skills"}.`;
  }

  // Work samples / achievements (lines with metrics)
  const metricLines = lines
    .filter((l) => /(\d+%|\$\d|\d+x|increased|reduced|grew|shipped|launched|led )/i.test(l))
    .slice(0, 6);
  if (metricLines.length) profile.work_samples = metricLines.join("\n");

  // Industries
  const industries = ["AI", "SaaS", "Web3", "Fintech", "DeFi", "E-commerce", "Healthcare", "EdTech", "Gaming"];
  profile.preferred_industries = industries.filter((i) =>
    new RegExp(`\\b${i}\\b`, "i").test(text)
  );

  if (profile.email) notes.push("Email detected from CV.");
  if (profile.skills.length) notes.push(`Found ${profile.skills.length} skill signal(s).`);
  if (!profile.full_name) notes.push("Name not confidently detected.");
  if (!profile.main_role) notes.push("Role/title not confidently detected.");
  if (profile.expected_monthly_salary_usd == null)
    notes.push("Salary not on CV — usually needs manual input.");

  function isMissing(key: FieldKey): boolean {
    const v = profile[key];
    if (v == null) return true;
    if (typeof v === "string") return !v.trim();
    if (typeof v === "number") return Number.isNaN(v);
    if (Array.isArray(v)) return v.length === 0;
    return false;
  }

  const missing_required: MissingField[] = REQUIRED_FOR_SAVE.filter((f) =>
    isMissing(f.key)
  ).map((f) => ({
    ...f,
    required: true,
    reason: "Missing after CV scan — please complete",
  }));

  const missing_optional: MissingField[] = OPTIONAL_HELPFUL.filter((f) =>
    isMissing(f.key)
  ).map((f) => ({
    ...f,
    required: false,
    reason: "Optional — improves matching to jobs",
  }));

  return { profile, missing_required, missing_optional, confidence_notes: notes };
}
