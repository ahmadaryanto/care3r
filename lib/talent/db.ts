import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

/**
 * Tiny keyed-collection store for talent data.
 *
 * - Production (Vercel): Upstash Redis. Each collection is a Redis hash
 *   (`care3r:<collection>`) mapping record id -> JSON.
 *   Env: KV_REST_API_URL + KV_REST_API_TOKEN (Vercel Marketplace integration)
 *   or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 * - Local development: data/<collection>.json (gitignored).
 *
 * On Vercel without Redis configured, writes throw StorageNotConfiguredError
 * instead of failing on the read-only filesystem.
 */

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Talent storage is not configured. Connect Upstash Redis in Vercel.");
    this.name = "StorageNotConfiguredError";
  }
}

type Collection = "talent-candidates" | "talent-recommendations";

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const isServerless = Boolean(process.env.VERCEL);
const DATA_DIR = path.join(process.cwd(), "data");
const fileFor = (c: Collection) => path.join(DATA_DIR, `${c}.json`);
const keyFor = (c: Collection) => `care3r:${c}`;

export function storageMode(): "redis" | "file" | "unconfigured" {
  if (redis) return "redis";
  return isServerless ? "unconfigured" : "file";
}

async function readFile<T>(c: Collection): Promise<T[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(fileFor(c), "utf8"));
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeFile<T>(c: Collection, records: T[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(c), JSON.stringify(records, null, 2), "utf8");
}

export async function listRecords<T extends { id: string }>(c: Collection): Promise<T[]> {
  if (redis) {
    const all = await redis.hgetall<Record<string, T>>(keyFor(c));
    return all ? Object.values(all) : [];
  }
  if (isServerless) return [];
  return readFile<T>(c);
}

export async function getRecord<T extends { id: string }>(c: Collection, id: string): Promise<T | null> {
  if (redis) return (await redis.hget<T>(keyFor(c), id)) ?? null;
  if (isServerless) return null;
  return (await readFile<T>(c)).find((r) => r.id === id) ?? null;
}

export async function putRecord<T extends { id: string }>(c: Collection, record: T): Promise<T> {
  if (redis) {
    await redis.hset(keyFor(c), { [record.id]: record });
    return record;
  }
  if (isServerless) throw new StorageNotConfiguredError();
  const records = await readFile<T>(c);
  const idx = records.findIndex((r) => r.id === record.id);
  if (idx >= 0) records[idx] = record;
  else records.unshift(record);
  await writeFile(c, records);
  return record;
}

export async function deleteRecord(c: Collection, id: string): Promise<boolean> {
  if (redis) return (await redis.hdel(keyFor(c), id)) > 0;
  if (isServerless) throw new StorageNotConfiguredError();
  const records = await readFile<{ id: string }>(c);
  const next = records.filter((r) => r.id !== id);
  if (next.length === records.length) return false;
  await writeFile(c, next);
  return true;
}
