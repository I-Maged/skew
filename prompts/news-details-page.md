# News Details Seeded Article Wiring

## Goal
Make homepage stories clickable into `/news/[slug]`, fetch the seeded article from Supabase, and render the seeded full story plus analysis on the protected details page.

## Skills read
- `.agents/skills/supabase`
- `.agents/skills/clerk`
- `.agents/skills/tdd`
- Next.js 16 server component and dynamic route docs

## Existing code inspected
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `components/home/home-news-card.tsx`
- `components/news-details/*`
- `lib/supabase/types.ts`
- `lib/supabase/queries/articles.ts`
- `supabase/schema.sql`
- `supabase/seed.sql`
- `tests/news-details.spec.ts`
- `tests/clerk-auth.spec.ts`

## Decisions
- Add a unique `slug` column to `articles`.
- Keep `/news/[slug]` and support slug lookup.
- Use seeded DB values for title/category/image/body/analysis.
- Keep related stories static in this milestone.
- Preserve current layout while replacing hardcoded values with props.

## Files likely to change
- `supabase/schema.sql`
- `supabase/seed.sql`
- `lib/supabase/types.ts`
- `lib/supabase/queries/articles.ts`
- `app/api/articles/[slug]/route.ts`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `components/home/home-news-card.tsx`
- `components/news-details/*`
- `tests/news-details.spec.ts`
- `tests/clerk-auth.spec.ts`
- `tests/supabase-db.spec.ts`

## Implementation requirements
1. Add nullable unique `slug`.
2. Seed slug for all 12 stories and full text/analysis for the first story.
3. Implement `getArticleBySlug`.
4. Implement dynamic API route.
5. Make home cards link to slugs.
6. Make details page fetch and render seeded data.
7. Update tests.

## Security requirements
- Route remains Clerk-protected.
- Supabase reads use server-only service-role client.
- Missing article returns not-found.

## Acceptance criteria
- Home cards link to seeded article.
- `/news/{slug}` renders seeded details.
- Checks pass.

## Checks to run
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- targeted Playwright