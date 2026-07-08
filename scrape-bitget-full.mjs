/**
 * Bitget MokaHR — full job scraper
 *
 * Usage:
 *   node scrape-bitget-full.mjs
 *
 * Output:
 *   data/bitget-jobs.json — all open roles with metadata + descriptions
 */

import { writeFileSync } from 'fs';

const BASE = 'https://hire-r1.mokahr.com';
const BOARD_URL = `${BASE}/social-recruitment/bitget/100000079`;
const ORG_ID = 'bitget';
const SITE_ID = '100000079';
const PAGE_SIZE = 50;

async function mokaPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; care3rBot/1.0)',
      Origin: BASE,
      Referer: BOARD_URL,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${path}`);
  }

  const json = await res.json();
  if (!json.success && json.code !== 0) {
    throw new Error(json.msg || `API error on ${path}`);
  }

  return json.data;
}

function stripHtml(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatLocation(locations = []) {
  if (!locations.length) return 'Remote / Unspecified';
  return locations
    .map((loc) => {
      const parts = [loc.country, loc.province, loc.city, loc.address].filter(Boolean);
      return parts.join(', ');
    })
    .join(' | ');
}

async function fetchAllJobSummaries() {
  const all = [];
  const seen = new Set();

  for (let offset = 0; offset < 500; offset += PAGE_SIZE) {
    const data = await mokaPost('/api/outer/ats-apply/website/jobs/module', {
      orgId: ORG_ID,
      siteId: SITE_ID,
      offset,
      limit: PAGE_SIZE,
    });

    const jobs = data.jobs || [];
    console.log(`Fetched offset ${offset}: ${jobs.length} jobs`);

    for (const job of jobs) {
      if (!seen.has(job.id)) {
        seen.add(job.id);
        all.push(job);
      }
    }

    if (jobs.length < PAGE_SIZE) break;
  }

  return all;
}

async function fetchJobDetail(jobId) {
  const data = await mokaPost('/api/outer/ats-apply/website/job', {
    orgId: ORG_ID,
    siteId: SITE_ID,
    jobId,
  });
  return data;
}

async function main() {
  console.log('=== Bitget MokaHR Full Scrape ===');
  console.log('Source:', BOARD_URL);
  console.log('');

  const start = Date.now();
  const summaries = await fetchAllJobSummaries();
  console.log(`\nTotal unique jobs found: ${summaries.length}`);

  const jobs = [];

  for (let i = 0; i < summaries.length; i++) {
    const summary = summaries[i];
    process.stdout.write(`\rFetching details ${i + 1}/${summaries.length}...`);

    try {
      const detail = await fetchJobDetail(summary.id);
      jobs.push({
        id: detail.id,
        title: detail.title,
        company: 'Bitget',
        status: detail.status,
        department: detail.department?.name || null,
        category: detail.zhineng?.name || null,
        commitment: detail.commitment || null,
        education: detail.education || null,
        experience: {
          min: detail.minExperience ?? null,
          max: detail.maxExperience ?? null,
        },
        location: formatLocation(detail.locations),
        locations: detail.locations || [],
        openedAt: detail.openedAt || null,
        publishedAt: detail.publishedAt || null,
        updatedAt: detail.updatedAt || null,
        descriptionHtml: detail.jobDescription || '',
        descriptionText: stripHtml(detail.jobDescription || ''),
        applyUrl: `${BOARD_URL}#/job/${detail.id}`,
        source: 'mokahr.com/bitget',
        mjCode: detail.mjCode || null,
      });
    } catch (err) {
      console.warn(`\nFailed detail for ${summary.id}: ${err.message}`);
      jobs.push({
        id: summary.id,
        title: summary.title,
        company: 'Bitget',
        status: summary.status,
        applyUrl: `${BOARD_URL}#/job/${summary.id}`,
        source: 'mokahr.com/bitget',
        error: err.message,
      });
    }

    // light throttle
    if (i % 10 === 9) await new Promise((r) => setTimeout(r, 200));
  }

  console.log('\n');

  const output = {
    scrapedAt: new Date().toISOString(),
    sourceUrl: BOARD_URL,
    company: 'Bitget',
    totalJobs: jobs.length,
    jobs,
  };

  writeFileSync('data/bitget-jobs.json', JSON.stringify(output, null, 2));

  const categories = {};
  const departments = {};
  jobs.forEach((j) => {
    if (j.category) categories[j.category] = (categories[j.category] || 0) + 1;
    if (j.department) departments[j.department] = (departments[j.department] || 0) + 1;
  });

  console.log(`Done in ${Date.now() - start}ms`);
  console.log(`Saved ${jobs.length} jobs to data/bitget-jobs.json`);
  console.log('\nTop categories:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .forEach(([name, count]) => console.log(`  ${name}: ${count}`));

  console.log('\nFirst 5 jobs:');
  jobs.slice(0, 5).forEach((j, idx) => {
    console.log(`${idx + 1}. ${j.title}`);
    console.log(`   Category: ${j.category || 'N/A'}`);
    console.log(`   Location: ${j.location || 'N/A'}`);
    console.log(`   URL: ${j.applyUrl}`);
  });
}

main().catch((err) => {
  console.error('Scrape failed:', err);
  process.exit(1);
});