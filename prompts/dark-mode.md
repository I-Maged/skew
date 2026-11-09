# Full Dark Mode Pass for Homepage and News Details

## Goal
Make the existing Light / Dark / Auto theme controls functional and add a complete dark-mode visual pass for the homepage and news details page, without breaking the current light-mode layout.

## Skills read
- `.agents/skills/tailwind-v4`
- `.agents/skills/tailwind-css-patterns`
- `node_modules/next/dist/docs/`

## Existing code inspected
- `app/globals.css`
- `lib/theme.ts`
- `components/ui/theme-toggle.tsx`
- `components/home/home-utility-bar.tsx`
- `components/layout/utility-bar.tsx`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `components/home/*`
- `components/news-details/*`
- `tests/homepage.spec.ts`
- `tests/news-details.spec.ts`
- `tests/design-system.spec.ts`

## Decisions and assumptions
- Use the existing class-based `.dark` theme root, not a new theme system.
- Use Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))`.
- Replace the static text buttons in `HomeUtilityBar` with the existing `ThemeToggle` component.
- Preserve existing light-mode pixel behavior as much as possible.
- Add `dark:` variants only where needed instead of redesigning layouts.
- Keep related stories and seed article data unchanged.
- Design-system pages should remain functional.

## Files likely to change
- `app/globals.css`
- `components/home/home-utility-bar.tsx`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `components/home/home-news-card.tsx`
- `components/home/home-header.tsx`
- `components/home/home-footer.tsx`
- `components/home/topic-bar.tsx`
- `components/news-details/article-header.tsx`
- `components/news-details/hero-image.tsx`
- `components/news-details/article-body.tsx`
- `components/news-details/bias-distribution.tsx`
- `components/news-details/bias-analysis-card.tsx`
- `components/news-details/ai-summary-card.tsx`
- `components/news-details/source-breakdown-card.tsx`
- `components/news-details/related-story-card.tsx`
- `components/news-details/newsletter-signup.tsx`
- `tests/homepage.spec.ts`
- `tests/news-details.spec.ts`

## Implementation requirements
1. Add the Tailwind dark custom variant in `app/globals.css`.
2. Ensure `.dark` updates body and theme-token consumers.
3. Replace static utility-bar theme buttons with `ThemeToggle`.
4. Add dark variants to common surface/text/border colors:
   - background `#f1f2ef` / `#f2f3f0`
   - cards `#f8f8f5`
   - borders `#d2d3cf`, `#bfc0bd`
   - text `#111111`, `#444444`, `#737373`, `#181818`
5. Keep badge/bias meter colors intentional rather than blanket-inverting.
6. Avoid changing functional data flow.
7. Ensure no hydration warnings from client theme toggle.
8. Add tests that click Light, Dark, and Auto and assert:
   - `.dark` presence/absence
   - localStorage value
   - an expected background color or class after switching.

## Security requirements
- Theme logic remains client-only.
- No secrets or server code affected.
- No scraping, AI, or database behavior changed.

## Acceptance criteria
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` passes.
- Clicking Light/Dark/Auto changes theme.
- Dark mode is visibly applied across homepage and news details.
- Targeted Playwright theme tests pass.
- Existing homepage/news-details layout tests still pass.

## Checks to run
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- targeted Playwright theme/homepage/news-details tests

## Exact manual test steps expected
1. Run `npm run dev`.
2. Open `/`, click Dark, verify homepage and cards switch to dark colors.
3. Click Light, verify a restore.
4. Click Auto, verify system preference behavior.
5. Open `/news/trump-iran-proposal` and verify details page also switches.
6. Reload and verify stored theme persists.