import { chromium } from 'playwright';

const TARGET = 'https://hire-r1.mokahr.com/social-recruitment/bitget/100000079#/jobs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const calls = new Map();
page.on('response', async (res) => {
  const url = res.url();
  if (!url.includes('mokahr.com/api/')) return;
  try {
    const body = await res.text();
    calls.set(url.split('?')[0], { method: res.request().method(), status: res.status(), body });
  } catch {}
});

await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(3000);

for (let i = 0; i < 15; i++) {
  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(600);
}

// click first job if possible
const firstJob = page.locator('[class*="job"], a[href*="job"]').first();
if (await firstJob.count()) {
  await firstJob.click().catch(() => {});
  await page.waitForTimeout(3000);
}

for (const [url, info] of calls) {
  console.log('\n===', info.method, url, info.status, '===');
  console.log(info.body.slice(0, 800));
}

await browser.close();