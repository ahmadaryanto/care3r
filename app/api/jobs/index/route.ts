import { NextResponse } from "next/server";
import { getAllJobs } from "@/lib/jobs-feed";

// Compact search index for the command palette (static, CDN-cached).
export const dynamic = "force-static";

export function GET() {
  const items = getAllJobs().map((j) => ({
    id: j.id,
    t: j.title,
    c: j.company,
    e: j.ecosystem,
    l: j.location,
    f: j.featured ? 1 : 0,
  }));
  return NextResponse.json(items);
}
