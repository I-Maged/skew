# Supabase Database + Homepage Wiring

## Goal
Set up the Supabase schema, typed server client, query modules, and read routes, then wire the homepage to Supabase using the existing 12 stories as seed/display data. Scraping, AI analysis, and pgvector remain deferred.

## Skills read
- `.agents/skills/supabase`
- `.agents/skills/tdd`
- `.agents/skills/tailwind-css`
- `node_modules/next/dist/docs/` for Next.js 16 server components, route handlers, and caching behavior

## Existing code inspected
- `package.json`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `components/home/home-news-card.tsx`
- `.env.local`
- `.env.example`
- `next.config.ts`

## Decisions or assumptions
- Home remains publicly readable via Server Components.
- Supabase service role key is available locally.
- Seed source is inactive display-only data.
- Core schema follows `AGENTS.md`, but display columns `category`, `location`, and `sources_count` are added to `articles` for seed fidelity.
- Embedding column and pgvector support are deferred.
- News details page remains static in this milestone.

## Files likely to change
- `.env.example`
- `app/page.tsx`
- `app/api/sources/route.ts`
- `app/api/articles/route.ts`
- `lib/supabase/env.ts`
- `lib/supabase/server.ts`
- `lib/supabase/types.ts`
- `lib/supabase/queries/sources.ts`
- `lib/supabase/queries/articles.ts`
- `supabase/schema.sql`
- `supabase/seed.sql`
- `tests/supabase-db.spec.ts`
- `tests/homepage.spec.ts`

## Implementation requirements
1. Install and use `@supabase/supabase-js`.
2. Create the schema in `supabase/schema.sql` for all core tables.
3. Add RLS and SELECT grants for `sources`, `articles`, and `article_analyses`.
4. Add `category`, `location`, and `sources_count` to `articles`.
5. Create hand-maintained Supabase `Database` types.
6. Create a `server-only` Supabase client.
7. Create query modules for sources and articles.
8. Create thin read routes `GET /api/sources` and `GET /api/articles`.
9. Create `supabase/seed.sql` with an inactive source and the 12 seeded stories.
10. Wire `app/page.tsx` to `listHomepageArticles`.
11. Keep visual behavior as close as possible to the current homepage.

## Security requirements
- Service role key is server-only.
- `server-only` guards database modules.
- No action-route secrets changed.
- Seed source is inactive and not scrape-targeting real URLs.
- Read routes do not require admin secrets.

## Acceptance criteria
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` passes.
- Homepage renders the 12 seeded articles.
- `/api/sources` and `/api/articles` reflect seed rows.

## Checks to run
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- targeted Playwright tests

## Exact manual test steps
1. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.
2. Run `supabase/schema.sql` then `supabase/seed.sql`.
3. Run `npm run dev`.
4. Visit `/`, `/api/sources`, and `/api/articles`.
5. Confirm the 12 seeded cards render and the homepage count remains 12.