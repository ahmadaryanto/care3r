import { NextResponse } from 'next/server';
import { getJobsFeed } from '@/lib/jobs-feed';

/** Static snapshot only — refreshed via `npm run scrape:jobs`, not on user visits. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featured') === 'true';
  const slim = searchParams.get('lite') === '1' || searchParams.get('lite') === 'true';

  const feed = getJobsFeed({ featuredOnly, slim });

  return NextResponse.json({
    count: feed.count,
    updated: feed.updated,
    liveMerged: feed.liveMerged,
    bitgetImported: feed.bitgetImported,
    bitgetScrapedAt: feed.bitgetScrapedAt,
    cached: true,
    note: 'Static snapshot. Refresh data with: npm run scrape:jobs',
    sources: ['curated', 'bitget', 'solana', 'avax', 'monad-eco', 'ethereumjobboard', 'web3.career', 'cryptojobslist', 'cryptocurrencyjobs', 'midnight', 'dragonfly', 'block', 'crypto-careers', 'beincrypto', 'jobstash', 'remote3', 'perle-rippling'],
    jobs: feed.jobs,
  });
}