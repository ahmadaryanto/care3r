/**
 * Bitget MokaHR scraper — discovers API + extracts all jobs
 * Usage: node scrape-bitget.mjs
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const TARGET = 'https://hire-r1.mokahr.com/social-recruitment/bitget/100000079#/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  const apiCalls = [];
  page.on('response', async (res) => {
    const url = res.url();
    const ct = res.headers()['content-type'] || '';
    if (
      (url.includes('mokahr') || url.includes('bitget')) &&
      (ct.includes('json') || url.includes('/api/') || url.includes('job'))
    ) {
      try {
        const body = await res.text();
        apiCalls.push({ url, status: res.status(), body: body.slice(0, 50000) });
      } catch {
        /* ignore */
      }
    }
  });

  console.log('Loading page...');
  await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(5000);

  // Scroll to load lazy content
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, 1200));
    await page.waitForTimeout(800);
  }

  console.log('\n=== API calls captured ===');
  apiCalls.forEach((c, i) => {
    console.log(`\n[${i + 1}] ${c.status} ${c.url}`);
    console.log(c.body.slice(0, 400));
  });

  // Extract visible job cards from DOM
  const domJobs = await page.evaluate(() => {
    const results = [];
    const seen = new Set();

    const selectors = [
      '[class*="job"]',
      '[class*="position"]',
      '[class*="posting"]',
      'a[href*="job"]',
      'li',
      '.list-item',
    ];

    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        const titleEl =
          el.querySelector('h1,h2,h3,h4,[class*="title"],[class*="name"]') || el;
        const title = (titleEl.textContent || '').replace(/\s+/g, ' ').trim();
        const link = el.querySelector('a')?.href || el.closest('a')?.href || '';
        const location =
          el.querySelector('[class*="location"],[class*="city"],[class*="place"]')
            ?.textContent || '';
        const dept =
          el.querySelector('[class*="department"],[class*="category"],[class*="type"]')
            ?.textContent || '';

        if (title.length > 5 && title.length < 120 && !seen.has(title + link)) {
          seen.add(title + link);
          results.push({
            title,
            location: location.replace(/\s+/g, ' ').trim(),
            department: dept.replace(/\s+/g, ' ').trim(),
            applyUrl: link,
          });
        }
      });
    }
    return results;
  });

  console.log('\n=== DOM jobs found:', domJobs.length, '===');
  domJobs.slice(0, 15).forEach((j, i) => {
    console.log(`${i + 1}. ${j.title}`);
    if (j.location) console.log(`   Location: ${j.location}`);
    if (j.applyUrl) console.log(`   URL: ${j.applyUrl}`);
  });

  const output = {
    scrapedAt: new Date().toISOString(),
    source: TARGET,
    company: 'Bitget',
    apiCalls: apiCalls.map((c) => ({ url: c.url, status: c.status, preview: c.body.slice(0, 2000) })),
    jobs: domJobs,
  };

  writeFileSync('bitget-jobs-raw.json', JSON.stringify(output, null, 2));
  console.log('\nSaved raw output to bitget-jobs-raw.json');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});