# care3r

Remote Web3 jobs and crypto careers. Curated high-signal opportunities for builders, operators, and crypto-native talent.

Not another noisy aggregator: focused discovery from the best sources across protocols, L2s, funds, infra, consumer crypto, and AI x Crypto.

Live: https://care3r.vercel.app

## Features

**Job board**
- Server-rendered job list with filters, search, sorting, and shareable filtered URLs
- Curated editorial "Drops" (thematic collections)
- Tracked sources with transparency
- SEO: per-page metadata, sitemap, robots, Open Graph images, and `JobPosting` structured data for listings with a full description

**CV Power Score (talent)**
- `/cv` landing, `/submit` CV scan (PDF / DOCX / TXT or pasted text, max 5 MB)
- Rule-based CV Power Score with strengths, gaps, and fixes (`/analysis/[id]`, link-access only)
- Shareable card with a generated preview image (`/card/[id]`)
- Private talent pool: consent required, never public, CV files are read in memory and not stored
- Admin (`/admin`, `/talent`): review, feature, rescore, delete, and match candidates to jobs

## Stack
Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + Upstash Redis + date-fns + Sonner + Cheerio

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000. Locally, talent data is stored in `data/talent-*.json` (gitignored) and the admin area is open.

## Environment variables (Vercel)

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password for `/admin`, `/talent`, and the admin APIs (HTTP Basic auth, any username). Without it, production fails closed. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis (added automatically by the Vercel Marketplace Upstash integration). `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also work. Without Redis, CV submissions return a friendly "not available yet" message. |

Contact email for recruiters and data-removal requests lives in `lib/site.ts`.

## Scripts

```bash
npm run lint           # ESLint (next/core-web-vitals + typescript)
npm run build          # production build
npm run scrape:jobs    # rebuild data/jobs-feed.json from sources
npm run scrape:bitget  # refresh data/bitget-jobs.json
```

## Data
- Job snapshot: `data/jobs-feed.json` (built by `scripts/build-jobs-snapshot.mjs`)
- Curated content: `lib/mock-data.ts` (sources, curated drops, hand-curated jobs)
- Scrapers: `lib/scrapers.ts`, `scripts/scrape-bitget.mjs`

## API
- `GET /api/jobs` (curated list), `?featured=true`, `?live=true` (experimental live merge)
- `POST /api/talent/scan`, `POST /api/talent/submit` (public)
- `/api/talent/admin`, `/api/talent/recommend` (admin password required)
