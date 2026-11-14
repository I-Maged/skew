# Oxylabs Scheduler Implementation (Web Scraper API)

## Goal

Replace the Web API (webapi.oxylabs.io) based client with the Oxylabs Web Scraper API (realtime.oxylabs.io + data.oxylabs.io) using Basic Auth, and implement the real Oxylabs Scheduler: create one schedule per active source, process completed runs, deactivate orphan schedules, and wire the Vercel Cron pipeline. Manual scraping continues to work through the same client.

## Skills read

- `.agents/skills/web-scraper-api`
- `.agents/skills/supabase`
- `node_modules/next/dist/docs/` (route handlers, cron)

## Existing code inspected

- `lib/oxylabs/client.ts` — currently uses Web API + Bearer `OXYLABS_API_KEY`; scheduler functions are no-op stubs.
- `lib/oxylabs/parsers.ts` — candidate extraction (unchanged).
- `lib/pipeline/scrape.ts` — shared pipeline (unchanged; uses `scrapeUrl`).
- `app/api/oxylabs/schedules/route.ts`, `app/api/oxylabs/scheduled-results/process/route.ts`, `app/api/cron/pipeline/route.ts` — routes already exist but call stubs.
- `vercel.json` — cron already registered.
- `.env.example`, `AGENTS.md` section 21 env table — use `OXY_WSA_USERNAME`/`OXY_WSA_PASSWORD`.

## Decision (path chosen)

Use Oxylabs Web Scraper API with Basic Auth. This is required because only it provides the Scheduler (`data.oxylabs.io/v1/schedules`), runs with per-job `result_status`, orphan deactivation via `PUT .../state`, and result fetching. The Web API has no scheduler.

## Implementation requirements

### 1. Oxylabs client (`lib/oxylabs/client.ts`, server-only)

- Auth: `Authorization: Basic base64(OXY_WSA_USERNAME:OXY_WSA_PASSWORD)`. Read creds from `OXY_WSA_USERNAME`/`OXY_WSA_PASSWORD`.
- `scrapeUrl(url)`: POST `https://realtime.oxylabs.io/v1/queries` body `{ source: "universal", url }`; return `results[0].content` (HTML string). Throw on non-2xx or missing content.
- `listRemoteSchedules()`: GET `https://data.oxylabs.io/v1/schedules`; read raw text; regex-extract all schedule IDs (strings). Never Number().
- `createSchedule(cron, items, endTime)`: POST `https://data.oxylabs.io/v1/schedules` body `{ cron_expression, items, end_time }` (or whatever the live docs specify — verify against `https://developers.oxylabs.io/products/web-scraper-api/features/scheduler` first). Read raw response text; regex-extract `schedule_id` as a string. Return `{ scheduleId, active, itemsCount, cron, endTime, nextRunAt }`.
- `getRuns(scheduleId)`: GET `https://data.oxylabs.io/v1/schedules/{id}/runs`; parse JSON (IDs already extracted as strings); return runs with jobs and `resultStatus`.
- `deactivateSchedule(scheduleId)`: PUT `https://data.oxylabs.io/v1/schedules/{id}/state` body `{ active: false }`.
- `fetchJobResult(jobId)`: fetch result HTML for a done job (per live docs — likely `GET https://data.oxylabs.io/v1/queries/{jobId}/results` or the result URL from the run). Return HTML string.
- All IDs handled as strings. Never `Number()` or `JSON.parse` before extracting IDs from raw text.

### 2. Sync route `POST /api/oxylabs/schedules`

- Admin secret required.
- Load active sources.
- For each source: `createSchedule("0 * * * *", [{ source: "universal", url: source.listingUrl }], far-future end time)`, upsert row in `oxylabs_schedules`.
- Orphan deactivation: `listRemoteSchedules()`, compare to stored IDs, `deactivateSchedule` for any not in DB.
- Return `{ created, orphansDeactivated }`.

### 3. Process route `POST /api/oxylabs/scheduled-results/process`

- Admin secret required.
- For each stored schedule: `getRuns(remoteId)`, for each run's jobs with `resultStatus === 'done'`, `fetchJobResult(job.id)` → collect HTMLs.
- Feed collected HTMLs into `runScrapePipeline` via `homepageHtmlProvider` (reuse existing logic, one HTML per candidate scrape attempt).
- Return `{ processed: [{ scheduleId, runs, inserted }] }`.

### 4. Cron route `GET /api/cron/pipeline` (already exists)

- Protect with `CRON_SECRET` (skip in local dev). Already implemented.
- Step 1: process scheduled results (reuse process route logic). Step 2: `runPendingAnalysis()`. If step 1 fails, still run step 2.
- Already implemented; verify it works with real scheduler.

### 5. Env + config

- `.env.example`: keep `OXY_WSA_USERNAME`/`OXY_WSA_PASSWORD` (already there). Remove reliance on `OXYLABS_API_KEY`.
- `AGENTS.md` section 21 env table already lists `OXY_WSA_USERNAME`/`OXY_WSA_PASSWORD`.
- GitHub Actions: already pass `OXY_WSA_USERNAME`/`OXY_WSA_PASSWORD`.

### 6. Types / queries

- `lib/supabase/queries/oxylabs.ts` already has schedule/run CRUD. Verify `upsertStoredSchedule` uses `onConflict: "oxylabs_remote_id"` (already).
- `lib/supabase/types.ts` already has tables.

## Security requirements

- All Oxylabs calls server-only (`import "server-only"`).
- Creds never reach browser. Admin secret via header only. Cron via `CRON_SECRET`.

## Acceptance criteria

- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- `POST /api/scrape` still works (manual path).
- `POST /api/oxylabs/schedules` creates one schedule per active source + deactivates orphans.
- `GET /api/oxylabs/schedules` returns stored rows.
- `POST /api/oxylabs/scheduled-results/process` processes done runs and inserts articles.
- `GET /api/cron/pipeline` runs both steps locally.
- IDs are strings throughout; no precision loss.

## Checks to run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Exact manual test steps

1. Add to `.env.local`: `OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`, `BIASLY_ADMIN_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Remove `OXYLABS_API_KEY`.
2. Ensure active sources in Supabase.
3. `npm run dev`.
4. `curl.exe -X POST http://localhost:3000/api/scrape -H "x-biasly-admin-secret: <secret>" -H "Content-Type: application/json" -d '{"perSourceLimit":3}'` — verify articles inserted.
5. `curl.exe -X POST http://localhost:3000/api/oxylabs/schedules -H "x-biasly-admin-secret: <secret>"` — verify schedules created.
6. `curl.exe http://localhost:3000/api/oxylabs/schedules -H "x-biasly-admin-secret: <secret>"` — verify stored rows.
7. Wait for Oxylabs run to complete (or trigger), then `curl.exe -X POST http://localhost:3000/api/oxylabs/scheduled-results/process -H "x-biasly-admin-secret: <secret>"`.
8. `curl.exe http://localhost:3000/api/cron/pipeline` — verify both steps run.
9. Confirm `vercel.json` cron registered on deploy.

## Notes

Before implementing, fetch the live scheduler docs at `https://developers.oxylabs.io/products/web-scraper-api/features/scheduler` to confirm endpoint paths, request body fields, response field names, and how to fetch job results. The exact request/response shape of the Scheduler API is not in this prompt — verify against live docs.
```

I prepared the implementation prompt at `prompts/oxylabs-scheduler.md`. Is this good to execute?<|end|><|start|>user<|channel|>yes execute it