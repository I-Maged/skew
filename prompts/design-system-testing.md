# Prompt: Playwright Testing for the Design System

## Goal

Add a robust Playwright E2E test suite for the new UI design system, covering smoke, component, theme, responsive, accessibility, console, and visual regression behavior.

## Skills read

- `.agents/skills/playwright-cli`
- `node_modules/next/dist/docs/`

## Existing code inspected

- `playwright.config.ts`
- `tests/example.spec.ts`
- `package.json`
- Design system components and `app/page.tsx`
- `app/layout.tsx`, `app/globals.css`

## Decisions / assumptions

- Tests run against the Next.js dev server via Playwright `webServer` config.
- Browser matrix keeps Chromium, Firefox, and WebKit projects.
- Viewport-specific behavior is validated inside test describes using `test.use({ viewport })`.
- Visual baselines are stored under Playwright's default snapshot directory.
- Stable test selectors use `data-testid` attributes added to major components.
- `localStorage` theme persistence is tested through direct toggle clicks and reloads.

## Files likely to change

- `playwright.config.ts`
- `package.json`
- `tests/design-system.spec.ts` (new)
- `app/page.tsx` (add stable test IDs and grid ID)
- `components/layout/utility-bar.tsx`
- `components/layout/header.tsx`
- `components/layout/category-nav.tsx`
- `components/layout/footer.tsx`
- `components/ui/theme-toggle.tsx`
- `components/ui/bias-meter.tsx`
- `components/news/news-card.tsx`

## Implementation requirements

1. Update `playwright.config.ts`:
   - set `use.baseURL` to `http://localhost:3000`
   - enable `webServer` with `npm run dev`, `url: http://localhost:3000`, `reuseExistingServer: !process.env.CI`
2. Add `"test:e2e": "playwright test"` to `package.json`.
3. Add stable `data-testid` attributes:
   - utility bar root: `utility-bar`
   - header root: `header`
   - category nav root: `category-nav`
   - footer root: `footer`
   - theme group: `theme-toggle`
   - bias meter root: `bias-meter`
   - news card root: `news-card`
   - news grid: `news-grid`
   - token reference section: `token-reference`
4. Create `tests/design-system.spec.ts` with:
   - desktop smoke test
   - news card count and grid column verification at desktop/tablet/mobile
   - theme toggle light/dark/auto behavior and persistence
   - console error guard
   - visual snapshot baselines for desktop/tablet/mobile in light and dark
5. Ensure selectors are resilient (roles, test IDs, text).
6. Do not remove existing `example.spec.ts`.

## Security requirements

- Tests must not expose secrets.
- Dev server only; no production credentials.

## Acceptance criteria

- `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- `npm run test:e2e` passes in Chromium, Firefox, and WebKit.
- Theme toggle persists across reload.
- Responsive grid verified at 1280px, 768px, and 375px.
- Visual baselines generated and stable on rerun.
- No console errors during tests.

## Checks to run

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npx playwright install`
- `npm run test:e2e`

## Exact manual test steps

1. Run `npm run test:e2e`.
2. Open `playwright-report/index.html`.
3. Verify all browser projects pass.
4. Update snapshots only when intentional: `npx playwright test --update-snapshots`.