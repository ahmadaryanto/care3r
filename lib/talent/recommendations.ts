import { randomBytes } from "crypto";
import { listRecords, putRecord, getRecord } from "./db";

export type TalentRecommendation = {
  id: string;
  candidate_id: string;
  job_id: string;
  job_title: string;
  company: string;
  match_score?: number;
  note: string;
  status: "recommended" | "contacted" | "archived";
  created_at: string;
  updated_at: string;
};

const COLLECTION = "talent-recommendations" as const;

export async function listRecommendations(filters?: {
  candidate_id?: string;
  job_id?: string;
}) {
  let list = await listRecords<TalentRecommendation>(COLLECTION);
  if (filters?.candidate_id) {
    list = list.filter((r) => r.candidate_id === filters.candidate_id);
  }
  if (filters?.job_id) {
    list = list.filter((r) => r.job_id === filters.job_id);
  }
  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createRecommendation(input: {
  candidate_id: string;
  job_id: string;
  job_title: string;
  company: string;
  match_score?: number;
  note?: string;
}): Promise<TalentRecommendation> {
  const existing = (await listRecommendations({ candidate_id: input.candidate_id })).find(
    (r) => r.job_id === input.job_id && r.status !== "archived"
  );
  if (existing) {
    return putRecord(COLLECTION, {
      ...existing,
      note: input.note || existing.note,
      match_score: input.match_score ?? existing.match_score,
      updated_at: new Date().toISOString(),
    });
  }

  const now = new Date().toISOString();
  return putRecord(COLLECTION, {
    id: `rec-${randomBytes(6).toString("hex")}`,
    candidate_id: input.candidate_id,
    job_id: input.job_id,
    job_title: input.job_title,
    company: input.company,
    match_score: input.match_score,
    note: input.note || "",
    status: "recommended",
    created_at: now,
    updated_at: now,
  });
}

export async function updateRecommendationStatus(
  id: string,
  status: TalentRecommendation["status"]
) {
  const existing = await getRecord<TalentRecommendation>(COLLECTION, id);
  if (!existing) return null;
  return putRecord(COLLECTION, { ...existing, status, updated_at: new Date().toISOString() });
}
