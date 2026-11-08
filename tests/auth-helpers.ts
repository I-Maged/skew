import { clerk } from "@clerk/testing/playwright";
import { type Page } from "@playwright/test";
import path from "path";

export const authenticatedStatePath = path.resolve(
  __dirname,
  "../playwright/.auth/user.json",
);

export async function signIn(page: Page) {
  const email = process.env.E2E_CLERK_USER_EMAIL;

  if (!email) {
    throw new Error("E2E Clerk credentials are not configured");
  }

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await clerk.signIn({ page, emailAddress: email });
}