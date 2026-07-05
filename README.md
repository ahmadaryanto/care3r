# orpheuzkaze

Curated high-signal Web3 jobs for builders, operators, and crypto-native talent.

Not another noisy aggregator — focused discovery from the best sources across protocols, L2s, funds, infra, consumer crypto, and AI x Crypto.

## Features
- Premium dark UI with fast filters, search, and sorting
- Shareable filtered job URLs (all filters + search sync to query params)
- Curated editorial "Drops" (thematic collections)
- Tracked sources with transparency
- Experimental live RSS merge (button on /jobs + `?live=true` on API)
- Compensation display where available
- Data pipeline ready (`lib/scrapers.ts` + API)

## Stack
Next.js 16 (App Router) + TypeScript + Tailwind + date-fns + Sonner + Cheerio

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Curation & Data
- Core data: `lib/mock-data.ts` (jobs, sources, curatedDrops)
- To add a job: duplicate a job entry, assign unique `id`, fill `apply_url`, tags, etc. Set `featured` and `curator_note` for signal.
- Compensation, seniority, ecosystem, etc are first-class.
- Live scraping experiments: `fetchCryptoJobsListRSS()` and helpers in scrapers.
- Submit forms are currently demo (toast + reset). Ready to connect email / storage.

## API
- GET `/api/jobs` → curated list
- GET `/api/jobs?live=true` → includes experimental live items
- GET `/api/jobs?featured=true`

## Recent Progress
- URL-driven filters & search on jobs list
- Dynamic homepage stats
- Compensation field + display
- Live RSS demo integration + working parser
- Build clean + full feature pages

## Next Steps Ideas
- Persistent data (JSON files or lightweight DB)
- Real scheduled ingestion + deduping
- Submit-a-specific-role form that outputs ready JSON
- Public RSS feed of curated jobs
- Curator tools / simple admin
- More real scrapers (Lever boards, company pages)

High signal only.

---

## Original Next.js template notes (for reference)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
