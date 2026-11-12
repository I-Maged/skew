# Fix CI-Only WebKit Auth Failures (Clerk auth-state handoff)

## Goal

Make the authenticated Playwright tests (`tests/clerk-auth.spec.ts` "signed-in user can open a protected news page" and all of `tests/news-details.spec.ts`) pass in GitHub Actions for every browser project, including WebKit, without skipping tests, weakening assertions, raising timeouts, or changing application behavior.

## Root cause (evidence gathered during investigation)

CI run in `playwright_run.md`: **111 passed, 7 failed**. All 7 failures are WebKit-only and every one is the same symptom: the protected route redirects to `/sign-in`:

```
navigated to "http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fnews%2Ftrump-iran-proposal"
```

Failing: `tests/clerk-auth.spec.ts:51` (signed-in nav) and all six tests in `tests/news-details.spec.ts`. Every signed-out and public WebKit test passed, so WebKit rendering, the page itself, and the signed-out redirect behavior are all fine. The redirect comes from `auth.protect()` in `app/news/[slug]/page.tsx:86` (it produces exactly that `redirect_url` query), meaning the server saw **no authenticated session** for that request.

Established facts:

1. `playwright.config.ts` runs one `setup` project (default browser = Chromium) that signs in once and writes `playwright/.auth/user.json`; `chromium`, `firefox`, and `webkit` all load that one file. That is cross-browser cookie replay, which Playwright maintainers explicitly do not guarantee (microsoft/playwright#20301).
2. The saved Clerk session JWT (`__session`) has a **60 second lifetime** (verified by decoding the payload: `iat` → `exp` = 60s). Locally the file was already expired (87s and 147s past `exp`) and WebKit still passed, so an expired JWT is recoverable **only because Clerk refreshes it through a browser→FAPI handshake** using the dev-browser cookies (`__clerk_db_jwt`, `__client_uat`).
3. In CI, `workers: 1` runs projects sequentially: setup → chromium → firefox → webkit, so WebKit's first request happens ~4 minutes after setup. Every WebKit context therefore depends on that FAPI handshake succeeding, while the earliest Chromium contexts still had a fresh 60s JWT.
4. `@clerk/testing` implements the documented bot-protection bypass as a **per-browser-context route handler**: `setupClerkTestingToken({ page | context })` intercepts `https://<FAPI>/v1/**` and appends `__clerk_testing_token` plus `captcha_bypass` to responses (see `node_modules/@clerk/testing/dist/playwright/index.js`). The project skill `.agents/skills/clerk-testing` lists "No `setupClerkTestingToken()`" as an auth-failure anti-pattern.
5. `tests/clerk-auth.spec.ts` calls `setupClerkTestingToken` **only** in the signed-out sign-in/sign-up UI tests. The setup project's `clerk.signIn` and every authenticated spec navigation never register it, so the FAPI handshake that refreshes the stale session runs unprotected from a GitHub runner's datacenter IP with the Desktop Safari user agent — the one combination that differs from a passing local run (residential IP, WebKit running in parallel seconds after setup).

Conclusion: the authenticated tests depend on a single, minutes-old, cross-browser storage state, so their protected-page loads require a Clerk FAPI session refresh that in CI is rejected for the WebKit context. `auth.protect()` then redirects to `/sign-in`. The application code is correct and must not change.

## Skills read

- `.agents/skills/clerk` (Clerk router; `@clerk/nextjs` v7 is in use)
- `.agents/skills/clerk-testing` (`clerkSetup`, `setupClerkTestingToken`, `storageState` guidance)
- Clerk Playwright authenticated-flows guide: https://clerk.com/docs/guides/development/testing/playwright/test-authenticated-flows
- Playwright auth / storage-state issue: microsoft/playwright#20301 (auth per browser project is the recommended pattern)
- `.agents/skills/tdd` (verify the failing boundary first, then make the smallest change)

## Existing code inspected

- `playwright_run.md` (CI log and failure summary)
- `playwright.config.ts`
- `proxy.ts` (`clerkMiddleware()` only; it does not protect routes)
- `app/news/[slug]/page.tsx` (`ProtectedNewsDetails` → `await auth.protect()`)
- `app/layout.tsx` (`ClerkProvider`)
- `tests/global.setup.ts`, `tests/auth-helpers.ts`, `tests/clerk-auth.spec.ts`, `tests/news-details.spec.ts`, `tests/design-system.spec.ts`, `tests/homepage.spec.ts`, `tests/candidate-filter.spec.ts`, `tests/scrape-routes.spec.ts`, `tests/supabase-db.spec.ts`
- `.github/workflows/playwright.yml`, `.github/workflows/playwright-update-snapshots.yml`
- `node_modules/@clerk/testing/dist/playwright/index.js` (testing-token route handler implementation)
- `playwright/.auth/user.json` and `playwright/.auth/chromium.json` cookie metadata (names/domains/attributes only, values never printed)
- Prior prompts: `prompts/playwright-webkit-clerk-hydration.md`, `prompts/playwright-test-failures.md`, `prompts/firefox-clerk-ui-tests.md` (same failure class recurred; only setup assertions were added last time)

Local reproduction results (for context): with a dev server on `http://localhost:3000`, `npx playwright test tests/news-details.spec.ts --project=chromium --project=webkit` passed 13/13; the same WebKit tests passed 6/6 using a storage state whose `__session` JWT was expired by 87s and 147s. The defect is CI-specific, which is why the fix must remove the stale/foreign-state dependency rather than work around a local failure.

## Decisions and assumptions

- Keep all three browser projects and all existing assertions. No skips, no `test.slow()`, no timeout inflation, no browser-only exclusions.
- Do not change application code, `proxy.ts`, `app/news/[slug]/page.tsx`, or authentication behavior. `auth.protect()` stays.
- Auth state is produced **per browser project** by a matching setup project, so each project consumes a state written by its own browser seconds earlier. This removes cross-browser replay and shrinks the window in which the 60s session JWT goes stale at project start.
- The Clerk bot-protection bypass is installed on every context that will talk to the Clerk Frontend API (setup sign-in and authenticated spec navigations), because that is how the stale-token refresh survives CI.
- The setup project verifies its written state by loading it into a **fresh context of the same browser** and reaching the protected page. A broken handoff must fail setup with a clear message instead of surfacing as seven page-level failures.
- Public/visual specs stay signed out so the header (Login vs `UserButton`) and screenshots do not change.
- Keep `playwright/.auth/` gitignored and generated at runtime.

## Files likely to change

- `playwright.config.ts`
- `tests/global.setup.ts`
- `tests/auth-helpers.ts`
- `tests/clerk-auth.spec.ts`
- `tests/news-details.spec.ts`
- `tests/design-system.spec.ts` (signed-out opt-out only)
- `tests/homepage.spec.ts` (signed-out opt-out only)

Do not touch `.github/workflows/playwright.yml` unless a required env var is genuinely missing; `E2E_CLERK_USER_EMAIL` is already provided from job-level `env`. Do not touch `package.json` or the lockfile.

## Implementation requirements

1. **Per-browser setup projects.** In `playwright.config.ts` replace the single `setup` project with `setup-chromium`, `setup-firefox`, and `setup-webkit`, each matching `/global\.setup\.ts/` and using the matching `devices[]` entry (`Desktop Chrome`, `Desktop Firefox`, `Desktop Safari`) so the state file is written by the browser that will consume it. Keep them serial.
2. **Per-browser state files.** Add one path helper (e.g. `authStatePath(name) => resourcePath(\`playwright/.auth/${name}.json\`)`) and give each browser project `storageState: hasE2ECredentials ? authStatePath(browserName) : undefined` plus `dependencies: [\`setup-${browserName}\`]`. `hasE2ECredentials` is `!!process.env.E2E_CLERK_USER_EMAIL`. Keep `baseURL`, `trace`, reporters, `expect` thresholds, `webServer`, `fullyParallel`, `retries`, and `workers` as they are.
3. **Setup writes and verifies its own state.** In `tests/global.setup.ts`: derive the browser name from `test.info().project.name` (`setup-webkit` → `webkit`), keep `clerkSetup()`, call `signIn(page)`, navigate to `/news/trump-iran-proposal`, assert the existing heading, `mkdir` + write the state file, then open a **new** context with that file (`browser.newContext({ storageState })`), navigate to the protected route, assert the same heading, and close the context in `finally`. When `E2E_CLERK_USER_EMAIL` is absent, keep the current early `return` (tests skip).
4. **Testing token on the FAPI path.** In `tests/auth-helpers.ts`, call `setupClerkTestingToken({ page })` inside `signIn()` before `page.goto("/")`, and export a small `bypassClerkBotProtection(page)` wrapper for test contexts. Do not swallow errors from it — a missing `CLERK_FAPI` must fail loudly, since it signals `clerkSetup()` did not run.
5. **Authenticated specs.** Remove the now-redundant per-file `test.use({ storageState })` from `tests/news-details.spec.ts` and the signed-in block of `tests/clerk-auth.spec.ts` (config supplies it), keep the existing `test.skip(!hasCredentials, ...)` guards, and add a `beforeEach` that calls `bypassClerkBotProtection(page)` before any navigation in those authenticated tests. Keep the signed-out block's `storageState: { cookies: [], origins: [] }` and its existing `setupClerkTestingToken` calls unchanged.
6. **Public specs stay signed out.** Add `test.use({ storageState: { cookies: [], origins: [] } })` to `tests/design-system.spec.ts` and `tests/homepage.spec.ts` so their header/visual expectations keep rendering signed-out content.
7. Keep the change test-infrastructure only: no new dependency, no new npm script, no application or Supabase change.
8. Keep the TypeScript style of the repo: explicit types, no `any`, small helpers, no unused exports.

## Security requirements

- Never commit, print, or log `playwright/.auth/*.json`, Clerk session cookies, testing tokens, or any secret value.
- Keep `playwright/.auth/` in `.gitignore`; state files stay generated artifacts.
- Do not add test-only auth bypasses to application code, and do not expose protected article data to signed-out users.
- Do not add secrets to workflows or `.env.local`; keep using existing GitHub Secrets (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `E2E_CLERK_USER_EMAIL`).

## Acceptance criteria

- `npx playwright test` passes 118 (or the new total) in all three browser projects, with the same assertions as today.
- Each browser project consumes a state file produced by its own setup project; no project reads a state written by a different browser.
- Setup fails with an explicit message if the written state cannot authenticate a fresh context on `/news/trump-iran-proposal`.
- Signed-out behavior is unchanged: `/news/[slug]` still redirects signed-out users to `/sign-in`, and the sign-in/sign-up Clerk UI tests still pass.
- Design-system and homepage visual/responsive assertions are unchanged and still render the signed-out header.
- No secret or generated auth state is added to source control (`git status` clean apart from intended source edits).
- `npm run typecheck` and `npm run lint` pass; `npm run build` is not required unless non-test config changes.

## Checks to run

- `npx playwright test tests/news-details.spec.ts tests/clerk-auth.spec.ts --project=webkit` (note: `--project=webkit` runs the `setup-webkit` dependency automatically)
- `npx playwright test tests/news-details.spec.ts tests/clerk-auth.spec.ts --project=chromium --project=firefox`
- `npx playwright test` (full suite, all browsers)
- `npm run typecheck`
- `npm run lint`
- `git status` to confirm only intended files changed and no auth state is tracked

## Exact manual test steps after implementation

1. Confirm `.env.local` has the Clerk development keys and `E2E_CLERK_USER_EMAIL` without printing values; run on a free port, e.g. `PORT=3000 npm run dev` (note: if the shell sets `PORT=0`, Next binds a random port and Playwright's webServer readiness check times out — unset `PORT` first).
2. `npx playwright test tests/news-details.spec.ts tests/clerk-auth.spec.ts --project=webkit` — all WebKit authenticated tests must reach `/news/trump-iran-proposal` with no `/sign-in` in the URL.
3. Simulate the CI sequence: `npx playwright test --workers=1 --project=chromium --project=firefox --project=webkit tests/news-details.spec.ts tests/clerk-auth.spec.ts` (WebKit runs last, minutes after its own setup instead of replaying a Chromium-written file).
4. `npx playwright test` and confirm the exit code is 0 with no new failures in `design-system.spec.ts` snapshots.
5. `npm run typecheck` and `npm run lint`.
6. Push to a branch and confirm the **Playwright Tests** GitHub Actions workflow is green for `webkit`; if it still fails, read the `playwright-report`/`test-results` artifact for the first authenticated WebKit navigation and confirm whether it is a redirect to `/sign-in` or a different cause before changing anything else.
