# Prompt: Reuse and TDD-Refine Design System from origin/design-system

## Goal

Bring the existing design system from `origin/design-system` into the local
`feature/design-system` branch, then refine and expand it using vertical
red-green-refactor TDD slices. Ensure everything works with GitHub Actions
Playwright verification and that CI snapshot paths, selectors, and tests remain
stable cross-browser (Chromium/Firefox/WebKit).

## Skills read

- `node_modules/next/dist/docs/` (Next.js App Router, fonts, styling)
- `.agents/skills/tdd` (vertical red-green-refactor; behavior-focused tests)
- `.agents/skills/playwright-cli` (Playwright E2E and visual baselines)

## Existing code inspected

- `origin/design-system` tree and commits (`62cdf69`, `b181ee0`)
- `prompts/design-system.md` (origin source of design tokens)
- `prompts/design-system-testing.md` (origin test requirements)
- `tests/design-system.spec.ts` (origin baseline spec)
- local `feature/design-system` at `7845668` (currently behind design system commit)

## Decisions / assumptions

- Reuse `origin/design-system` as the base; do not rebuild from scratch.
- Fast-forward/merge origin branch into local feature branch.
- Keep TDD hygiene: one behavior → red test → minimal implementation → refactor.
- Keep existing visual baselines unless intentionally changed.
- Use `data-testid` selectors for stable CI.
- Playwright config must set `baseURL`, `webServer`, browser projects.
- No changes to API/schema/supabase/scraper in this task.
- Existing CI runs on GitHub Actions; snapshots are OS-specific (Ubuntu runners).
  Intentional visual changes require updating baselines via the workflow, not locally.

## Files likely to change

- `app/globals.css`, `app/layout.tsx`, `app/page.tsx`
- `lib/cn.ts`, `lib/theme.ts`, theme toggle
- `components/ui/*`, `components/layout/*`, `components/news/*`
- `playwright.config.ts`, `package.json`
- `tests/design-system.spec.ts` (only to fix gaps, never weaken)
- `prompts/design-system-refinement.md` (this file)

## Implementation requirements

### 1. Sync base design system
1. Confirm clean working tree.
2. Merge `origin/design-system` (or reset local branch to `b181ee0`) so local gets
   all UI foundation, prompts, tests, and `ui-imgs/`.
3. Run `npm install`.
4. Run typecheck, lint, build at least once with test command after sync.

### 2. TDD vertical refinement slices
For each slice, write/adjust one failing test, implement minimally, then refactor:

- Slice A: Token/variable resolution and dark-mode body colors.
- Slice B: Theme store/apply helpers and persistence.
- Slice C: Layout shell test IDs/responsive collapse.
- Slice D: Buttons (variants, sizes, disabled, focus ring).
- Slice E: BiasMeter percentage sum and rounding behavior.
- Slice F: News card grid columns and accessibility semantics.
- Slice G: Visual/snapshot stability and console-error cleanliness.

### 3. Playwright/GitHub Actions compatibility
1. Ensure `playwright.config.ts` uses `baseURL`, `webServer`, and browser projects
   (Chromium/Firefox/WebKit).
2. Do not remove `test:e2e` script.
3. Ensure all test IDs used in CI are present in production build (not dev-only).
4. Use `data-testid` (not brittle text) for structural assertions.
5. Keep snapshots under default Playwright snapshot directory for Linux CI.
6. Add any new baseline snapshot tests only with deterministic ordering/timeouts.
7. Install browsers in CI (`npx playwright install --with-deps`), as required.

### 4. TDD discipline
- Every behavior change must start with a failing test.
- Do not edit tests only to make failures pass; fix behavior instead.
- Run tests after each slice.
- Refactor only on green.

## Security requirements

- No secrets or privileged calls exposed to browser.
- No changes to API, database, or pipeline.

## Acceptance criteria

- Local branch contains the design system foundation and prompts.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- `npm run test:e2e` passes on Chromium/Firefox/WebKit.
- Dark mode toggle persists; Auto follows system.
- BiasMeter widths sum to 100%.
- Responsive grid columns confirmed (3 desktop, 2 tablet, 1 mobile).
- No console errors in smoke tests.
- GitHub Actions workflow remains valid and can execute tests.

## Checks to run

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npx playwright install --with-deps`
- `npm run test:e2e`

## Exact test steps after implementation

1. `git status` (should be clean before sync, changes after).
2. `npm install`.
3. `npm run dev`, visually inspect at 1280/768/375.
4. Toggle Light/Dark/Auto and reload.
5. Run `npm run test:e2e`.
6. Open `playwright-report/index.html` to verify snapshot results.
7. Push to GitHub and confirm Actions workflow execution.

## CI notes

- GitHub Actions Ubuntu captures baselines. Windows-generated baselines may differ
  only if font/rendering differences. Use `--update-snapshots` in CI when
  intentional visual changes occur, never to mask unexpected failures.