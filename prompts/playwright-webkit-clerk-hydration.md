# Fix Playwright WebKit Authentication and Clerk Hydration Failures

## Goal

Resolve the Playwright failures and hydration diagnostics recorded in `playwright_run.md` without weakening test coverage or changing the intended public/protected route behavior.

## Skills read

- `.agents/skills/clerk` (Clerk Next.js patterns and test routing)
- `.agents/skills/tdd` (incremental behavior-first test/fix workflow)
- Previously loaded Playwright CLI guidance and Playwright test-running reference

## Existing code and evidence inspected

- `playwright_run.md`
- `components/home/home-header.tsx`
- `app/layout.tsx`
- `app/news/[slug]/page.tsx`
- `playwright.config.ts`
- `tests/global.setup.ts`
- `tests/auth-helpers.ts`
- `tests/clerk-auth.spec.ts`
- `tests/news-details.spec.ts`
- `.github/workflows/playwright.yml`
- `.github/workflows/playwright-update-snapshots.yml`
- `package.json` (Clerk Next.js 7.9.25 and Clerk testing 2.2.55)
- Existing prompt files concerning Playwright failures, snapshot updates, and Clerk authentication

The report records 7 failed WebKit tests and 111 passed tests. Protected news pages redirected to `/sign-in`, leaving article and layout locators absent; the grid locator also timed out on the redirected page. It also records a Clerk `UserButton` hydration mismatch at `HomeHeader`, separate hydration attribute warnings involving `caret-color: transparent`, and a GitHub Actions Node 20 deprecation warning. The repeated retry/error annotations are not additional unique test failures.

## Decisions or assumptions

- Preserve Chromium, Firefox, and WebKit coverage and keep news details routes protected.
- Treat the WebKit test failures as an authentication/session setup problem until traces and test evidence establish otherwise; do not make those tests pass by skipping them, weakening assertions, or bypassing Clerk.
- Treat the `UserButton` hydration mismatch as a real application issue. Do not mask it with `suppressHydrationWarning`.
- Investigate whether the `caret-color` diagnostics originate from Playwright screenshot instrumentation or application markup. Fix them only if application-owned markup or lifecycle is responsible; do not hide unrelated diagnostics.
- Address the Node 20 GitHub Actions warning by using action versions compatible with the runner's Node runtime if supported versions are available. Do not chase unrelated transitive dependency deprecations without evidence.
- Keep any changes scoped to Clerk header rendering, E2E authentication/setup, relevant CI diagnostics, and directly related tests.

## Files likely to change

- `components/home/home-header.tsx`
- `tests/global.setup.ts`
- `tests/auth-helpers.ts`
- `tests/clerk-auth.spec.ts`
- `tests/news-details.spec.ts`
- `.github/workflows/playwright.yml`
- `.github/workflows/playwright-update-snapshots.yml`

Only change additional files if investigation demonstrates a direct need.

## Implementation requirements

1. Reproduce or inspect the failing WebKit auth flow and its trace, then correct the underlying Clerk session setup so an authenticated state is actually established and reusable by each browser project.
2. Verify Clerk sign-in completion before writing the authenticated Playwright storage state. Fail setup with a useful diagnostic if sign-in did not complete; never save an unauthenticated state as success.
3. Keep the signed-out redirect and signed-in protected-page tests meaningful. Keep all existing news-page content and layout assertions.
4. Make `HomeHeader` produce matching server and initial client markup around Clerk controls. Use the Clerk loading state and a stable, layout-compatible fallback where needed; render `UserButton` only when Clerk is ready.
5. Investigate the reported `caret-color` attribute mismatch and verify whether it is Playwright screenshot instrumentation or app-owned DOM. Do not broadly suppress hydration warnings.
6. Preserve visual snapshot coverage and its current meaningful thresholds.
7. Ensure failed CI Playwright runs retain useful HTML report and trace/test-result artifacts, without exposing environment values.
8. Update GitHub Actions versions to Node-runtime-compatible releases where supported, in both relevant workflows, to remove the reported Node 20 action deprecation warning. Do not alter unrelated pipeline behavior or permissions.
9. Keep secrets server-side/in GitHub Secrets, avoid logging secret values, and do not add auth bypasses or test-only production behavior.
10. Use an incremental test-first workflow: add or sharpen one behavior assertion, verify it fails for the diagnosed cause, implement the smallest fix, then repeat for the next behavior.

## Security requirements

- Do not commit Clerk credentials, session cookies, testing tokens, or generated storage state.
- Do not print secret values or include them in test artifacts.
- Do not expose protected news data to signed-out users or add test-only auth bypasses.
- Keep existing repository secret names and least-privilege workflow permissions.

## Acceptance criteria

- The news details and signed-in auth tests pass in Chromium, Firefox, and WebKit when E2E Clerk credentials are configured.
- The signed-out protected-route redirect and Clerk sign-in/sign-up UI tests continue to pass.
- The server/client hydration mismatch at `HomeHeader`/`UserButton` is gone without hydration-warning suppression.
- Screenshot and responsive-layout assertions remain enabled and meaningful.
- Test setup does not save authenticated storage state until the sign-in flow is verified.
- Failed CI runs retain usable Playwright diagnostics, and the reported Node 20 GitHub Actions warning is removed by compatible action versions.
- Typecheck and lint pass; build passes if application/runtime files change.
- No secrets or generated auth state are added to source control.

## Checks to run

- Targeted Clerk auth and news-details tests in WebKit while iterating.
- `npx playwright test`
- `npm run typecheck`
- `npm run lint`
- `npm run build` if application/runtime modules or workflow/build configuration require it.
- Review `git status` to ensure no credentials, auth state, or generated reports are staged or tracked.

## Exact manual test steps

1. Confirm Clerk test keys and any required E2E user configuration are available locally without displaying their values.
2. Run the targeted Clerk authentication and news-details tests with the WebKit project; verify signed-in tests reach the protected article and signed-out tests still redirect.
3. Run `npx playwright test` and verify all configured browser projects pass, including the responsive layout and screenshot assertions.
4. Run `npm run typecheck`, `npm run lint`, and `npm run build` when required by changed application files.
5. Dispatch **Update Playwright Snapshots** only if visual baselines intentionally need updating; confirm that a subsequent **Playwright Tests** workflow passes rather than treating snapshot generation alone as validation.
6. On any CI failure, open the uploaded Playwright report and trace artifacts and confirm they contain no secrets.
