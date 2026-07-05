const http = require('http');
http.get('http://localhost:3000/api/jobs?refresh=1', (r) => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const j = JSON.parse(d);
    console.log('Total jobs:', j.count);
    console.log('Live added this refresh:', j.liveMerged);
    const bySrc = {};
    j.jobs.forEach(x => {
      if (x.id && x.id.startsWith('live-')) {
        bySrc[x.source] = (bySrc[x.source] || 0) + 1;
      }
    });
    console.log('\nLive jobs from your listed sources:');
    const listed = ['Solana', 'Avalanche', 'ethereumjobboard', 'web3.career', 'cryptojobslist', 'cryptocurrencyjobs', 'midnight', 'Dragonfly', 'Block', 'crypto-careers', 'beincrypto', 'jobstash', 'remote3', 'Perle', 'YZi'];
    Object.entries(bySrc).forEach(([s, c]) => {
      if (listed.some(l => s.toLowerCase().includes(l.toLowerCase()))) {
        console.log('  ' + s + ': ' + c);
      }
    });
    console.log('\nSample jobs:');
    j.jobs.filter(x => x.id && x.id.startsWith('live-')).slice(0,6).forEach(x => console.log(' - ' + x.title.substring(0,50) + ' @ ' + x.company + ' (' + x.source + ')'));
  });
});
