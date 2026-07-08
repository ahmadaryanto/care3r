const https = require('https');
const cheerio = require('cheerio');

function fetchText(url, isJson = false) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': isJson ? 'application/json' : 'text/html,application/javascript,*/*'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data, url }));
    });
    req.on('error', () => resolve({ status: 0, data: '', url }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ status: 0 }); });
  });
}

(async () => {
  console.log('Discovering data source for https://jobs.solana.com/jobs\n');

  const base = 'https://jobs.solana.com';
  const { data: html } = await fetchText(base + '/jobs');

  const $ = cheerio.load(html);

  // 1. Find all JS bundle URLs
  const jsUrls = new Set();
  $('script[src]').each((_, el) => {
    let src = $(el).attr('src');
    if (src) {
      if (src.startsWith('/')) src = base + src;
      if (src.includes('.js')) jsUrls.add(src);
    }
  });

  // Also look for dynamic imports or __webpack etc hints in HTML
  const jsHints = html.match(/https?:\/\/[^"'\s]+\.js/g) || [];
  jsHints.forEach(u => jsUrls.add(u));

  console.log('Found JS files to inspect:', jsUrls.size);
  Array.from(jsUrls).slice(0, 12).forEach(u => console.log('  ', u));

  // 2. Download and grep key JS bundles for API patterns
  console.log('\n--- Scanning JS bundles for internal API endpoints ---');
  const apiCandidates = new Set();

  for (const jsUrl of Array.from(jsUrls).slice(0, 8)) {   // limit to first few to be polite
    const { data: js } = await fetchText(jsUrl);
    if (!js || js.length < 2000) continue;

    // Common patterns: fetch("/api/..., axios.get, .get("/jobs etc
    const patterns = [
      /["'](\/api\/[^"'\s]{3,60})["']/g,
      /["'](\/search[^"'\s]{3,40})["']/g,
      /["'](\/opportunities[^"'\s]{3,40})["']/g,
      /fetch\(["']([^"']+)["']/g,
      /["']([^"']*jobs[^"']*?)["']/g
    ];

    patterns.forEach(re => {
      let m;
      while ((m = re.exec(js)) !== null) {
        let p = m[1];
        if (p && p.length > 3 && (p.includes('job') || p.includes('api') || p.includes('search') || p.includes('listing'))) {
          if (p.startsWith('/')) p = base + p;
          apiCandidates.add(p);
        }
      }
    });
  }

  console.log('\nDiscovered candidate URLs from bundles:');
  Array.from(apiCandidates).slice(0, 20).forEach(c => console.log(' ', c));

  // 3. Test the most promising candidates + some known Getro patterns
  console.log('\n--- Testing promising endpoints for full job list ---');

  const tests = [
    ...Array.from(apiCandidates).slice(0, 15),
    base + '/api/jobs?per_page=100',
    base + '/api/jobs?page=1&per_page=50',
    base + '/search?per_page=100',
    'https://api.getro.com/v1/boards/solana/jobs',
    base + '/jobs.json',
    base + '/api/search?q=&limit=200'
  ];

  let best = null;

  for (const url of tests) {
    const res = await fetchText(url, true);
    if (res.status !== 200 || !res.data) continue;

    let parsed;
    try { parsed = JSON.parse(res.data); } catch { continue; }

    let jobsArr = null;
    if (Array.isArray(parsed)) jobsArr = parsed;
    else if (parsed.jobs && Array.isArray(parsed.jobs)) jobsArr = parsed.jobs;
    else if (parsed.data && Array.isArray(parsed.data)) jobsArr = parsed.data;
    else if (parsed.results && Array.isArray(parsed.results)) jobsArr = parsed.results;
    else if (parsed.items && Array.isArray(parsed.items)) jobsArr = parsed.items;

    if (jobsArr && jobsArr.length > 10) {
      console.log(`\n*** GOOD HIT: ${url}`);
      console.log(`    Returned ${jobsArr.length} items`);
      if (jobsArr[0]) console.log('    Example keys:', Object.keys(jobsArr[0]).slice(0, 12).join(', '));
      if (jobsArr.length > 50) {
        console.log('    Looks like a real data source with volume!');
        best = { url, jobs: jobsArr };
        break; // take the first really big one
      }
    }
  }

  if (best) {
    console.log('\n=== BEST SOURCE FOUND ===');
    console.log('URL:', best.url);
    console.log('Jobs count from this call:', best.jobs.length);
    console.log('\nFirst job shape (for scraper mapping):');
    console.dir(best.jobs[0], { depth: 2 });
  } else {
    console.log('\nNo high-volume JSON API discovered with simple probes.');
    console.log('Likely options left:');
    console.log('  - Requires cookies / auth headers from initial page load');
    console.log('  - Uses GraphQL');
    console.log('  - Uses a 3rd party service (Algolia, Getro private API)');
    console.log('  - Fully client-side only (needs headless browser)');
  }

  console.log('\nDone.');
})();

async function findAlgoliaConfig() {
  console.log('\n\n=== Looking for Algolia config in Getro bundles ===');
  const base = 'https://cdn.getro.com/assets/_next/static/chunks/';
  const candidates = [
    '230-41781d0b478f4889.js',
    '992-afe744a6a13aa7df.js',
    '225-ef5b3353e225beaf.js',
    '733-05f6a3d213dd56c3.js',
    '0-b58f551cf9c8009b.js',
    'a86620fd-51e6a784ff1c6b53.js'
  ];

  for (const file of candidates) {
    const url = base + file;
    const res = await new Promise(r => {
      https.get(url, {headers: {'User-Agent': 'Mozilla/5.0'}}, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => r(d));
      }).on('error', () => r(''));
    });
    
    if (res.includes('algolia') || res.includes('hitsPerPage') || res.includes('appId')) {
      console.log('Bundle with search:', file);
      
      // Extract possible Algolia keys (public search keys are common)
      const appIdMatch = res.match(/appId["\s:=]+["']([A-Z0-9]{6,})["']/i);
      const keyMatch = res.match(/apiKey["\s:=]+["']([a-f0-9]{20,})["']/i) || res.match(/["']([a-f0-9]{32})["']/);
      const indexMatch = res.match(/indexName["\s:=]+["']([^"']+?)["']/i);
      
      if (appIdMatch) console.log('  Possible appId:', appIdMatch[1]);
      if (keyMatch) console.log('  Possible apiKey:', keyMatch[1]);
      if (indexMatch) console.log('  Possible index:', indexMatch[1]);
      
      // Look for the search client call
      if (res.includes('search')) {
        const searchCalls = res.match(/.{0,80}(search|findJobs|loadMore).{0,120}/gi) || [];
        searchCalls.slice(0,3).forEach(s => console.log('  Call pattern:', s.replace(/\s+/g,' ').slice(0,140)));
      }
    }
  }
  console.log('Algolia scan done.');
}

findAlgoliaConfig().catch(console.error);
