# Prompt: Biasly News Details Page

## Goal

Implement a responsive Biasly article details page at `/news/[slug]`, matching `ui-imgs/03-news-details-page.png` and the supplied article-details description. Reuse the existing `HomeFooter`. Use static article data and TDD.

## Skills read

- `.agents/skills/tdd`
- `node_modules/next/dist/docs/` (App Router, dynamic params)

## Existing code inspected

- `components/home/home-utility-bar.tsx`
- `components/home/home-header.tsx`
- `components/home/topic-bar.tsx`
- `components/home/home-news-card.tsx`
- `components/home/home-footer.tsx`
- `app/page.tsx`
- `app/design-showcase/page.tsx`
- `tests/homepage.spec.ts`

## Decisions or assumptions

- Route: `/news/[slug]`; even though only one article exists, render it for any slug.
- Reuse `HomeFooter`; build news-detail sections with a new `components/news-details/*` group.
- Use the same local-SVG placeholder approach for hero/related images.
- Keep interactions lightweight: clickable links/buttons and toggles where specified, no external dependencies.
- Follow the desktop/tablet/mobile breakpoints from the supplied description.

## Files likely to change

- `prompts/news-details-page.md`
- `app/news/[slug]/page.tsx` (new)
- `components/news-details/article-header.tsx` (new)
- `components/news-details/hero-image.tsx` (new)
- `components/news-details/bias-distribution.tsx` (new)
- `components/news-details/article-body.tsx` (new)
- `components/news-details/related-story-card.tsx` (new)
- `components/news-details/bias-analysis-card.tsx` (new)
- `components/news-details/ai-summary-card.tsx` (new)
- `components/news-details/source-breakdown-card.tsx` (new)
- `components/news-details/newsletter-signup.tsx` (new)
- `tests/news-details.spec.ts` (new)
- `public/images/details-*.svg` (new)

## Implementation requirements

### Route and layout
1. Create `app/news/[slug]/page.tsx`.
2. Render the section hierarchy from the supplied description:
   - UtilityBar, MainHeader, MainLayout, ArticleColumn, Sidebar, NewsletterSignup, Footer
3. Use a two-column desktop grid (`2fr / 0.92fr`) and collapse to one column on mobile.
4. Center content with max width around 936-1040px and responsive side padding.

### Utility bar and header
- Reuse the homepage utility bar style, adapted to the details page height/content if needed.
- Reuse the homepage header style with Biasly logo, nav, Subscribe, and Login.
- Keep Home/For You/Local/Blindspot, with a subtle red dot beside “For You”.

### Article header
- Metadata: `Politics · United States`
- Title: `Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report`
- Byline: `By David Morgan | May 31, 2026 | 12 min read`
- Action buttons: Save, Bookmark icon, Share, Share icon, More menu icon

### Hero image
- wide rectangular image, alt text `President Donald Trump seated in front of American flags`
- caption with photographer/date text.

### Bias distribution
- heading `Bias Distribution`
- three equal-adjacent segments: Left 20%, Center 31%, Right 49%
- source count `12 sources`

### Article body
Render all 7 supplied paragraphs, including the quote paragraph. Use compact readable typography.

### Related stories
- heading `Related Stories`
- 2-column desktop / 1-column mobile
- 6 related story cards with image, category/location, headline, date, read time.

### Sidebar
- Bias Analysis card with overall `Right 49%`, 12 sources, bias rows, explanation, `How We Analyze Bias` button
- AI Summary card with generated date, bullets, disclaimer, `Provide Feedback`
- Source Breakdown card with totals and source rows, plus `View All Sources`

### Newsletter signup
- title + description, email input, Subscribe button; responsive stacking.

### Footer
- Reuse `HomeFooter`.

### Images
- Create local SVG placeholders for the hero and related-story images.

### Accessibility and interactions
- Semantic elements, one H1, accessible labels, keyboard focus, no color-only meaning.
- Toggles and menus can be lightweight client buttons where useful.

## Security requirements

- No secrets; no privileged client calls.
- Use `/news/[slug]` dynamic route only; no database/API dependencies.

## Acceptance criteria

- `/news/trump-iran-proposal` renders all sections.
- Desktop layout is two-column; mobile stacks.
- Related stories count is 6 and grid is 2/1 columns as specified.
- Console has no errors.
- `npm run typecheck`, `npm run lint`, `npm run build`, and Playwright E2E pass.

## Checks to run

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npx playwright test`

## Exact manual test steps expected after implementation

1. Run `npm run dev`.
2. Open `/news/trump-iran-proposal`.
3. Verify desktop and mobile layouts.
4. Run typecheck, lint, build, and Playwright.

I prepared the implementation prompt at `prompts/news-details-page.md`. Is this good to execute?