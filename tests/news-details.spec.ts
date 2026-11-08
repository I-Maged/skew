import { expect, test } from "@playwright/test";

const url = "/news/trump-iran-proposal";

test.describe("News details page", () => {
  test("renders article title and core sections", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

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
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    const articleBox = await page.getByTestId("article-column").boundingBox();
    const sidebarBox = await page.getByTestId("sidebar").boundingBox();
    expect(articleBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();
    if (articleBox && sidebarBox) {
      expect(sidebarBox.x).toBeGreaterThan(articleBox.x);
    }
  });

  test("related stories grid uses expected columns", async ({ page }) => {
    const cases = [
      { width: 1280, expected: 2 },
      { width: 768, expected: 2 },
      { width: 375, expected: 1 },
    ];

    for (const item of cases) {
      await page.setViewportSize({ width: item.width, height: 900 });
      await page.goto(url);
      await page.waitForLoadState("domcontentloaded");

      const columnCount = await page
        .getByTestId("related-stories-grid")
        .evaluate((element) =>
          getComputedStyle(element)
            .gridTemplateColumns.split(" ")
            .filter(Boolean).length,
        );

      expect(columnCount).toBe(item.expected);
    }
  });

  test("main layout stacks on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    const articleBox = await page.getByTestId("article-column").boundingBox();
    const sidebarBox = await page.getByTestId("sidebar").boundingBox();
    expect(articleBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();
    if (articleBox && sidebarBox) {
      expect(sidebarBox.y).toBeGreaterThan(articleBox.y);
    }
  });
});