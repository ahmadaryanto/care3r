const https = require('https');
const cheerio = require('cheerio');

function get(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

(async () => {
  const html = await get('https://jobs.solana.com/jobs');
  const $ = cheerio.load(html);

  console.log('Total a[href*="/jobs/"]:', $('a[href*="/jobs/"]').length);

  const first = $('a[href*="/jobs/"]').first();
  console.log('\nFirst href:', first.attr('href'));
  console.log('First text:', first.text().trim().slice(0, 100));

  const container = first.closest('div, li, article, [class*="job"]');
  console.log('\nContainer classes:', container.attr('class'));
  console.log('\nContainer text (cleaned):', container.text().replace(/\s+/g, ' ').trim().slice(0, 300));

  // Look for any elements that might contain the total count
  const possibleCounts = [];
  $('*').each((i, el) => {
    const t = $(el).text();
    if (/\d{2,4}\s*(jobs|opportunities)/i.test(t) && t.length < 120) {
      possibleCounts.push(t.trim());
    }
  });
  console.log('\nPossible count texts found:', [...new Set(possibleCounts)].slice(0, 5));

  // Look at the structure around companies
  console.log('\nLooking for /companies/ links near jobs:');
  $('a[href*="/jobs/"]').slice(0, 3).each((i, el) => {
    const c = $(el).closest('div,li,article').find('a[href*="/companies/"]').first();
    console.log('Job:', $(el).text().trim().slice(0,50), '-> Company link text:', c.text().trim() || 'none');
  });
})();
