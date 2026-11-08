# Fix Playwright Snapshot Update Workflow

## Goal

Make the manually dispatched snapshot-update workflow work on both branches with and without Clerk-backed pages, and avoid failing when no snapshot files changed.

## Skills read

- Previously loaded Playwright CLI guidance.
- Previously loaded Clerk testing guidance.

## Existing code and evidence inspected

- `.github/workflows/playwright-update-snapshots.yml`
- `.github/workflows/playwright.yml`
- `playwright.config.ts`
- `.gitignore`
- Existing tracked Playwright snapshots under `tests/`
- GitHub Actions runs `42505429710` (`main`) and `42505140901` (`clerk-auth`)

Observed:

- The `main` run completed all 72 tests successfully, but `git add "tests/*-snapshots"` failed because Git treated the quoted wildcard as a pathspec that did not match the files within the snapshot directory.
- The `clerk-auth` run repeatedly reported missing Clerk keys from Next.js, then timed out waiting for the Playwright `webServer`.
- The regular Playwright workflow writes Clerk repository secrets into `.env.local`; the snapshot workflow does not.

## Decisions or assumptions

- Reuse the same Clerk secret names and non-secret Clerk URL configuration already used in `.github/workflows/playwright.yml`.
- The manually dispatched workflow should use GitHub Actions Secrets, not committed or hardcoded credentials.
- The workflow should still succeed when snapshot generation produces no changes.
- Since the checkout is clean and Playwright's update command changes snapshots rather than test source, staging the `tests/` tree is acceptable and avoids fragile glob pathspecs.

## Files likely to change

- `.github/workflows/playwright-update-snapshots.yml`

## Implementation requirements

1. Add a workflow step that creates `.env.local` for the Playwright web server using `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from repository secrets.
2. Set `CLERK_PUBLISHABLE_KEY` from the publishable key and include the same sign-in/sign-up and redirect URL settings as the regular Playwright workflow.
3. Keep secrets in the step's environment and do not echo or otherwise print their values.
4. Replace the failing quoted snapshot pathspec with robust staging of generated test snapshot updates.
5. Preserve the existing no-changes behavior: if the index has no staged changes, report that and exit successfully without attempting a commit.
6. Preserve the Ubuntu runner, Node setup, browser installation, workflow dispatch trigger, commit identity, and push behavior.

## Security requirements

- Do not add credentials to workflow literals, source files, snapshots, or logs.
- Use only GitHub repository secrets for Clerk keys.
- Do not grant additional workflow permissions beyond the existing `contents: write`.

## Acceptance criteria

- The workflow can start Next.js on branches that require Clerk keys.
- The existing missing-key `webServer` timeout is resolved when the two Clerk secrets are configured.
- The commit step stages snapshot changes without relying on the non-matching `tests/*-snapshots` pathspec.
- A run with no snapshot changes exits successfully and does not create an empty commit.
- No unrelated test or application files are changed.

## Checks to run

- Review the workflow YAML and compare the environment setup with `.github/workflows/playwright.yml`.
- Verify the Git staging command matches the tracked snapshot layout and safely handles no changes.
- Run `npm run typecheck` and `npm run lint` only if workflow-related repository checks or changed files warrant them; no application code is expected to change.
- GitHub-hosted Playwright execution remains the definitive end-to-end verification for workflow behavior.

## Exact manual test steps

1. Ensure repository Actions secrets `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` exist.
2. Open **Actions → Update Playwright Snapshots → Run workflow** and choose the target branch.
3. Confirm the `Update snapshots` step starts and completes without Clerk key errors or a `webServer` timeout.
4. If screenshots changed, confirm the commit contains the updated files under `tests/*-snapshots/`; if they did not, confirm the workflow reports no changes and completes successfully.
