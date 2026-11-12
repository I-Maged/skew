import { clerkSetup } from "@clerk/testing/playwright";
import { expect, test as setup } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { authenticatedStatePath, signIn } from "./auth-helpers";

setup.describe.configure({ mode: "serial" });

setup("global setup", async ({ page }) => {
  await clerkSetup();

  if (!process.env.E2E_CLERK_USER_EMAIL) {
    return;
  }

  await signIn(page);
  await page.goto("/news/trump-iran-proposal", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByRole("heading", {
      name: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    }),
  ).toBeVisible();

  await mkdir(path.dirname(authenticatedStatePath), { recursive: true });
  await page.context().storageState({ path: authenticatedStatePath });
});