import { scrapeGetroBoard } from './lib/scrapers.ts';
import fs from 'fs';

console.log('Scraping latest visible jobs from jobs.solana.com (improved parser)...\n');

const jobs = await scrapeGetroBoard('https://jobs.solana.com/jobs', 'Solana Jobs', 50);

fs.writeFileSync('solana-current.json', JSON.stringify(jobs, null, 2));

console.log(`Found ${jobs.length} jobs (saved to solana-current.json)\n`);

jobs.forEach((j, i) => {
  console.log(`${i + 1}. ${j.title}`);
  console.log(`   Company: ${j.company}`);
  if (j.location) console.log(`   Location: ${j.location}`);
  console.log(`   Apply: ${j.applyUrl}\n`);
});

console.log('--- Full cleaned JSON also written to solana-current.json ---');
