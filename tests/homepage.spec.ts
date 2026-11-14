import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Homepage", () => {
  test("renders Top News cards", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !/Failed to load resource/i.test(message.text())) {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("heading", { name: "Top News" })).toBeVisible();
    const cardCount = await page.getByTestId("news-card").count();
    expect(cardCount).toBeGreaterThanOrEqual(12);

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

test.describe("Theme toggle", () => {
  test("switches homepage between light and dark", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.addInitScript(() => localStorage.removeItem("biasly-theme"));
    await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Dark" }).click();
    await expect.poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    ).toBe(true);
    expect(await page.evaluate(() => localStorage.getItem("biasly-theme"))).toBe("dark");

    await page.getByRole("button", { name: "Light" }).click();
    await expect.poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    ).toBe(false);
    expect(await page.evaluate(() => localStorage.getItem("biasly-theme"))).toBe("light");
  });
});