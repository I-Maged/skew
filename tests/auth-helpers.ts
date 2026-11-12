import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { type Page } from "@playwright/test";

/**
 * Appends Clerk's testing token to Frontend API requests made from this browser
 * context. A restored session must refresh itself once its 60 second session
 * token expires, and that refresh is subject to Clerk's bot protection without
 * the testing token.
 */
export async function bypassClerkBotProtection(page: Page) {
  await setupClerkTestingToken({ page });
}

export async function signIn(page: Page) {
  const email = process.env.E2E_CLERK_USER_EMAIL;

  if (!email) {
    throw new Error("E2E Clerk credentials are not configured");
  }

  await bypassClerkBotProtection(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await clerk.signIn({ page, emailAddress: email });
}
