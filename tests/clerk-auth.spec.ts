import { expect, test } from "@playwright/test";
import {
  clerk,
  setupClerkTestingToken,
} from "@clerk/testing/playwright";
import { authenticatedStatePath } from "./auth-helpers";

test.describe("Signed-out Clerk authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("homepage is public and shows Login when signed out", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("protected news route redirects signed-out users", async ({ page }) => {
    await page.goto("/news/trump-iran-proposal", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForURL(/\/sign-in/);
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("sign-in page renders Clerk UI", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
    await clerk.loaded({ page });
    await expect(page.locator(".cl-signIn-root")).toBeVisible();
  });

  test("sign-up page renders Clerk UI", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/sign-up", { waitUntil: "domcontentloaded" });
    await clerk.loaded({ page });
    await expect(page.locator(".cl-signUp-root")).toBeVisible();
  });
});

test.describe("Signed-in Clerk authentication", () => {
  test.use({
    storageState: process.env.E2E_CLERK_USER_EMAIL
      ? authenticatedStatePath
      : undefined,
  });

  test("signed-in user can open a protected news page", async ({ page }) => {
    test.skip(
      !process.env.E2E_CLERK_USER_EMAIL,
      "E2E credentials are not configured",
    );

    await page.goto("/news/trump-iran-proposal", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("heading", {
        name: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
      }),
    ).toBeVisible();
  });
});