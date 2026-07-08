const https = require('https');

const bundles = [
  'https://cdn.getro.com/assets/_next/static/chunks/230-41781d0b478f4889.js',
  'https://cdn.getro.com/assets/_next/static/chunks/992-afe744a6a13aa7df.js'
];

function download(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    }).on('error', () => resolve(''));
  });
}

(async () => {
  for (const url of bundles) {
    console.log('Downloading', url.split('/').pop());
    const js = await download(url);
    
    // Look for algolia related config
    if (js.match(/algolia|ALGOLIA/i)) {
      console.log('  Contains algolia references');
    }
    
    const appId = js.match(/"appId"\s*:\s*"([A-Z0-9]+)"/i) || js.match(/appId:\s*["']([A-Z0-9]{6,})/i);
    const searchKey = js.match(/"apiKey"\s*:\s*"([a-f0-9]{20,})"/i) || js.match(/apiKey:\s*["']([a-f0-9]{20,})/);
    const index = js.match(/"indexName"\s*:\s*"([^"]*jobs[^"]*)"/i) || js.match(/indexName:\s*["']([^"']*jobs[^"']*)/i);
    
    if (appId) console.log('  appId found:', appId[1]);
    if (searchKey) console.log('  search apiKey found:', searchKey[1]);
    if (index) console.log('  indexName:', index[1]);
    
    // Look for the search host
    const host = js.match(/https?:\/\/[a-z0-9-]+\.algolia(net)?\.(net|io)/i);
    if (host) console.log('  algolia host:', host[0]);
  }
  console.log('Finished search for Algolia credentials.');
})();
