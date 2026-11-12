# Oxylabs Scraping Pipeline (Manual + Scheduler + Cron)

## Goal

Implement the full Oxylabs scrape-to-insert pipeline for biasly: manual on-demand scraping, Oxylabs Scheduler (hourly homepage scraping), a manual process route for scheduled results, a Vercel Cron route that chains scheduled-result processing then AI analysis, and orphan-schedule deactivation. Reuse one shared pipeline implementation for both manual and scheduler paths. UI displays stored data only; no scraping/analysis from the browser.

## Decision (path chosen)

- Use **Oxylabs Web Scraper API** (`realtime.oxylabs.io` + `data.oxylabs.io`), NOT the Oxylabs Web API (`webapi.oxylabs.io`). Reason: AGENTS.md section 18 requires the Scheduler (hourly, per-source homepage jobs) and orphan deactivation, which only the Web Scraper API provides. The Web API has no scheduler and would be a separate, optional feature.
- Use canonical env var names per AGENTS.md: `OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD` (Basic Auth), `BIASLY_ADMIN_SECRET`. Update `.env.example`. The user must add/rename to the canonical names (see manual test steps).
- AI analysis step in the cron pipeline calls a shared `runPendingAnalysis()` from `lib/pipeline/analyze.ts` if present; otherwise logs and skips. Full AI analysis is a separate prompt (`prompts/ai-analysis.md`).

## Skills read

- `.agents/skills/web-scraper-api`
- `.agents/skills/supabase`
- `.agents/skills/tdd`
- `.agents/skills/ai-sdk` (for the analysis step interface only)
- `node_modules/next/dist/docs/` (route handlers, dynamic params, cron)

## Existing code inspected

- `package.json` (no cheerio/zod/ai-sdk installed)
- `supabase/schema.sql`, `lib/supabase/types.ts`, `lib/supabase/queries/articles.ts`, `lib/supabase/queries/sources.ts`
- `app/api/sources/route.ts`, `app/api/articles/route.ts`
- `.env.local`, `.env.example`
- `AGENTS.md` sections 9-19, 21

## Decisions / assumptions

- Sources are loaded from Supabase; never hardcoded in code. The 4 user-provided homepage URLs are inserted as active sources via SQL (not in code).
- Cheerio and zod are added as dependencies.
- `oxylabs_schedule_runs` stores per-run job metadata; processing uses `/runs` and filters `result_status === 'done'`.
- Large 64-bit IDs (`schedule_id`, job `id`) are read from raw response text via regex before JSON.parse.
- Orphan deactivation runs after sync creates new schedules.
- Vercel Cron fires at minute 15 of every hour (`15 * * * *`).
- Cron route is GET, protected by `CRON_SECRET` (injected by Vercel); skipped in local dev.
- Admin action routes use `x-biasly-admin-secret` header (BIASLY_ADMIN_SECRET).
- Max 5 valid articles per source by default; configurable via request body.
- URL existence check chunks at <= 15 URLs per `.in()`.
- Article content gate: image_url + published_at + meaningful body required.

## Files likely to change / create

- `package.json` (add cheerio, zod)
- `.env.example`
- `lib/oxylabs/client.ts` (new)
- `lib/oxylabs/parsers.ts` (new, source-specific candidate extraction)
- `lib/pipeline/types.ts` (new)
- `lib/pipeline/validate.ts` (new)
- `lib/pipeline/scrape.ts` (new, shared orchestration)
- `lib/supabase/queries/articles.ts` (add existsUrls, insertArticle, listPendingAnalysis)
- `lib/supabase/queries/oxylabs.ts` (new, schedule/run CRUD)
- `app/api/scrape/route.ts` (new)
- `app/api/oxylabs/schedules/route.ts` (new)
- `app/api/oxylabs/scheduled-results/process/route.ts` (new)
- `app/api/cron/pipeline/route.ts` (new)
- `vercel.json` (new)
- `supabase/sources-real.sql` (new, INSERT 4 active sources) — or append to seed; keep separate
- `tests/pipeline/*.spec.ts` (new, TDD)

## Implementation requirements

### 1. Oxylabs client (`lib/oxylabs/client.ts`, server-only)

- `scrapeUrl(url)` -> POST realtime.oxylabs.io/v1/queries `{ source: "universal", url }`, Basic Auth, returns HTML string.
- `listSchedules()` -> GET data.oxylabs.io/v1/schedules (raw text -> regex extract IDs).
- `createSchedule(cron, items, endTime)` -> POST data.oxylabs.io/v1/schedules, return `{ schedule_id (string), ... }` reading raw text.
- `getRuns(scheduleId)` -> GET data.oxylabs.io/v1/schedules/{id}/runs.
- `deactivateSchedule(scheduleId)` -> PUT .../state `{ active: false }`.
- All IDs handled as strings; never Number().

### 2. Candidate extraction (`lib/oxylabs/parsers.ts`)

- `extractCandidateLinks(source, html)` returns string[] of absolute article URLs.
- Generic: parse with cheerio, collect `<a href>` from article/story cards; reject non-article reject list.
- Source-specific strategies for reuters, bbc, cnn, globalnews (URL patterns).
- Normalize to absolute URLs; dedupe.

### 3. Candidate URL filter (`lib/pipeline/scrape.ts`)

- Per-source article URL check (regex/patterns); reject category/section/topic/author/search/show/game/live/product/corporate/newsletter URLs.
- Stricter on uncertainty: reject.

### 4. Shared pipeline (`runScrapePipeline(options)`)

- Input: `{ sources?, perSourceLimit?, homepageHtmlProvider? }`. Default all active sources, 5 per source.
- For each source: get homepage HTML (live fetch for manual; from scheduled results for scheduler), extract candidates, filter, URL-existence check (chunked <=15), scrape detail pages, validate, insert (append-only).
- Run logging: console neat messages + final summary object: status, sourcesChecked, candidatesFound, candidatesRejected, duplicatesSkipped, detailPagesScraped, articlesInserted, articlesRejected, articlesFailed, totalDurationMs, rejectionReasons (grouped counts).
- Return summary object.

### 5. Article validation (`lib/pipeline/validate.ts`)

- Accept only if: article URL, title, one subject, meaningful body, source ref, published date, image URL.
- Body quality: >=3 meaningful paragraphs OR >=900 cleaned chars with title/image/date/URL.
- Clean raw_text: remove scripts/styles/ads/newsletter/related/most-viewed/share/nav/CSS dumps.
- Reject generic/category/show/program/podcast/product/game/live/corporate titles.

### 6. URL existence check + insert (`lib/supabase/queries/articles.ts`)

- `existingUrls(urls[])` chunked <=15, returns Set.
- `insertArticle(article)` append-only, unique url; slug generated from title.
- `listPendingAnalysis()` LEFT JOIN articles->article_analyses where analysis row absent.

### 7. Manual route `POST /api/scrape`

- Header `x-biasly-admin-secret` required (401 if missing/invalid).
- Body optional `{ sourceIds?, perSourceLimit? }`.
- Runs pipeline (live homepage fetch), returns summary.

### 8. Sync route `POST /api/oxylabs/schedules`

- Admin secret required.
- Load active sources; for each create Oxylabs schedule cron `0 * * * *` (top of hour), items `[{ source: "universal", url: homepage }]`, end_time far future.
- Store rows in `oxylabs_schedules`.
- Orphan deactivation: GET all Oxylabs schedule IDs; deactivate any not in DB.
- Return created/updated counts.

### 9. List route `GET /api/oxylabs/schedules`

- Read stored rows.

### 10. Process route `POST /api/oxylabs/scheduled-results/process`

- Admin secret required.
- For each stored schedule: GET /runs, filter jobs result_status === 'done', fetch result HTML (via Oxylabs result endpoint), feed as homepageHtmlProvider into shared pipeline.
- Log per schedule.

### 11. Cron route `GET /api/cron/pipeline`

- Protect with CRON_SECRET (skip check in local dev).
- Step 1: process scheduled results (reuse process logic).
- Step 2: run pending analysis (if module present).
- If step 1 fails, still run step 2.
- Log progress/completion both steps.

### 12. `vercel.json`

- cron: `{ "path": "/api/cron/pipeline", "schedule": "15 * * * *" }`.

### 13. Supabase query module `lib/supabase/queries/oxylabs.ts`

- listSchedules, upsertSchedule, listRuns, insertRun.

## Security requirements

- Service role, Oxylabs creds, OpenAI, secrets server-only; never browser.
- Admin secret via header only; cron via CRON_SECRET.
- No scraping/analysis from client components.

## Acceptance criteria

- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- `POST /api/scrape` with valid secret inserts >=0 valid articles and returns summary.
- `POST /api/oxylabs/schedules` creates one schedule per active source + deactivates orphans.
- `GET /api/oxylabs/schedules` returns stored rows.
- `POST /api/oxylabs/scheduled-results/process` processes done runs.
- `GET /api/cron/pipeline` runs both steps (local dev).
- TDD: unit tests for candidate filter, validation, URL existence chunking, ID string handling, orphan deactivation.

## Checks to run

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run test:e2e` (targeted)

## Exact manual test steps

1. Add to `.env.local`: `OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`, `BIASLY_ADMIN_SECRET` (rename/add from existing `OXYLABS_API_KEY`/`x-SKEW-admin-secret`), and 4 active sources inserted:
   ```sql
   insert into public.sources (name, listing_url, parser_strategy, active) values
   ('Reuters','https://www.reuters.com','reuters',true),
   ('BBC','https://www.bbc.com','bbc',true),
   ('CNN','https://edition.cnn.com','cnn',true),
   ('Global News','https://globalnews.ca','globalnews',true);
   ```
2. `npm install` (cheerio, zod).
3. Run `npm run dev`; watch terminal.
4. `curl -X POST http://localhost:3000/api/scrape -H "x-biasly-admin-secret: <secret>" -H "Content-Type: application/json" -d '{"perSourceLimit":3}'`
5. Verify articles inserted via `/api/articles` and Supabase.
6. `curl -X POST http://localhost:3000/api/oxylabs/schedules -H "x-biasly-admin-secret: <secret>"`
7. `curl http://localhost:3000/api/oxylabs/schedules`
8. `curl -X POST http://localhost:3000/api/oxylabs/scheduled-results/process -H "x-biasly-admin-secret: <secret>"`
9. `curl http://localhost:3000/api/cron/pipeline`
10. Confirm `vercel.json` cron registered on deploy.

## TDD notes

Follow vertical slices: one test -> one impl. Prioritize: candidate URL filter, article validation/cleanup, ID string extraction, orphan deactivation diff, URL existence chunking. Mock the Oxylabs HTTP transport; never hit live Oxylabs in tests.
