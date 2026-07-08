/**
 * Full Solana Jobs Scraper (improved)
 *
 * Usage:
 *   node scrape-solana-full.mjs
 *
 * This will attempt to pull as many jobs as possible from https://jobs.solana.com/jobs
 * using multiple page attempts + broader selectors.
 *
 * Note: Because jobs.solana.com is a heavily client-rendered Getro board,
 * pure Node + cheerio scraping typically gets only the first ~20-40 jobs
 * that are present in the initial server HTML.
 *
 * For the complete ~364 jobs you will eventually want one of:
 *   - Playwright / Puppeteer (headless browser that executes JS + scrolls)
 *   - Reverse-engineered Algolia / Getro internal search API call
 *
 * This script outputs the results + a ready-to-use JSON snippet.
 */

import { scrapeGetroBoard, scrapeGetroBoardHeadless } from './lib/scrapers.ts';

const TARGET = 'https://jobs.solana.com/jobs';

console.log('=== care3r — Full Solana Board Scrape ===');
console.log('Target:', TARGET);
console.log('Starting scrape (max 350)...\n');

const start = Date.now();

console.log('Trying headless browser first (best for full 300+ results)...');

scrapeGetroBoardHeadless(TARGET, 'Solana Jobs', 400)
  .then((jobs) => {
    if (!jobs || jobs.length < 30) {
      console.log('Headless returned few results — falling back to cheerio...');
      return scrapeGetroBoard(TARGET, 'Solana Jobs', 350);
    }
    return jobs;
  })
  .then((jobs) => {
    const ms = Date.now() - start;
    console.log(`\n✅ Finished in ${ms}ms`);
    console.log(`Total jobs extracted: ${jobs.length}`);

    if (jobs.length === 0) {
      console.log('No jobs found. The board may have changed structure.');
      return;
    }

    // Show distribution of companies
    const companies = {};
    jobs.forEach(j => {
      companies[j.company] = (companies[j.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    console.log('\nTop companies in scrape:');
    topCompanies.forEach(([name, count]) => console.log(`  ${name}: ${count}`));

    console.log('\n--- First 5 jobs ---');
    jobs.slice(0, 5).forEach((j, i) => {
      console.log(`${i + 1}. ${j.title}`);
      console.log(`   Company: ${j.company}`);
      console.log(`   URL: ${j.applyUrl}\n`);
    });

    if (jobs.length > 30) {
      console.log(`\n... (${jobs.length - 5} more jobs not shown here)`);
    }

    // Output a compact JSON you can save / import
    const json = JSON.stringify(jobs, null, 2);
    console.log('\n=== JSON (first 3 for preview) ===');
    console.log(JSON.stringify(jobs.slice(0, 3), null, 2));

    console.log('\n=== Full JSON length:', json.length, 'chars ===');
    console.log('\nTip: To save all results run:');
    console.log('  node -e "import(\\"./scrape-solana-full.mjs\\").then(()=>{})" > solana-jobs.json   # (or pipe in your terminal)');

    // You can also write it to disk here if desired:
    // import('fs').then(fs => fs.writeFileSync('solana-raw.json', json));
  })
  .catch(err => {
    console.error('Scrape failed:', err);
  });
