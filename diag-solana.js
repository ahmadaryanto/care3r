const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set up network listener BEFORE navigation to catch search calls
  const capturedJobs = [];
  let totalFromApi = 0;

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('search') || url.includes('algolia') || /\/api\//.test(url) || url.includes('jobs')) {
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('json')) {
          const json = await response.json().catch(() => null);
          if (json) {
            // Look for common job result shapes
            let jobsArr = null;
            let reportedTotal = null;

            if (Array.isArray(json)) jobsArr = json;
            else if (json.jobs && Array.isArray(json.jobs)) { jobsArr = json.jobs; reportedTotal = json.total || json.count; }
            else if (json.results && Array.isArray(json.results)) { jobsArr = json.results; reportedTotal = json.total || json.count; }
            else if (json.hits && Array.isArray(json.hits)) { jobsArr = json.hits; reportedTotal = json.nbHits || json.total; }
            else if (json.data && Array.isArray(json.data)) jobsArr = json.data;

            if (jobsArr && jobsArr.length > 0) {
              console.log(`[network] ${url} → ${jobsArr.length} items (reported total: ${reportedTotal || 'unknown'})`);
              if (reportedTotal) totalFromApi = Math.max(totalFromApi, reportedTotal);
              capturedJobs.push(...jobsArr);
            }
          }
        }
      } catch (e) {}
    }
  });

  try {
    await page.goto('https://jobs.solana.com/jobs', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.log('Goto had issue, continuing anyway:', e.message);
  }

  // Give the page a moment to render initial content
  await page.waitForTimeout(2000);

  // Extract any visible count in the UI
  const bodyText = await page.textContent('body').catch(() => '');
  const countMatch = bodyText.match(/(\d[\d,]*)\s*(jobs?|opportunities?|listings?|positions?|roles?)/i);
  console.log('Visible job count text:', countMatch ? countMatch[0] : 'NOT FOUND on page');

  // Count initial DOM links
  let domCount = await page.$$eval('a[href*="/jobs/"]', els => els.length).catch(() => 0);
  console.log('Initial DOM job links:', domCount);

  // Try to trigger loading by scrolling and looking for load more
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 2500)).catch(() => {});
    await page.waitForTimeout(600);

    const newDom = await page.$$eval('a[href*="/jobs/"]', els => els.length).catch(() => domCount);
    if (newDom > domCount) {
      console.log(`DOM grew to ${newDom} after scroll ${i+1}`);
      domCount = newDom;
    }

    // Try clicking any obvious "load more" or "show more"
    const loadMore = await page.$('button:has-text("more"), a:has-text("more"), [class*="load-more"], button:has-text("Load")').catch(() => null);
    if (loadMore) {
      console.log('Clicked a load more button');
      await loadMore.click().catch(() => {});
      await page.waitForTimeout(800);
    }
  }

  const finalDom = await page.$$eval('a[href*="/jobs/"]', els => els.length).catch(() => domCount);
  console.log('Final DOM job links visible:', finalDom);

  // Dedupe captured from network
  const uniqueCaptured = new Set();
  const cleaned = [];
  for (const j of capturedJobs) {
    const title = j.title || j.name || j.position || (typeof j === 'string' ? j : '');
    const company = j.company?.name || j.organization?.name || j.company || '';
    const key = (title + '|' + company).slice(0, 60);
    if (title && !uniqueCaptured.has(key)) {
      uniqueCaptured.add(key);
      cleaned.push({ title, company, url: j.url || j.link || j.apply_url || j.href });
    }
  }

  console.log('\n=== Summary ===');
  console.log('Visible count on page:', countMatch ? countMatch[0] : 'unknown');
  console.log('Jobs captured via network API calls:', cleaned.length);
  if (totalFromApi) console.log('Highest total reported by API:', totalFromApi);
  console.log('Max jobs we could render in DOM:', finalDom);

  if (cleaned.length > 5) {
    console.log('\nSample from captured API data:');
    console.dir(cleaned.slice(0, 3), { depth: 1 });
  }

  await browser.close();
})();

