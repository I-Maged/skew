import { clerkSetup } from "@clerk/testing/playwright";
import { expect, test as setup } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { authenticatedStatePath } from "./auth-state";
import { signIn } from "./auth-helpers";

const protectedUrl = "/news/trump-iran-proposal";
const protectedHeading =
  "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report";

setup.describe.configure({ mode: "serial" });

setup("global setup", async ({ page, browser, browserName, baseURL }) => {
  await clerkSetup();

  if (!process.env.E2E_CLERK_USER_EMAIL) {
    return;
  }

  const context = page.context();

  await signIn(page);

  // Clerk signs in with setActive() and the app then navigates itself to the
  // after-sign-in URL. Check the protected page on a separate page of the same
  // context so that pending client-side navigation cannot interrupt it.
  const signedInPage = await context.newPage();

  try {
    await signedInPage.goto(protectedUrl, { waitUntil: "domcontentloaded" });
    await expect(
      signedInPage.getByRole("heading", { name: protectedHeading }),
    ).toBeVisible();
  } finally {
    await signedInPage.close();
  }

  const statePath = authenticatedStatePath(browserName);
  await mkdir(path.dirname(statePath), { recursive: true });
  await context.storageState({ path: statePath });

  // Prove the written state authenticates a fresh context of this browser
  // before any test project consumes it, so a broken auth handoff fails here
  // with a clear message instead of as page-level assertion failures.
  const restoredContext = await browser.newContext({
    baseURL,
    storageState: statePath,
  });

  try {
    const restoredPage = await restoredContext.newPage();
    await restoredPage.goto(protectedUrl, { waitUntil: "domcontentloaded" });

    if (restoredPage.url().includes("/sign-in")) {
      throw new Error(
        `Saved ${browserName} auth state did not authenticate a fresh context: redirected to ${restoredPage.url()}`,
      );
    }

    await expect(
      restoredPage.getByRole("heading", { name: protectedHeading }),
    ).toBeVisible();
  } finally {
    await restoredContext.close();
  }
});
