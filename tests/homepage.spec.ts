import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders Top News with 12 cards", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("heading", { name: "Top News" })).toBeVisible();
    await expect(page.getByTestId("news-card")).toHaveCount(12);

    expect(consoleErrors).toEqual([]);
  });

  const viewports = {
    desktop: { width: 1280, height: 800 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 812 },
  };

  for (const [name, viewport] of Object.entries(viewports)) {
    test(`grid uses expected columns on ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      const expectedColumns =
        name === "desktop" ? 3 : name === "tablet" ? 2 : 1;

      const columnCount = await page
        .getByTestId("news-grid")
        .evaluate((element) =>
          getComputedStyle(element)
            .gridTemplateColumns.split(" ")
            .filter(Boolean).length,
        );

      expect(columnCount).toBe(expectedColumns);
    });
  }
});