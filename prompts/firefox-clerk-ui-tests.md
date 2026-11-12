# Firefox Clerk UI Test Stability

## Goal

Make the signed-out Clerk sign-in and sign-up Playwright checks reliable in Firefox without weakening what they verify.

## Skills read

- Clerk skill router
- Clerk testing skill
- Clerk's official Playwright testing guide

## Existing code inspected

- `tests/clerk-auth.spec.ts`
- `tests/global.setup.ts`
- `tests/auth-helpers.ts`
- `playwright.config.ts`
- `app/sign-in/[[...sign-in]]/page.tsx`
- `app/sign-up/[[...sign-up]]/page.tsx`
- `.github/workflows/playwright.yml`

## Decisions and assumptions

- The reported failures time out while looking for Clerk's `.cl-signIn-root` and `.cl-signUp-root` elements after `clerk.loaded()`.
- The current local Firefox run passed these tests three times each, suggesting a timing/selector stability issue rather than a confirmed secret configuration error.
- Preserve real Clerk UI integration; do not mock Clerk, skip Firefox, disable these tests, or suppress genuine failures.
- Use Clerk's documented `data-clerk-component` marker and a suitable wait for externally loaded Clerk UI. Keep errors diagnosable without printing secrets.

## Files likely to change

- `tests/clerk-auth.spec.ts`

## Implementation requirements

- Replace brittle Clerk-internal CSS class checks with a stable supported component marker.
- Allow enough time for Clerk's hosted frontend to initialize in CI, while still failing if the expected component never renders.
- Keep `setupClerkTestingToken()` before navigation and `clerk.loaded()` as part of setup.
- Do not change application authentication behavior or GitHub Actions secrets.
- Do not add credentials or expose environment variable values in diagnostics.

## Security requirements

- Never print Clerk keys, testing tokens, or user credentials.
- Keep the tests connected to the existing development Clerk instance and preserve signed-out state isolation.

## Acceptance criteria

- Firefox sign-in and sign-up UI tests pass reliably on repeated runs.
- The tests still fail if the corresponding Clerk component does not render.
- Other auth tests and the existing signed-in/signed-out isolation remain unchanged.

## Checks to run

- `npx playwright test tests/clerk-auth.spec.ts --project=firefox --grep "sign-(in|up) page renders" --repeat-each=3`
- `npm run lint`
- `npm run typecheck`

## Exact manual test steps

1. Ensure `.env.local` contains the existing development Clerk publishable and secret keys; do not paste or commit their values.
2. From the project root, run `npx playwright test tests/clerk-auth.spec.ts --project=firefox --grep "sign-(in|up) page renders" --repeat-each=3`.
3. Confirm all repeated Firefox sign-in/sign-up cases pass and that the Clerk UI is visible.
4. If a case still fails, inspect the Playwright HTML report and `test-results/` artifacts for browser console/network errors without sharing secret values.
