/**
 * Build static jobs snapshot (run offline — NOT on user visits)
 *
 * Usage:
 *   npm run scrape:jobs
 *
 * Output:
 *   data/jobs-feed.json
 */

import { writeFileSync } from 'fs';
import { createHash } from 'crypto';

const { jobs: curatedJobs, getLocationTag } = await import('../lib/mock-data.ts');
const { getBitgetJobs } = await import('../lib/bitget-jobs.ts');
const { fetchLiveJobs } = await import('../lib/scrapers.ts');

function stableJobId(title, company, applyUrl) {
  const raw = `${company}|${title}|${applyUrl}`.toLowerCase();
  return `scraped-${createHash('sha1').update(raw).digest('hex').slice(0, 12)}`;
}

function toJobFromScraped(scraped, index) {
  const today = new Date().toISOString().slice(0, 10);

  let company = (scraped.company || 'Web3 Team')
    .replace(/Location|Posted|Compensation|Remote|Hybrid|Senior|Mid|Lead|Full Time|Contract/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  const bad = ['Crypto Startup', 'Crypto Company', 'Find a job', 'logo', 'Senior NetSuite'];
  if (
    bad.some((b) => company.toLowerCase().includes(b.toLowerCase())) ||
    company.length < 3 ||
    company.length > 45
  ) {
    company = scraped.source.split(' ')[0] || 'Web3 Company';
  }

  const liveLocTag = getLocationTag(scraped.location || 'Remote');
  const liveTags = ['Scraped', ...(liveLocTag !== 'Remote' ? [liveLocTag] : [])];

  let ecosystem = 'Multi-chain';
  const srcLower = (scraped.source || '').toLowerCase();
  if (srcLower.includes('monad') || srcLower.includes('eco-jobs')) ecosystem = 'Monad';
  else if (srcLower.includes('solana')) ecosystem = 'Solana';
  else if (srcLower.includes('avax') || srcLower.includes('avalanche')) ecosystem = 'Avalanche';
  else if (srcLower.includes('ethereum')) ecosystem = 'Ethereum';

  const category =
    scraped.title.toLowerCase().includes('engineer') ||
    scraped.title.toLowerCase().includes('developer')
      ? 'Engineering'
      : 'Engineering';

  return {
    id: stableJobId(scraped.title, company, scraped.applyUrl),
    title: scraped.title,
    company,
    source: scraped.source,
    source_url: scraped.applyUrl.includes('lever.co')
      ? 'https://jobs.lever.co'
      : scraped.applyUrl.split('/').slice(0, 3).join('/'),
    apply_url: scraped.applyUrl,
    location: scraped.location || 'Remote',
    remote: true,
    work_mode: 'Remote',
    employment_type: 'Full-time',
    category,
    seniority: 'Mid',
    description: `Opportunity from ${scraped.source}. See the original posting for full details and compensation.`,
    requirements: [],
    responsibilities: [],
    nice_to_have: [],
    tags: liveTags,
    ecosystem,
    company_type: 'Startup',
    date_posted: today,
    date_added: new Date().toISOString(),
    featured: false,
    expired: false,
  };
}

function dedupeByTitleCompany(existing, incoming) {
  const keys = new Set(
    existing.map((j) => (j.company + '|' + j.title).toLowerCase().slice(0, 55))
  );
  const added = [];
  for (const j of incoming) {
    const k = (j.company + '|' + j.title).toLowerCase().slice(0, 55);
    if (!keys.has(k)) {
      keys.add(k);
      added.push(j);
    }
  }
  return added;
}

console.log('=== care3r — Building static jobs snapshot ===\n');

const start = Date.now();
const scrapedAt = new Date().toISOString();

console.log('1/3 Loading curated + Bitget jobs...');
const bitgetJobs = getBitgetJobs();
let result = curatedJobs.filter((j) => !j.expired);
const bitgetFresh = dedupeByTitleCompany(result, bitgetJobs);
result = [...bitgetFresh, ...result];
console.log(`   Curated + Bitget: ${result.length} jobs`);

console.log('\n2/3 Scraping external sources (offline, may take 1–2 min)...');
let liveJobs = [];
try {
  const scraped = await fetchLiveJobs();
  const good = scraped.filter(
    (s) => s.title.length > 6 && !/post job|work when|search jobs/i.test(s.title)
  );
  liveJobs = good.map((s, i) => toJobFromScraped(s, i));
  console.log(`   Scraped: ${liveJobs.length} jobs`);
} catch (err) {
  console.warn('   Scrape failed:', err.message);
}

console.log('\n3/3 Merging and writing snapshot...');
const liveFresh = dedupeByTitleCompany(result, liveJobs);
result = [...liveFresh, ...result];

const output = {
  scrapedAt,
  count: result.length,
  bitgetImported: bitgetJobs.length,
  liveMerged: liveFresh.length,
  jobs: result,
};

writeFileSync('data/jobs-feed.json', JSON.stringify(output, null, 2));

console.log(`\nDone in ${Date.now() - start}ms`);
console.log(`Total jobs: ${result.length}`);
console.log(`  Bitget: ${bitgetJobs.length}`);
console.log(`  Live scraped: ${liveFresh.length}`);
console.log(`  Curated base: ${curatedJobs.filter((j) => !j.expired).length}`);
console.log('\nSaved to data/jobs-feed.json');