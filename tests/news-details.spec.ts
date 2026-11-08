import { expect, test } from "@playwright/test";
import { authenticatedStatePath } from "./auth-helpers";

const hasCredentials =
  !!process.env.E2E_CLERK_USER_EMAIL;

const url = "/news/trump-iran-proposal";

test.describe("News details page", () => {
  test.use({
    storageState: hasCredentials ? authenticatedStatePath : undefined,
  });

  test.beforeEach(() => {
    test.skip(!hasCredentials, "E2E credentials are not configured");
  });

  test("renders article title and core sections", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto(url, { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        name: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
      }),
    ).toBeVisible();
    await expect(page.getByTestId("bias-distribution")).toBeVisible();
    await expect(page.getByTestId("related-story-card")).toHaveCount(6);

    expect(consoleErrors).toEqual([]);
  });

  test("desktop uses two-column layout", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("article-column")).toBeVisible();
    await expect(page.getByTestId("sidebar")).toBeVisible();

    const articleX = await page
      .getByTestId("article-column")
      .evaluate((element) => element.getBoundingClientRect().x);
    const sidebarX = await page
      .getByTestId("sidebar")
      .evaluate((element) => element.getBoundingClientRect().x);

    expect(sidebarX).toBeGreaterThan(articleX);
  });

  test("related stories grid uses expected columns", async ({ page }) => {
    const cases = [
      { width: 1280, expected: 2 },
      { width: 768, expected: 2 },
      { width: 375, expected: 1 },
    ];

    for (const item of cases) {
      await page.setViewportSize({ width: item.width, height: 900 });
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const columnCount = await page
        .getByTestId("related-stories-grid")
        .evaluate(
          (element) => {
            const template = getComputedStyle(element).gridTemplateColumns;
            const repeatedColumns = /^repeat\((\d+),/.exec(template);

            return repeatedColumns
              ? Number(repeatedColumns[1])
              : template.trim().split(/\s+/).length;
          },
        );

      expect(columnCount).toBe(item.expected);
    }
  });

  test("main layout stacks on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("article-column")).toBeVisible();
    await expect(page.getByTestId("sidebar")).toBeVisible();

    const articleY = await page
      .getByTestId("article-column")
      .evaluate((element) => element.getBoundingClientRect().y);
    const sidebarY = await page
      .getByTestId("sidebar")
      .evaluate((element) => element.getBoundingClientRect().y);

    expect(sidebarY).toBeGreaterThan(articleY);
  });
});