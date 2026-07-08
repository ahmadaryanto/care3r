const https = require('https');
const cheerio = require('cheerio');

function fetchHtml(u) {
  return new Promise((resolve) => {
    https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

(async () => {
  const base = 'https://jobs.solana.com/jobs';
  console.log('Testing current extraction volume from', base);

  const pagesToTry = [
    base,
    base + '?page=1&per_page=100',
    base + '?page=2&per_page=50',
    base + '?q=',
  ];

  let totalUnique = 0;
  const seen = new Set();

  for (const p of pagesToTry) {
    const html = await fetchHtml(p);
    const $ = cheerio.load(html);
    let pageCount = 0;

    $('a[href*="/jobs/"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const title = $(el).text().trim();
      if (href && title.length > 5) {
        const key = href.split('/').pop();
        if (!seen.has(key)) {
          seen.add(key);
          pageCount++;
          totalUnique++;
        }
      }
    });
    console.log(p, '->', pageCount, 'new jobs (total unique so far:', totalUnique + ')');
  }

  console.log('\nFinal unique job links discovered with static HTML:', totalUnique);
  console.log('Real board claims ~364. Gap is because of client-side rendering.');
})();
