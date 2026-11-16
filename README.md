# biasly — AI-Powered News Analysis Platform

> **biasly** collects real news articles from configured sources, analyzes them with AI, and surfaces reader-friendly sentiment and framing insights — so readers can see _how_ a story is being framed, not just _what_ it says.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF)](https://clerk.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI-412991?logo=openai)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com/)

---

## Overview

biasly is a production-style, full-stack news analysis platform. It scrapes real articles from configured news sources, runs them through an AI analysis pipeline, stores the results in Supabase, and presents readers with a clean, responsive interface that highlights each article's sentiment and political framing.

Political framing is always shown as **AI-estimated** — never as objective truth — alongside confidence scores, loaded terms, and a disclaimer.

> 🔗 Live demo and repository links coming soon.

---

## Key Features

### Reader Experience

- **Home page** with a responsive news card grid (title, source, image, published date, sentiment, AI-estimated framing label, left/center/right percentages, confidence).
- **News details page** with full article text, bias distribution, AI summary, framing notes, loaded terms, disclaimer, and **Related Articles** powered by pgvector cosine similarity.
- **Dark mode** with theme toggle and auto-detection.
- **Clerk authentication** with protected routes.

### Data Pipeline

- **Oxylabs Web Scraper API** scraping of active sources stored in Supabase (homepage entry pages only).
- **Candidate URL filtering** — source-specific article URL checks reject category, section, show, live, game, and corporate pages before detail scraping.
- **Article validation & cleanup** — requires article-specific title, meaningful body, image URL, and published date; strips scripts, ads, newsletter blocks, and CSS dumps from `raw_text`.
- **Append-only, deduped storage** using original and canonical URLs (no duplicates, no resets during a run).

### Automation

- **Oxylabs Scheduler** creates one hourly schedule per active source.
- **Vercel Cron** fires `/api/cron/pipeline` 15 minutes after the top of each hour.
- The cron chains **scheduled result processing → AI analysis** in sequence, logging both steps.
- **Orphan schedule deactivation** prevents stale Oxylabs schedules from billing after DB rows are recreated.

### AI Analysis

- **Vercel AI SDK + OpenAI** with Zod-validated structured output (summary, sentiment score/label, bias score/label, left/center/right percentages, confidence, framing notes, loaded terms, disclaimer, model name).
- **Embeddings** via `text-embedding-3-small` stored as `vector(1536)` for similarity search.
- **Pending-analysis detection** via `LEFT JOIN` on `article_analyses` — re-runs safely backfill missing analyses _and_ missing embeddings without re-running full analysis.
- Configurable batching (`ANALYSIS_BATCH_SIZE`) with retry-once on invalid output.

### Observability & Security

- **`logs` table** plus neat server-side console summaries for every scrape and analysis run (counts, durations, grouped rejection reasons).
- All secrets are **server-only**; action routes require the `x-biasly-admin-secret` header; the cron route uses Vercel's `CRON_SECRET`.

---

## Architecture

Layers are kept strictly separate:

| Layer        | Responsibility                                                |
| ------------ | ------------------------------------------------------------- |
| **Website**  | Pages, cards, details UI, auth UI — displays stored data only |
| **API**      | Thin route handlers                                           |
| **Database** | Supabase reads/writes                                         |
| **Scraping** | Oxylabs calls + Scheduler integration                         |
| **Parsing**  | Link extraction, cleanup, article validation                  |
| **AI**       | Article analysis + output validation                          |
| **Pipeline** | Scrape/analysis orchestration + log tracking                  |
| **Vector**   | pgvector similarity queries + embedding storage               |

**Scrape-to-insert flow**

1. Load active sources from Supabase.
2. Obtain homepage HTML (live fetch for manual runs; completed Oxylabs job results for scheduled runs).
3. Extract candidate links from visible story cards only.
4. Reject non-article URLs (category, section, show, live, game, corporate, …).
5. Normalize + dedupe candidate URLs; skip URLs already stored (chunked `.in()` queries, max 15 per call).
6. Scrape article detail pages that pass the candidate check.
7. Validate & clean each detail page (image URL + published date + meaningful body required).
8. Insert only valid articles, append-only.
9. Emit run logging summary.

---

## Tech Stack

| Category   | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19, TypeScript 5       |
| Styling    | Tailwind CSS v4, shadcn/ui, lucide-react              |
| Auth       | Clerk (`@clerk/nextjs`)                               |
| Database   | Supabase (Postgres) + pgvector                        |
| Scraping   | Oxylabs Web Scraper API + Scheduler                   |
| Parsing    | Cheerio                                               |
| AI         | Vercel AI SDK, OpenAI provider, Zod                   |
| Embeddings | OpenAI `text-embedding-3-small` (1536-dim)            |
| Automation | Vercel Cron                                           |
| Testing    | Playwright (E2E), TypeScript (`tsc --noEmit`), ESLint |

---

## Data Model

Core tables (see `supabase/schema.sql`):

- **`sources`** — name, listing URL, parser strategy, active flag, optional logo URL.
- **`articles`** — source ref, original URL (unique, used for dedupe), canonical URL, title, slug, image URL, published date, raw text, scraped/analyzed timestamps, category, location, sources count.
- **`article_analyses`** — article ref, summary, sentiment score/label, bias score/label, left/center/right percentages, confidence, framing notes, loaded terms, disclaimer, model name, `embedding vector(1536)`.
- **`logs`** — level, message, metadata JSON, timestamp.
- **`oxylabs_schedules`** — source ref, remote schedule ID, status.
- **`oxylabs_schedule_runs`** — schedule ref, remote run ID, result status, timestamps.

Row-level security is enabled; anon/authenticated roles get read access to sources, articles, and analyses.

---

## API Surface

| Method | Route                                    | Purpose                   | Protection                           |
| ------ | ---------------------------------------- | ------------------------- | ------------------------------------ |
| `GET`  | `/api/sources`                           | List sources              | —                                    |
| `GET`  | `/api/logs`                              | Read logs                 | —                                    |
| `GET`  | `/api/articles`, `/api/articles/[slug]`  | Read articles             | —                                    |
| `POST` | `/api/scrape`                            | Manual scrape run         | `x-biasly-admin-secret`              |
| `POST` | `/api/analyze`                           | AI analysis run           | `x-biasly-admin-secret`              |
| `POST` | `/api/oxylabs/schedules`                 | Sync/create schedules     | `x-biasly-admin-secret`              |
| `GET`  | `/api/oxylabs/schedules`                 | List stored schedules     | `x-biasly-admin-secret`              |
| `GET`  | `/api/oxylabs/runs`                      | List runs                 | `x-biasly-admin-secret`              |
| `POST` | `/api/oxylabs/scheduled-results/process` | Process completed runs    | `x-biasly-admin-secret`              |
| `GET`  | `/api/cron/pipeline`                     | Automated hourly pipeline | `CRON_SECRET` (skipped in local dev) |

---

## Project Structure

```
app/
  page.tsx                    # Home page
  news/[slug]/page.tsx        # News details page
  api/                        # Route handlers (scrape, analyze, oxylabs, cron, …)
components/
  home/                       # Home page UI
  news/ & news-details/       # Article + analysis UI
  ui/                         # shadcn/ui primitives
lib/
  supabase/                   # Client + queries (articles, sources, oxylabs)
  oxylabs/                    # Client + parsers
  pipeline/                   # Scrape + analyze orchestration, validation, types
  ai/                         # OpenAI provider wiring
supabase/
  schema.sql                  # Core schema + pgvector index
  seed.sql
  related-articles.sql        # match_related_articles RPC
prompts/                      # Implementation prompt history
tests/                        # Playwright E2E specs
```

---

## Getting Started

### Prerequisites

- Node.js 20+, npm
- A Supabase project (with the `vector` extension enabled)
- Clerk application
- Oxylabs Web Scraper API credentials
- OpenAI API key

### Setup

```bash
git clone <your-repo-url>
cd skew
npm install
cp .env.example .env.local   # fill in the values
```

Run `supabase/schema.sql` (and `supabase/related-articles.sql`) in the Supabase SQL Editor, then start the dev server:

```bash
npm run dev
```

### Triggering the pipeline manually

See `commands.md` for ready-to-use PowerShell snippets. Quick version (PowerShell):

```powershell
$env:BIASLY_ADMIN_SECRET = "<your secret>"

# 1. scrape
Invoke-RestMethod -Uri http://localhost:3000/api/scrape -Method Post `
  -Headers @{ "x-biasly-admin-secret" = $env:BIASLY_ADMIN_SECRET; "Content-Type" = "application/json" } `
  -Body '{"perSourceLimit":3}'

# 2. analyze
Invoke-RestMethod -Uri http://localhost:3000/api/analyze -Method Post `
  -Headers @{ "x-biasly-admin-secret" = $env:BIASLY_ADMIN_SECRET; "Content-Type" = "application/json" } `
  -Body '{}'

# 3. local cron pipeline (secret check skipped in dev)
Invoke-RestMethod -Uri http://localhost:3000/api/cron/pipeline -Method Get
```

Watch the Next.js dev server terminal for scrape/analysis progress logs.

---

## Testing

```bash
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint
npm run build       # Next.js production build
npm run test:e2e    # Playwright E2E
```

Playwright specs cover auth, homepage, news details, candidate filtering, scrape routes, design system, and Supabase DB behavior.

---

## Design Decisions & Highlights

- **Append-only scraping** with URL-based dedupe — a scrape never deletes or resets existing articles.
- **Strict content gate** — an article is saved only with a meaningful body, image URL, and published date; non-article pages are rejected at both the URL and content level.
- **Pending detection via `LEFT JOIN`** on `article_analyses` rather than `analyzed_at IS NULL`, so manually deleted analysis rows are automatically re-queued.
- **Large-integer safety** — Oxylabs `schedule_id`/job `id` values are 64-bit and exceed `Number.MAX_SAFE_INTEGER`; they're extracted from raw response text via regex before any `JSON.parse`.
- **`/runs` over `/jobs`** — job status (`done`/`pending`/`faulted`) is only available on the runs endpoint, so results are fetched only for completed runs.
- **Server/client boundary discipline** — all scraping, AI calls, and secret access live in server-only modules; the browser only renders stored data.
- **pgvector cosine similarity** for related articles, gated behind the presence of an embedding.
