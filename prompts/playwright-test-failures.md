# Playwright Test Failure Fixes

## Goal

Investigate and fix every failure from `npx playwright test`, with deterministic local and GitHub Actions CI results. Preserve meaningful coverage of authentication, protected news pages, responsive layouts, and visual design.

## Skills read

- `.agents/skills/playwright-cli` and its Playwright test-running guidance
- `.agents/skills/clerk` and `.agents/skills/clerk-testing`
- Official Clerk Playwright testing documentation: https://clerk.com/docs/guides/development/testing/playwright/overview

## Existing code inspected

- `playwright.config.ts`
- `tests/global.setup.ts`
- `tests/auth-helpers.ts`
- `tests/clerk-auth.spec.ts`
- `tests/news-details.spec.ts`
- `tests/design-system.spec.ts`
- `tests/homepage.spec.ts`
- `.github/workflows/playwright.yml`
- `.github/workflows/playwright-update-snapshots.yml`
- Clerk sign-in and sign-up pages, app layout, and header
- Existing uncommitted changes in the test configuration, workflow, auth setup, news page, and dependency manifests

The initial `npx playwright test` run executed 88 tests and reported 18 failed and 70 passed. Failures included repeated news-page navigation/sign-in timeouts in Chromium, Firefox, and WebKit; Clerk UI/auth failures in Firefox and WebKit; and six Firefox full-page snapshots with 1–2 pixel height differences. The run also printed a Windows libuv `UV_HANDLE_CLOSING` assertion.

## Decisions or assumptions

- Keep the requested full Playwright suite runnable; do not hide failures by broadly skipping projects, disabling tests, increasing timeouts without cause, or weakening screenshot thresholds.
- Avoid leaking or printing `.env.local` values. CI must use GitHub Secrets for Clerk keys and optional E2E credentials.
- Use Clerk's documented `clerkSetup()` project-based setup and `setupClerkTestingToken()` flow.
- Prefer deterministic session reuse or another documented auth test helper over repeated interactive sign-ins, and make optional credential-dependent tests skip only when the required secrets are actually absent.
- Keep Chromium, Firefox, and WebKit coverage unless evidence demonstrates a specific unsupported/browser-only test that needs narrowly scoped handling.
- Stabilize screenshot assertions against incidental full-page height rounding while retaining meaningful visual regression coverage.
- Diagnose the runtime assertion separately from ordinary Playwright test failures; select a supported, consistent Node version for local and CI only if evidence shows the runtime causes it.

## Files likely to change

- `playwright.config.ts`
- `tests/global.setup.ts`
- `tests/auth-helpers.ts`
- `tests/clerk-auth.spec.ts`
- `tests/news-details.spec.ts`
- `tests/design-system.spec.ts`
- `.github/workflows/playwright.yml`
- `package.json` / `package-lock.json` only if a dependency change is justified

Avoid changing application behavior unless an identified failing assertion proves the application itself is incorrect.

## Implementation requirements

1. Load `.env.local` before deriving any Clerk test variables, including `CLERK_PUBLISHABLE_KEY` from `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, so local and CI test setup use the same values.
2. Make navigation wait for the state needed by each assertion rather than waiting on unrelated third-party resources.
3. Make auth helpers resilient to Clerk's actual configured sign-in flow; remove fixed sleeps and hard-coded verification codes unless the configured test mode explicitly requires them.
4. Ensure authenticated page-layout tests establish a valid isolated session efficiently and consistently across browser projects.
5. Keep responsive layout assertions and verify the news detail route remains protected for signed-out users.
6. Make visual tests robust to cross-platform/browser fractional-height variation without broad pixel-diff tolerance increases or loss of layout checks.
7. Ensure Playwright setup, browser installation, secrets, and Node version in GitHub Actions are consistent with the supported project/runtime requirements.
8. Do not edit `.env.local`, commit secrets, or emit secret values in logs.
9. Preserve existing user changes and limit modifications to changes needed for this test suite.

## Security requirements

- Never place Clerk secret keys, E2E credentials, or testing tokens in source control, test snapshots, logs, or workflow literals.
- Consume local keys from the ignored `.env.local`; consume CI keys only from GitHub Actions Secrets.
- Do not add a test-only unauthenticated bypass to protected application routes.

## Acceptance criteria

- `npx playwright test` completes successfully locally using the existing `.env.local` configuration.
- The same configured suite is runnable in GitHub Actions on Ubuntu with only documented GitHub Secrets; tests that need optional E2E user credentials skip cleanly when those credentials are absent.
- Clerk signed-out route protection and auth UI tests remain meaningful.
- News detail page tests verify the intended title, layout, and related story grid in supported browser projects.
- Design system screenshot or equivalent visual checks retain meaningful coverage and are not made permissive solely to mask platform differences.
- No new TypeScript or lint failures are introduced.
- No secrets are added to source control.

## Checks to run

- `npx playwright test`
- `npm run typecheck`
- `npm run lint`
- Run `npm run build` only if application modules, routes, or build configuration change.

## Exact manual test steps

1. Confirm required local Clerk test keys and any optional E2E user credentials are present in `.env.local` without printing their values.
2. Run `npx playwright test` from the repository root and verify the process exits with code 0.
3. In GitHub Actions, configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`; configure `E2E_CLERK_USER_EMAIL` and `E2E_CLERK_USER_PASSWORD` only when running the authenticated-user test.
4. Run the `Playwright Tests` workflow on Ubuntu and verify all non-credential tests pass and credential-dependent tests either pass or report skipped when those secrets are absent.
