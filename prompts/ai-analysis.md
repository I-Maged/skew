# AI Analysis Pipeline (OpenRouter)

## Goal

Implement the AI analysis pipeline for biasly: analyze every valid article missing an `article_analyses` row using OpenRouter (model `nvidia/nemotron-3.5-super-vl:free`), store results in `article_analyses`, set `analyzed_at`, generate a 1536-dim embedding, and power a Related Articles section on the news details page (pgvector cosine similarity).

## Skills read

- `.agents/skills/ai-sdk`
- `.agents/skills/supabase`
- `node_modules/next/dist/docs/` (route handlers)
- AGENTS.md sections 9, 14, 15, 19, 20, 21

## Existing code inspected

- `lib/pipeline/analyze.ts` (stub)
- `lib/pipeline/scrape.ts`, `lib/pipeline/types.ts`
- `lib/supabase/queries/oxylabs.ts` (`listPendingAnalysisArticleIds`)
- `lib/supabase/queries/articles.ts`
- `lib/supabase/server.ts`, `lib/supabase/env.ts`, `lib/supabase/types.ts`
- `app/api/scrape/route.ts`, `app/api/cron/pipeline/route.ts`
- `supabase/schema.sql`, `.env.local`, `.env.example`, `package.json`

## Decisions / assumptions

- Provider: OpenRouter via `@ai-sdk/openai` with `baseURL = https://openrouter.ai/api/v1` and `OPENROUTER_API_KEY`. Model id `nvidia/nemotron-3.5-super-vl:free`. Embeddings via `openai/text-embedding-3-small`.
- Structured output via `generateObject` + Zod; validate before save; retry once on invalid; never save bad analysis.
- Pending detection via LEFT JOIN `articles` -> `article_analyses` (reuse `listPendingAnalysisArticleIds` + new `listPendingAnalysisArticles`).
- Batching: `ANALYSIS_BATCH_SIZE` env (default 5); continue until none pending unless `limit`/`articleIds`.
- Mark `analyzed_at` only after analysis + embedding saved.
- Embedding backfill: rows with `embedding IS NULL` re-picked up; skip LLM call if analysis exists, only generate missing embedding.
- pgvector: enable extension, add `embedding vector(1536)`, IVFFlat cosine index. Update `schema.sql`, `types.ts`, provide ALTER SQL.
- Related articles via Postgres RPC `match_related_articles`; `getRelatedArticles(articleId, embedding)` in queries/articles.ts.
- Packages: add `ai`, `@ai-sdk/openai`.

## Files changed / created

- `package.json`
- `.env.example`
- `lib/ai/openrouter.ts`
- `lib/pipeline/analysis-schema.ts`
- `lib/pipeline/analyze.ts`
- `lib/supabase/queries/articles.ts`
- `lib/supabase/types.ts`
- `app/api/analyze/route.ts`
- `supabase/schema.sql`
- `supabase/related-articles.sql`
- `app/news/[slug]/page.tsx` (Related Articles section)
- `components/news/related-articles.tsx`

## Implementation requirements

1. OpenRouter client (server-only).
2. Zod schema with percentage sum refine; biasScore derived.
3. Analysis runner with batching, validation, retry, logging, summary.
4. Embedding generation and storage.
5. POST /api/analyze with admin secret.
6. pgvector column + index + RPC.
7. Related Articles UI.

## Security requirements

- Secrets server-only; admin secret via header; cron via CRON_SECRET.

## Acceptance criteria

- typecheck, lint, build pass.
- POST /api/analyze analyzes all pending and returns counts.
- Re-run idempotent.
- Embeddings stored; related articles shown when embedding exists.

## Checks to run

- npm run typecheck
- npm run lint
- npm run build

## Exact manual test steps

1. npm install
2. Add OPENROUTER_API_KEY (present), optional ANALYSIS_BATCH_SIZE.
3. Run ALTER SQL in Supabase Dashboard.
4. npm run dev
5. Scrape articles.
6. POST /api/analyze.
7. Verify DB rows + embeddings.
8. Open details page -> Related Articles.
9. Re-run -> zeros.