import { scrapeGetroBoard } from './lib/scrapers.ts';  

console.log('Testing jobs.solana.com via improved Getro scraper...');
console.log('Requesting up to 300 jobs...\n');

scrapeGetroBoard('https://jobs.solana.com/jobs', 'Solana Jobs', 300)
  .then(jobs => {
    console.log(`\n✅ Total scraped from Solana: ${jobs.length}`);
    console.log('Sample job 1:', jobs[0]);
    if (jobs[1]) console.log('Sample job 2:', jobs[1]);
    if (jobs.length > 10) console.log(`... and ${jobs.length - 2} more`);
    
    if (jobs.length < 50) {
      console.log('\nNote: The board is heavily JavaScript rendered.');
      console.log('Only the first ~15-25 jobs are present in the initial HTML.');
      console.log('For the full ~364 you need a headless browser (Playwright/Puppeteer) or the internal search API.');
    }
  })
  .catch(e => console.error('Error:', e.message));  
