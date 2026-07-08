/**
 * Scrapers & Data Pipeline (Future-Proof Layer)
 *
 * Current state: High-signal curated static data (see mock-data.ts).
 * Many source sites are JavaScript-heavy (Getro boards, modern Next sites),
 * anti-bot protected, or require login. Pure client-side scraping is unreliable.
 *
 * Recommended long-term approaches:
 * 1. RSS feeds (cryptojobslist.com has one: https://api.cryptojobslist.com/rss.xml)
 * 2. Company career pages using Lever / Ashby / Greenhouse (easy to parse)
 * 3. Server-side scraping with Cheerio for simpler HTML boards
 * 4. Manual curation + simple import form for high-signal roles
 * 5. Headless browser (Playwright) only for critical sources if self-hosted
 *
 * This file contains example scrapers you can run in a Node script or API route.
 */

import * as cheerio from 'cheerio';

export interface ScrapedJob {
  title: string;
  company: string;
  location?: string;
  applyUrl: string;
  source: string;
}

function isRealJob(title: string): boolean {
  const t = title.toLowerCase().trim();
  if (!title || title.length < 6) return false;
  if (t.includes('propose') || t.includes("don't see") || t.includes('apply here') || t.includes('talent collective') || t.includes('post a job') || t.includes('submit a job') || t.includes('work when you want')) return false;
  if (t.includes('powered by') || t === 'dragonfly' || t.includes('find great') || t.includes('search jobs')) return false;
  if (t.includes('logo') || t.includes('click here')) return false;
  return true;
}

// Example: Basic cheerio scraper for a simple listing page
// (Most real boards are more complex)
export async function scrapeSimpleBoard(url: string, sourceName: string): Promise<ScrapedJob[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; care3rBot/1.0)' }
    });
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Much broader selectors for modern job boards (cards, tables, lists)
    const selectors = [
      'a[href*="job"]', 
      'a[href*="/jobs/"]',
      'a[href*="/career"]',
      '.job', 
      '.listing', 
      '.job-listing',
      'h2 a, h3 a, h4 a', 
      '.job-title a', 
      '[class*="job"] a',
      'article a',
      'li a[href*="job"]'
    ];

    $(selectors.join(', ')).each((_, el) => {
      let title = $(el).text().trim();
      let link = $(el).attr('href') || $(el).find('a').attr('href') || '';

      // Look in parent for better title if current text is weak
      if (title.length < 6 || title.toLowerCase().includes('apply') || title.toLowerCase().includes('view')) {
        const parent = $(el).closest('li, article, div, .job, .card, tr');
        title = parent.find('h1, h2, h3, h4, .title, [class*="title"], strong').first().text().trim() || title;
      }

      title = title.replace(/\s+/g, ' ').trim();

      if (!title || title.length < 6 || !isRealJob(title)) return;

      if (!link) {
        // Try to find a link in the same container
        link = $(el).closest('li, article, div').find('a').first().attr('href') || '';
      }

      if (!link || link.includes('javascript')) return;

      const fullUrl = link.startsWith('http') ? link : new URL(link, url).toString();

      // Better company extraction
      const container = $(el).closest('li, article, div, tr, .job');
      let company = container.find('.company, .org, [class*="company"], .employer, strong').first().text().trim();

      if (!company || company.length < 2) {
        // Fallback: look for text that looks like a company near the title
        const nearbyText = container.text().replace(title, '').replace(/\s+/g, ' ').trim();
        const companyMatch = nearbyText.match(/([A-Z][A-Za-z0-9 .&'-]{2,40})/);
        company = companyMatch ? companyMatch[1].trim() : sourceName;
      }

      // Clean company name
      company = company
        .replace(/Location|Posted|Compensation|Remote|Hybrid|Full Time|Senior|Mid|Lead|Contract|Engineer|Developer/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 50);

      if (company.length < 2) company = sourceName;

      jobs.push({
        title: title.substring(0, 120),
        company,
        applyUrl: fullUrl,
        source: sourceName
      });
    });

    // Dedupe by title
    const seen = new Set<string>();
    const unique = jobs.filter(j => {
      const k = j.title.toLowerCase().slice(0, 35);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    return unique.slice(0, 20);
  } catch {
    return [];
  }
}

// Example for cryptojobslist RSS (best for automation)
export async function fetchCryptoJobsListRSS(): Promise<ScrapedJob[]> {
  try {
    const res = await fetch('https://api.cryptojobslist.com/rss.xml', {
      headers: { 'User-Agent': 'care3r/1.0 (+https://care3r.com)' }
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });

    const jobs: ScrapedJob[] = [];
    $('item').each((_, el) => {
      const title = $(el).find('title').text().trim();
      const link = $(el).find('link').text().trim() || $(el).find('guid').text().trim();
      // CryptoJobsList RSS typically puts "Company — Role" or similar in title
      let company = '';
      let role = title;
      if (title.includes(' — ')) {
        [company, role] = title.split(' — ').map(s => s.trim());
      } else if (title.includes(' at ')) {
        const parts = title.split(' at ');
        role = parts[0].trim();
        company = parts[1]?.trim() || '';
      }
      if (role && link && isRealJob(role)) {
        jobs.push({
          title: role,
          company: company || 'CryptoJobsList',
          applyUrl: link,
          source: 'cryptojobslist.com'
        });
      }
    });
    return jobs.slice(0, 30);
  } catch {
    return [];
  }
}

// Lever example (very common for protocols) - reliable server-rendered HTML
export async function scrapeLeverBoard(leverSlug: string, companyFallback: string = 'Protocol'): Promise<ScrapedJob[]> {
  const url = `https://jobs.lever.co/${leverSlug}`;
  try {
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; care3rBot/1.0; +https://care3r.com)' 
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Lever structure: usually .posting or direct links + titles near them
    // Common pattern: h5 or links containing the job path
    $('a[href*="/' + leverSlug + '/"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      let title = $(el).text().trim();

      // If the link text is just "Apply", look in parent for the real title
      if (!title || title.toLowerCase() === 'apply' || title.length < 3) {
        const parent = $(el).closest('.posting, li, div, article');
        title = parent.find('h5, h4, .posting-name, .title, [data-qa*="title"]').first().text().trim() || 
                parent.text().split('\n').map(s => s.trim()).find(s => s.length > 4 && !/apply|remote|usa|hybrid/i.test(s)) || '';
      }

      // Clean title - strip location junk that sometimes gets concatenated
      title = title.replace(/\s+/g, ' ').replace(/(Remote|Hybrid|On-site|USA|Europe|Remote —).*$/i, '').trim();

      if (isRealJob(title) && href && title.length > 3 && !title.toLowerCase().includes('powered by lever')) {
        const fullUrl = href.startsWith('http') ? href : `https://jobs.lever.co${href}`;
        jobs.push({
          title,
          company: companyFallback,
          applyUrl: fullUrl,
          source: `lever.co/${leverSlug}`
        });
      }
    });

    // Fallback: scan for common Lever title elements
    if (jobs.length === 0) {
      $('.posting, [data-qa="posting"], h5 a, .job-title a').each((_, el) => {
        const linkEl = $(el).is('a') ? $(el) : $(el).find('a').first();
        const href = linkEl.attr('href') || '';
        let title = linkEl.text().trim() || $(el).text().trim();
        title = title.replace(/\s+/g, ' ').trim();
        if (isRealJob(title) && href.includes(leverSlug)) {
          const full = href.startsWith('http') ? href : new URL(href, 'https://jobs.lever.co').toString();
          jobs.push({ title, company: companyFallback, applyUrl: full, source: `lever.co/${leverSlug}` });
        }
      });
    }

    // Dedupe by title
    const seen = new Set<string>();
    return jobs.filter(j => {
      const key = j.title.toLowerCase().slice(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 15);
  } catch {
    return [];
  }
}

// Usage in an API route (future):
// export async function GET() {
//   const fresh = await scrapeSimpleBoard('https://jobs.solana.com/jobs', 'Solana Jobs');
//   return Response.json({ jobs: fresh });
// }

/**
 * Main live enrichment function.
 * Runs several lightweight scrapers in parallel for local dev "live" experience.
 * Returns a flat list of freshly scraped jobs (normalized).
 */
export async function fetchLiveJobs(): Promise<ScrapedJob[]> {
  const sources = [
    // User's requested sources for live job scraping
    // Passing higher maxResults for boards that have lots of listings (e.g. Solana has 300+)
    () => scrapeGetroBoard('https://jobs.solana.com/jobs', 'Solana Jobs', 300),
    () => scrapeGetroBoard('https://jobs.avax.network/jobs', 'Avalanche Jobs', 150),
    () => scrapeGetroBoard('https://eco-jobs.monad.xyz/jobs', 'Monad Eco Jobs', 100),
    () => scrapeEthereumJobBoard(),
    () => scrapeWeb3Career(),
    () => fetchCryptoJobsListRSS(),
    () => scrapeCryptocurrencyJobsCo(),
    () => scrapeMidnightCareers(),
    () => scrapeDragonflyJobs(),
    () => scrapeBlockCareers(),
    () => scrapeCryptoCareers(),
    () => scrapeBeInCrypto(),
    () => scrapeJobstash(),
    () => scrapeRemote3(),
    // Additional Perle (Rippling) source
    () => scrapePerleRippling(),
  ];

  const results = await Promise.allSettled(sources.map(fn => fn()));

  const all: ScrapedJob[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
      all.push(...r.value);
    }
  }

  // Strict dedupe + filter
  const seen = new Set<string>();
  const unique = all
    .filter(j => isRealJob(j.title) && j.applyUrl && j.applyUrl.startsWith('http'))
    .filter(j => {
      const key = (j.company + '|' + j.title).toLowerCase().slice(0, 55);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  // Return a healthy volume. For high-signal boards like Solana you can get 100+ from live.
  return unique.slice(0, 250);
}

// --- Specific robust scrapers for the requested sources ---

export async function scrapeGetroBoard(url: string, sourceName: string, maxResults: number = 200): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];
  const seen = new Set<string>();

  // Try the main page + several pagination / search param variations.
  // Getro boards are JS-heavy; server HTML usually only contains a subset.
  // We try common patterns that sometimes return richer SSR or different slices.
  const pageUrls = [
    url,
    url.includes('?') ? `${url}&page=1&per_page=100` : `${url}?page=1&per_page=100`,
    url.includes('?') ? `${url}&page=2&per_page=50` : `${url}?page=2&per_page=50`,
    url.includes('?') ? `${url}&page=3` : `${url}?page=3`,
    url.includes('?') ? `${url}&q=&per_page=50` : `${url}?q=&per_page=50`,
  ];

  for (const pageUrl of pageUrls) {
    try {
      const res = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      if (!res.ok) continue;

      const html = await res.text();
      const $ = cheerio.load(html);

      // Primary Getro selector + broader fallbacks
      const selectors = [
        'a[href*="/jobs/"]',
        'a[href*="/job/"]',
        '[class*="job"] a[href]',
        'h3 a, h2 a, .title a'
      ];

      $(selectors.join(', ')).each((_, el) => {
        const $el = $(el);
        let href = $el.attr('href') || '';
        let title = $el.text().trim().replace(/\s+/g, ' ');

        // Only accept real individual job postings (must have /jobs/<id>-slug pattern)
        if (!/\/jobs\/[^/]*\d/.test(href)) return;

        // If the link text is weak, look for better title in ancestors
        if (title.length < 8 || !isRealJob(title)) {
          const container = $el.closest('div, li, article, [class*="job"], tr');
          title = container.find('h1, h2, h3, h4, [class*="title"], strong').first().text().trim().replace(/\s+/g, ' ') || title;
        }

        if (!href || !isRealJob(title) || title.length < 6) return;

        // Resolve full URL and clean hash
        let fullUrl = href.startsWith('http') ? href : new URL(href, url).toString();
        fullUrl = fullUrl.split('#')[0];

        const container = $el.closest('div, li, article, [class*="job"], tr, [class*="info"]');

        // === Smart title / company split ===
        // Container text is usually: "Full TitleCompanyNameLocation: CityPosted: ..."
        let fullText = container.text().replace(/\s+/g, ' ').trim();

        // Remove the title we already have from the front
        let rest = fullText.replace(title, '').trim();

        // Cut off at known separators
        const cutIndex = rest.search(/Location:|Posted:|Compensation|Remote|Hybrid|Full[- ]?Time|Senior|Mid|Lead|Contract|\+ \d+ more/i);
        if (cutIndex > 0) rest = rest.slice(0, cutIndex).trim();

        // Company is usually the first capitalized token(s) after title
        let company = '';
        const companyMatch = rest.match(/^([A-Z][A-Za-z0-9.&' -]{1,42})/);
        if (companyMatch) company = companyMatch[1].trim();

        if (!company || company.length < 2 || company.length > 45 || company.toLowerCase() === title.toLowerCase().slice(0, company.length)) {
          // Fallbacks
          company = container.find('a[href*="/companies/"]').first().text().trim() ||
                    container.find('img[alt]').attr('alt') || '';
        }

        company = company
          .replace(/Location|Posted|Compensation|Remote|Hybrid|Full Time|Senior|Mid|Lead/gi, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 50);

        // Extract location if present
        let location = '';
        const locMatch = fullText.match(/Location:\s*([^P]+?)(Posted|Compensation|Remote|$)/i);
        if (locMatch) location = locMatch[1].trim().replace(/;+$/, '').trim();

        // Final quality filters
        if (!company || company.length < 2) company = sourceName.replace(' Jobs', '');
        if (title.toLowerCase() === company.toLowerCase()) return; // skip pure company pages

        const key = (title + '|' + company).toLowerCase().slice(0, 40);
        if (seen.has(key)) return;
        seen.add(key);

        jobs.push({
          title: title.substring(0, 120),
          company,
          location: location || undefined,
          applyUrl: fullUrl,
          source: sourceName
        });

        if (jobs.length >= maxResults) return false; // stop early
      });

      if (jobs.length >= maxResults) break;
    } catch {
      // continue to next page attempt
    }
  }

  return jobs;
}

async function scrapeEthereumJobBoard(): Promise<ScrapedJob[]> {
  const url = 'https://www.ethereumjobboard.com/jobs';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('a[href^="/jobs/"]').each((_, el) => {
      const href = $(el).attr('href')!;
      const title = $(el).text().trim();
      if (!isRealJob(title)) return;

      const container = $(el).closest('li, article, div, section');
      const company = container.find('a[href^="/company/"]').first().text().trim() || 
                      container.text().match(/([A-Z][a-zA-Z.& ]{2,25})/)?.[0] || 'Ethereum Project';
      const location = container.text().match(/(Remote|Hybrid|On-site|New York|London|Singapore|Europe)[^, ]*/i)?.[0] || 'Remote';

      jobs.push({
        title,
        company: company.trim(),
        location,
        applyUrl: new URL(href, url).toString(),
        source: 'ethereumjobboard.com'
      });
    });
    return jobs.slice(0, 15);
  } catch { return []; }
}

async function scrapeWeb3Career(): Promise<ScrapedJob[]> {
  const url = 'https://web3.career';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; care3rBot/1.0)' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // web3.career uses tables or cards with job titles
    $('a[href*="/jobs/"], a[href*="/job/"], .job-row a, table a').each((_, el) => {
      let title = $(el).text().trim();
      const href = $(el).attr('href') || '';

      if (title.length < 6 || !isRealJob(title)) {
        // try parent for title
        const parent = $(el).closest('tr, li, div');
        title = parent.find('h3, h4, .job-title, strong').first().text().trim() || title;
      }

      title = title.replace(/\s+/g, ' ').trim();
      if (!title || title.length < 6 || !isRealJob(title)) return;

      const container = $(el).closest('tr, li, article, div');
      let company = container.find('.company, [class*="company"], a[href*="/companies"]').first().text().trim();

      if (!company || company.length < 2) {
        const text = container.text();
        const match = text.match(/([A-Z][A-Za-z0-9.& -]{2,35})/);
        company = match ? match[1].trim() : 'Web3 Company';
      }

      const fullUrl = href.startsWith('http') ? href : new URL(href, url).toString();

      jobs.push({
        title: title.substring(0, 120),
        company: company.substring(0, 50),
        applyUrl: fullUrl,
        source: 'web3.career'
      });
    });

    const seen = new Set();
    return jobs.filter(j => {
      const k = j.title.toLowerCase().slice(0, 30);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 18);
  } catch { return []; }
}

async function scrapeCryptoJobsList(): Promise<ScrapedJob[]> {
  const url = 'https://cryptojobslist.com';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Table or list based
    $('a[href^="/jobs/"]').each((_, el) => {
      const href = $(el).attr('href')!;
      const title = $(el).text().trim();
      if (!isRealJob(title) || title.length < 5) return;

      const container = $(el).closest('tr, li, div');
      const company = container.find('a[href^="/companies/"]').first().text().trim() || 'Crypto Company';
      jobs.push({ title, company, applyUrl: new URL(href, url).toString(), source: 'cryptojobslist.com' });
    });
    return jobs.slice(0, 12);
  } catch { return []; }
}

async function scrapeCryptocurrencyJobsCo(): Promise<ScrapedJob[]> {
  const url = 'https://cryptocurrencyjobs.co';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; care3rBot/1.0)' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Target job cards / listings
    $('li, article, .job, [class*="job"]').each((_, c) => {
      const $c = $(c);
      let title = $c.find('h2, h3, .title').first().text().trim();
      if (!title) title = $c.find('a').first().text().trim();

      if (!isRealJob(title) || title.length < 6) return;

      const linkEl = $c.find('a[href*="/"]').first();
      let link = linkEl.attr('href') || '';
      if (!link) link = $c.find('a').attr('href') || '';

      let company = $c.find('img[alt]').attr('alt') || 
                    $c.find('.company, strong, [class*="company"]').first().text().trim();

      if (!company || company.length < 2) {
        const parts = $c.text().split('\n').map(s => s.trim()).filter(Boolean);
        company = parts.find(p => p.length > 2 && p.length < 35 && !/remote|full|part|contract|senior|engineer/i.test(p)) || 'Crypto Co';
      }

      if (link) {
        const fullUrl = link.startsWith('http') ? link : `https://cryptocurrencyjobs.co${link}`;
        jobs.push({ 
          title: title.substring(0, 120), 
          company: company.substring(0, 50), 
          applyUrl: fullUrl, 
          source: 'cryptocurrencyjobs.co' 
        });
      }
    });

    const seen = new Set();
    return jobs.filter(j => {
      const k = j.title.toLowerCase().slice(0, 30);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 15);
  } catch { return []; }
}

async function scrapeMidnightCareers(): Promise<ScrapedJob[]> {
  return scrapeSimpleBoard('https://midnight.network/careers', 'Midnight Network');
}

async function scrapeDragonflyJobs(): Promise<ScrapedJob[]> {
  return scrapeSimpleBoard('https://jobs.dragonfly.xyz/jobs', 'Dragonfly');
}

async function scrapeBlockCareers(): Promise<ScrapedJob[]> {
  return scrapeSimpleBoard('https://block.xyz/careers/jobs', 'Block');
}

async function scrapeCryptoCareers(): Promise<ScrapedJob[]> {
  return scrapeSimpleBoard('https://crypto-careers.com', 'Crypto Careers');
}

async function scrapeBeInCrypto(): Promise<ScrapedJob[]> {
  return scrapeSimpleBoard('https://beincrypto.com/jobs', 'BeInCrypto Jobs');
}

async function scrapeJobstash(): Promise<ScrapedJob[]> {
  return scrapeSimpleBoard('https://jobstash.xyz/jobs', 'JobStash');
}

async function scrapeRemote3(): Promise<ScrapedJob[]> {
  return scrapeSimpleBoard('https://remote3.co', 'Remote3');
}

// Perle via Rippling
async function scrapePerleRippling(): Promise<ScrapedJob[]> {
  const url = 'https://ats.rippling.com/perle/jobs';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('a[href*="/perle/jobs/"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const title = $(el).text().trim();
      if (!isRealJob(title)) return;

      const container = $(el).closest('div, li');
      const loc = container.text().match(/(Remote|Egypt|India|Argentina|Brazil|Philippines|Spain)[^<]*/i)?.[0]?.trim() || 'Remote';
      jobs.push({
        title,
        company: 'Perle',
        location: loc,
        applyUrl: new URL(href, url).toString(),
        source: 'Perle (Rippling)'
      });
    });
    return jobs.slice(0, 20);
  } catch { return []; }
}

// YZI Talent
async function scrapeYZITalent(): Promise<ScrapedJob[]> {
  const url = 'https://talent.yzilabs.com/';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('a[href*="/jobs/"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const title = $(el).text().trim();
      if (!isRealJob(title) || title.length < 5) return;

      const container = $(el).closest('div');
      const companyText = container.text() || '';
      const company = companyText.split('·')[0]?.trim() || 'YZi Portfolio';
      jobs.push({ title, company, applyUrl: new URL(href, url).toString(), source: 'YZi Talent' });
    });
    return jobs.slice(0, 15);
  } catch { return []; }
}

/**
 * How to improve accuracy over time:
 * - Prioritize sources that publish clean HTML or RSS.
 * - For Getro boards (Solana/Avax): Consider partnering or using their export if available.
 * - Store last-checked timestamps + manual overrides for "featured".
 * - Add a simple /admin or import form that lets you paste new jobs.
 * - Run a scheduled job (Vercel Cron or external) that updates a Supabase table.
 */

/* ============================================================
   HEADLESS SCRAPER (for JS-heavy boards like jobs.solana.com)
   ============================================================ */

let playwright: any = null;

async function getPlaywright() {
  if (playwright) return playwright;
  try {
    // Dynamic import so the app still runs if playwright isn't installed
    playwright = await import('playwright');
    return playwright;
  } catch {
    return null;
  }
}

/**
 * Scrape a Getro-style board using a real browser.
 * This can get the full list (hundreds of jobs) because it executes JS + scrolls.
 */
export async function scrapeGetroBoardHeadless(
  url: string,
  sourceName: string,
  maxResults = 400
): Promise<ScrapedJob[]> {
  const pw = await getPlaywright();
  if (!pw) {
    console.warn('[scraper] Playwright not available — falling back to cheerio (limited results).');
    return scrapeGetroBoard(url, sourceName, 50);
  }

  const jobs: ScrapedJob[] = [];
  const seen = new Set<string>();

  const browser = await pw.chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 2000 }
  });

  try {
    const page = await context.newPage();

    console.log(`[headless] Loading ${url} ...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });

    // Wait for initial jobs to appear
    await page.waitForSelector('a[href*="/jobs/"]', { timeout: 15000 }).catch(() => {});

    // Scroll repeatedly to trigger infinite / virtual loading
    let previousCount = 0;
    for (let i = 0; i < 12; i++) {   // up to ~12 scrolls
      await page.evaluate(() => window.scrollBy(0, 2000));
      await page.waitForTimeout(650); // give the board time to load more

      const currentLinks = await page.$$eval('a[href*="/jobs/"]', (els: any[]) =>
        els.map((e: any) => (e as any).href)
      );

      if (currentLinks.length === previousCount) {
        // no more new items
        break;
      }
      previousCount = currentLinks.length;

      if (currentLinks.length >= maxResults) break;
    }

    // Extract from the final DOM state
    const items = await page.$$eval('a[href*="/jobs/"]', (anchors: any[]) => {
      return anchors.map(a => {
        const href = a.href || a.getAttribute('href') || '';
        let title = (a.textContent || '').trim().replace(/\s+/g, ' ');

        // Walk up to find better title / company context
        let container: any = a.parentElement;
        for (let depth = 0; depth < 4 && container; depth++) {
          const t = container.querySelector('h1,h2,h3,h4,[class*="title"]');
          if (t && t.textContent) {
            title = t.textContent.trim().replace(/\s+/g, ' ');
            break;
          }
          container = container.parentElement;
        }

        // Try to get company
        let company = '';
        if (container) {
          const companyLink = container.querySelector('a[href*="/companies/"]');
          if (companyLink) company = companyLink.textContent?.trim() || '';
          if (!company) {
            const img = container.querySelector('img[alt]');
            if (img) company = img.getAttribute('alt') || '';
          }
        }

        return { title, href, company };
      });
    });

    for (const item of items) {
      if (!item.title || item.title.length < 6 || !isRealJob(item.title)) continue;

      const fullUrl = item.href.startsWith('http') ? item.href : new URL(item.href, url).toString();
      let company = (item.company || sourceName).trim().slice(0, 50);

      const key = (item.title + '|' + company).toLowerCase().slice(0, 45);
      if (seen.has(key)) continue;
      seen.add(key);

      jobs.push({
        title: item.title.substring(0, 120),
        company,
        applyUrl: fullUrl,
        source: sourceName
      });

      if (jobs.length >= maxResults) break;
    }
  } catch (err) {
    console.warn('[headless] Error during scrape:', (err as Error).message);
  } finally {
    await browser.close();
  }

  console.log(`[headless] ${sourceName} → extracted ${jobs.length} jobs`);
  return jobs;
}

// Scraper for cryptocurrencyjobs.co (engineering + others) - returns current listings
export async function scrapeCryptocurrencyJobs(): Promise<ScrapedJob[]> {
  const url = 'https://cryptocurrencyjobs.co/engineering/';
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; care3rBot/1.0)' }
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Better targeting: the site uses h2 for job titles inside list items or articles
    $('li, article').each((_, container) => {
      const $c = $(container);
      const titleEl = $c.find('h2, h3').first();
      const title = titleEl.text().trim();
      if (!title || title.length < 5) return;

      const link = $c.find('a[href*="/engineering/"]').first().attr('href') || 
                   titleEl.find('a').attr('href') || 
                   $c.find('a').first().attr('href');

      // Company extraction - the site usually has the company name near the logo or as a separate element
      let company = $c.find('img[alt]').attr('alt') || 
                    $c.find('strong, .company, [class*="company"]').first().text().trim() || '';
      if (!company) {
        const textParts = $c.text().split('\n').map(t => t.trim()).filter(Boolean);
        // Skip the title (first), look for plausible company name
        for (let i = 1; i < Math.min(textParts.length, 5); i++) {
          const p = textParts[i];
          if (p.length > 2 && p.length < 40 && !/remote|full-time|contract|engineering|defi|staff|senior|lead/i.test(p)) {
            company = p;
            break;
          }
        }
      }
      if (company.toLowerCase().includes('logo')) company = '';

      if (title && link && isRealJob(title)) {
        const full = link.startsWith('http') ? link : `https://cryptocurrencyjobs.co${link}`;
        jobs.push({
          title: title.replace(/\s+/g, ' ').trim(),
          company: company || 'Crypto Startup',
          applyUrl: full,
          source: 'cryptocurrencyjobs.co'
        });
      }
    });

    // Dedupe
    const seen = new Set();
    const unique = jobs.filter(j => {
      const k = j.title.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    return unique.slice(0, 15);
  } catch {
    return [];
  }
}

export const SCRAPING_NOTES = `
Most pages are dynamic. 
Current strategy: High-signal manual curation of real opportunities from the listed sources + live enrichment on local via Lever + other boards.
Apply links point to real postings.
`;
