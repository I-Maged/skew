import { test, expect } from "@playwright/test";

// Unit-level tests for pipeline helpers are exercised via direct module imports
// through a small node test harness. Playwright isn't the right tool, so we
// keep a smoke test here that the routes load.

test.describe("scrape routes", () => {
  test("scrape route rejects missing admin secret", async ({ request }) => {
    const response = await request.post("/api/scrape", { data: {} });
    expect(response.status()).toBe(401);
  });

  test("oxylabs schedules route rejects missing admin secret", async ({ request }) => {
    const response = await request.post("/api/oxylabs/schedules", { data: {} });
    expect(response.status()).toBe(401);
  });

  test("scheduled-results process route rejects missing admin secret", async ({ request }) => {
    const response = await request.post("/api/oxylabs/scheduled-results/process", { data: {} });
    expect(response.status()).toBe(401);
  });
});
