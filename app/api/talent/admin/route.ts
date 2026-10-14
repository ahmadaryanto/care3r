import { NextRequest, NextResponse } from "next/server";
import {
  deleteCandidate,
  getAdminStats,
  listAllCandidates,
  rescoreCandidate,
  updateCandidateStatus,
} from "@/lib/talent/store";
import { StorageNotConfiguredError } from "@/lib/talent/db";
import { adminGuard } from "@/lib/admin-auth";
import type { CandidateStatus } from "@/lib/talent/types";

export const runtime = "nodejs";

const STATUSES: CandidateStatus[] = ["pending", "approved", "rejected", "hidden", "featured"];

export async function GET(req: NextRequest) {
  const denied = adminGuard(req);
  if (denied) return denied;
  const candidates = await listAllCandidates();
  return NextResponse.json({ candidates, stats: await getAdminStats(candidates) });
}

export async function PATCH(req: NextRequest) {
  const denied = adminGuard(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (body.action === "rescore") {
      const updated = await rescoreCandidate(id);
      if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ candidate: updated });
    }

    const status = body.status as CandidateStatus;
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await updateCandidateStatus(id, status);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ candidate: updated });
  } catch (err) {
    if (err instanceof StorageNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("admin patch error", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Permanently delete a candidate (e.g. a data-removal request).
export async function DELETE(req: NextRequest) {
  const denied = adminGuard(req);
  if (denied) return denied;
  try {
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const removed = await deleteCandidate(id);
    if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: id });
  } catch (err) {
    if (err instanceof StorageNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("admin delete error", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
