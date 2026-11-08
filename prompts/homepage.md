# Prompt: Biasly News Homepage

## Goal

Implement the responsive Biasly News homepage based on `ui-imgs/02-homepage.png` and the homepage description provided in the conversation. Move the existing design-system showcase to `/design-showcase` and replace `/` with the new homepage. Use static sample data for the 12 story cards.

## Skills read

- `.agents/skills/tdd` (vertical red-green-refactor)
- `node_modules/next/dist/docs/` (App Router, components, styling)

## Existing code inspected

- `app/page.tsx` (current design-system showcase)
- `tests/design-system.spec.ts`
- `components/news/news-card.tsx`
- `components/layout/*`, `components/ui/*`
- `app/globals.css`

## Decisions or assumptions

- Keep the design-system showcase reachable at `/design-showcase` with its current content unchanged.
- Build the new homepage as a self-contained set of `components/home/*` components so the existing design system is untouched.
- Use the homepage-specific tokens via Tailwind arbitrary values instead of changing global theme tokens.
- Story images are local SVG placeholders for deterministic tests.
- `data-testid="news-card"` is retained on each homepage card so structural tests can count 12.
- Navigation/header/utility interactions are minimal and clickable; no stateful drawer is required beyond a basic button.

## Files likely to change

- `prompts/homepage.md`
- `app/page.tsx`
- `app/design-showcase/page.tsx`
- `tests/design-system.spec.ts`
- `tests/homepage.spec.ts` (new)
- `components/home/home-utility-bar.tsx` (new)
- `components/home/home-header.tsx` (new)
- `components/home/topic-bar.tsx` (new)
- `components/home/home-news-card.tsx` (new)
- `components/home/home-footer.tsx` (new)
- `public/images/story-*.svg` (new, 12 files)

## Implementation requirements

### 1. Move showcase
1. Create `app/design-showcase/page.tsx` containing the current `app/page.tsx`.
2. Update `tests/design-system.spec.ts` to visit `/design-showcase` instead of `/`.

### 2. Homepage shell
Implement `app/page.tsx` with:
- full-width light gray background `#f1f2ef`
- centered content max width `936px`
- sections: utility bar, header, topic bar, main content, footer

### 3. Utility bar
- black background, about 28px tall
- left: “Browser Extension”, divider, “Theme:”, and Light/Dark/Auto
- right: Monday, June 1, 2026, divider, Set Location, globe icon, International Edition, downward chevron
- hide on mobile

### 4. Main header
- white background, about 58px tall, thin bottom border
- left: hamburger, bold lowercase `biasly` with “News” label, about 90px logo area
- center: Home, For You, Local, Blindspot; Home has short black underline
- right: black Subscribe button and outlined Login button, about 102x36
- Home is active
- on tablet/mobile hide center nav and Login where needed

### 5. Topic bar
- light gray background, bottom border, about 44px height
- left circular plus/navigation control
- rounded gray pills with plus icon
- exact topics and horizontal scroll with hidden scrollbar

### 6. Top News
- heading `Top News`, 23-25px bold black
- grid 3 columns desktop, 2 tablet, 1 mobile
- 20px / 21px gap
- 12 cards

### 7. News card
Structure:
- image area 16/9 with circular info icon top right
- metadata `Category · Location`
- bold headline 15px
- perspective bar equal 3 columns:
  - left red `#a81721`
  - center off-white `#f5f5f2`
  - right blue `#123f91`
  - labels `L x%`, `Center x%`, `Right x%`
- source count bottom
- hover border/translate
Use the provided exact 12 story datasets.

### 8. Footer
- dark `#242424`
- four columns: brand, Company, Help, Connect
- social icons: X, LinkedIn, Instagram, YouTube
- copyright row
- mobile stacking

### 9. Accessibility
- semantic elements
- alt text
- aria labels
- keyboard focus

### 10. Images
Create 12 local SVG placeholders with varying colors and text. Use them as image sources.

## Security requirements

- No secrets, no client-side privileged calls.
- Server/client boundaries remain intact.

## Acceptance criteria

- Homepage renders at `/` with all sections.
- 12 `news-card` elements.
- Grid columns: 3 desktop, 2 tablet, 1 mobile.
- No console errors.
- Typecheck, lint, and build pass.
- Design system showcase still available at `/design-showcase`.

## Checks to run

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npx playwright test`

## Exact manual test steps

1. Run `npm run dev`.
2. Open `/` and verify layout.
3. Visit `/design-showcase` and verify unchanged design system.
4. Run `npm run test:e2e`.
5. Run `npm run typecheck`, `npm run lint`, `npm run build`.

Before implementation, ask: `I prepared the implementation prompt at prompts/homepage.md. Is this good to execute?`