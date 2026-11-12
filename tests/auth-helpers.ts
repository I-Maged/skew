import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { expect, type BrowserContext, type Page } from "@playwright/test";

const SESSION_COOKIE = "__session";
const CLIENT_UAT_COOKIE = "__client_uat";

/**
 * Appends Clerk's testing token to Frontend API requests made from this browser
 * context, so a session refresh is not rejected by Clerk's bot protection.
 */
export async function bypassClerkBotProtection(page: Page) {
  await setupClerkTestingToken({ page });
}

/**
 * Clerk writes __session and __client_uat from client code during setActive(),
 * and clerk.signIn() resolves as soon as the client user exists. A context with
 * __session but no __client_uat makes the middleware start a
 * "session-token-but-no-client-uat" handshake, which is the slow path that ends
 * up redirecting protected routes to /sign-in. Wait for the complete cookie
 * pair before the session is reused, saved, or navigated with.
 */
export async function waitForClerkSession(context: BrowserContext) {
  await expect
    .poll(
      async () => {
        const cookies = await context.cookies();
        const hasSession = cookies.some(
          (cookie) => cookie.name === SESSION_COOKIE && cookie.value.length > 0,
        );
        const clientUat = cookies.find(
          (cookie) => cookie.name === CLIENT_UAT_COOKIE,
        );

        return hasSession && Boolean(clientUat?.value) && clientUat?.value !== "0";
      },
      { timeout: 30_000, message: "Clerk session cookies did not settle" },
    )
    .toBe(true);
}

export async function signIn(page: Page) {
  const email = process.env.E2E_CLERK_USER_EMAIL;

  if (!email) {
    throw new Error("E2E Clerk credentials are not configured");
  }

  await bypassClerkBotProtection(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await clerk.signIn({ page, emailAddress: email });
  await waitForClerkSession(page.context());
}
