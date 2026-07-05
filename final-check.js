const http = require('http');

http.get('http://localhost:3000/api/jobs?refresh=1', (r) => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const j = JSON.parse(d);
    console.log('Total jobs now:', j.count);
    console.log('Live added:', j.liveMerged);
    const lives = j.jobs.filter(x => x.id.startsWith('live-')).slice(0,6);
    console.log('Fresh live examples:');
    lives.forEach(x => console.log('  •', x.title, '—', x.company, 'via', x.source));
  });
});
