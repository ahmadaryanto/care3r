import { NextResponse } from 'next/server';
import { getJobsFeed } from '@/lib/jobs-feed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/jobs
 *
 * Query params:
 *   ?featured=true
 *   ?curatedOnly=1   → skip live scraping (curated + Bitget only)
 *   ?refresh=1       → force bypass cache
 *   ?lite=1          → slimmer payload for faster client loads
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featured') === 'true';
  const curatedOnly = searchParams.get('curatedOnly') === '1' || searchParams.get('curatedOnly') === 'true';
  const forceRefresh = searchParams.get('refresh') === '1' || searchParams.get('refresh') === 'true';
  const slim = searchParams.get('lite') === '1' || searchParams.get('lite') === 'true';

  const feed = await getJobsFeed({
    featuredOnly,
    curatedOnly,
    includeLive: !curatedOnly,
    forceRefresh,
    slim,
  });

  return NextResponse.json({
    count: feed.count,
    updated: feed.updated,
    liveMerged: feed.liveMerged,
    bitgetImported: feed.bitgetImported,
    bitgetScrapedAt: feed.bitgetScrapedAt,
    cached: feed.cached,
    note: curatedOnly
      ? 'Curated snapshot + imported Bitget roles (curatedOnly=1).'
      : featuredOnly
        ? 'Featured curated roles only.'
        : 'Live-enriched feed with curated roles, Bitget import, and scraped sources.',
    sources: ['curated', 'bitget', 'solana', 'avax', 'monad-eco', 'ethereumjobboard', 'web3.career', 'cryptojobslist', 'cryptocurrencyjobs', 'midnight', 'dragonfly', 'block', 'crypto-careers', 'beincrypto', 'jobstash', 'remote3', 'perle-rippling'],
    jobs: feed.jobs,
  });
}