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
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OrpheuzkazeBot/1.0)' }
    });
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Try common patterns for job boards
    const selectors = [
      'a[href*="job"]', 
      '.job', 
      '.listing', 
      'h2 a, h3 a', 
      '.job-title a', 
      '[class*="job"] a'
    ];

    $(selectors.join(', ')).each((_, el) => {
      let title = $(el).text().trim();
      const link = $(el).attr('href') || $(el).find('a').attr('href') || '';

      // If the element itself is not the title link, look around
      if (title.length < 5 || title.toLowerCase().includes('apply')) {
        const parent = $(el).closest('li, article, div, .job');
        title = parent.find('h2, h3, .title, [class*="title"]').first().text().trim() || title;
      }

      title = title.replace(/\s+/g, ' ').trim();

      if (title && link && isRealJob(title) && title.length > 5) {
        const fullUrl = link.startsWith('http') ? link : new URL(link, url).toString();
        // Try to guess company from nearby text or source
        const company = $(el).closest('.job, li, article').find('.company, .org, [class*="company"]').first().text().trim() || sourceName;

        jobs.push({
          title,
          company: company.length > 2 ? company : sourceName,
          applyUrl: fullUrl,
          source: sourceName
        });
      }
    });

    // Dedupe
    const seen = new Set<string>();
    const unique = jobs.filter(j => {
      const k = j.title.toLowerCase().slice(0, 30);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    return unique.slice(0, 15);
  } catch {
    return [];
  }
}

// Example for cryptojobslist RSS (best for automation)
export async function fetchCryptoJobsListRSS(): Promise<ScrapedJob[]> {
  try {
    const res = await fetch('https://api.cryptojobslist.com/rss.xml', {
      headers: { 'User-Agent': 'Orpheuzkaze/1.0 (+https://orpheuzkaze.com)' }
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
        'User-Agent': 'Mozilla/5.0 (compatible; OrpheuzkazeBot/1.0; +https://orpheuzkaze.com)' 
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
    // Getro boards (Solana, Avalanche style - common in original data)
    () => scrapeGetroBoard('https://jobs.solana.com/jobs', 'Solana Jobs'),
    () => scrapeGetroBoard('https://jobs.avax.network/jobs', 'Avalanche Jobs'),

    // Other major sources from the list
    () => scrapeEthereumJobBoard(),
    () => scrapeWeb3Career(),
    () => scrapeCryptoJobsList(),
    () => scrapeCryptocurrencyJobsCo(),
    () => scrapeMidnightCareers(),
    () => scrapeDragonflyJobs(),
    () => scrapeBlockCareers(),
    () => scrapeCryptoCareers(),
    () => scrapeBeInCrypto(),
    () => scrapeJobstash(),
    () => scrapeRemote3(),

    // Perle and YZI as requested
    () => scrapePerleRippling(),
    () => scrapeYZITalent(),

    // Existing reliable ones
    () => scrapeLeverBoard('jito.wtf', 'Jito Labs'),
    () => scrapeLeverBoard('arbitrumfoundation', 'Arbitrum Foundation'),
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

  return unique.slice(0, 80); // allow good volume
}

// --- Specific robust scrapers for the requested sources ---

async function scrapeGetroBoard(url: string, sourceName: string): Promise<ScrapedJob[]> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Orpheuzkaze/1.0)' } });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Getro structure: job title link followed by company link like [Company](/companies/...)
    $('a[href*="/jobs/"]').each((_, el) => {
      const $el = $(el);
      const href = $el.attr('href') || '';
      let title = $el.text().trim().replace(/\s+/g, ' ');

      if (!isRealJob(title) || title.length < 6) return;

      // Company is usually the next sibling link or in nearby text like [Kast](/companies/...)
      const container = $el.closest('div, li, article');
      let company = container.find('a[href*="/companies/"]').first().text().trim();

      if (!company) {
        // fallback to alt on img near it or previous text
        company = container.find('img[alt]').attr('alt') || '';
      }
      if (!company || company.length < 2 || company.toLowerCase() === title.toLowerCase().slice(0, company.length).toLowerCase() || company.length > 40) {
        // Try to find company name in the container text near the title
        let fullText = container.text().replace(title, '').replace(/\s+/g, ' ').trim();
        // Getro pages often have "CompanyLocation" or "Company Posted" glued together
        fullText = fullText.replace(/Location|Posted|Compensation|Remote|Hybrid|Full|Part|Senior|Mid|Lead|Contract/gi, ' $& ').replace(/\s+/g, ' ').trim();
        const match = fullText.match(/([A-Z][a-zA-Z0-9.& -]{2,30})/);
        company = (match ? match[1] : sourceName).trim();
      }

      // Final aggressive clean for Getro-style concatenation
      company = company
        .replace(/Location|Posted|Compensation|Remote|Hybrid|Full Time|Senior|Mid|Lead/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      const fullUrl = href.startsWith('http') ? href : new URL(href, url).toString();

      jobs.push({
        title: title.substring(0, 120),
        company: company.substring(0, 50),
        applyUrl: fullUrl,
        source: sourceName
      });
    });

    // dedupe within source
    const seen = new Set();
    return jobs.filter(j => {
      const k = j.title.toLowerCase().slice(0,30);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 15);
  } catch {
    return [];
  }
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
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('a[href*="/"][href*="-"]').each((_, el) => {  // typical job slugs
      const href = $(el).attr('href') || '';
      const title = $(el).text().trim();
      if (!title || title.length < 8 || !isRealJob(title)) return;

      const container = $(el).closest('tr, li, div');
      const company = container.find('a[href*="/"]').not(el).first().text().trim() || 'Web3 Company';
      jobs.push({ title, company, applyUrl: new URL(href, url).toString(), source: 'web3.career' });
    });
    return jobs.slice(0, 10);
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
  // Improved version for the main page
  const url = 'https://cryptocurrencyjobs.co';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    $('li, article').each((_, c) => {
      const title = $(c).find('h2, h3').first().text().trim();
      if (!isRealJob(title)) return;
      const linkEl = $(c).find('a[href*="/"]').first();
      const link = linkEl.attr('href') || '';
      const company = $(c).find('img[alt]').attr('alt') || $(c).text().split('\n').map(s=>s.trim()).find(s => s.length > 2 && s.length < 30) || 'Crypto Co';
      if (link) jobs.push({ title, company, applyUrl: new URL(link, url).toString(), source: 'cryptocurrencyjobs.co' });
    });
    return jobs.slice(0, 12);
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

// Scraper for cryptocurrencyjobs.co (engineering + others) - returns current listings
export async function scrapeCryptocurrencyJobs(): Promise<ScrapedJob[]> {
  const url = 'https://cryptocurrencyjobs.co/engineering/';
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OrpheuzkazeBot/1.0)' }
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
