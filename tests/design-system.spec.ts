import { expect, test, type Page } from "@playwright/test";

type Viewport = { width: number; height: number };

const viewports: Record<string, Viewport> = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

async function waitForDesignSystem(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  // Firefox can stall indefinitely on document.fonts.ready when the system
  // font set does not resolve; bound that wait so tests fail fast on real
  // regressions instead of hanging for 30s.
  await page.evaluate(
    () =>
      Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => setTimeout(resolve, 5000)),
      ]),
  );
  await page.waitForTimeout(300);
}

test.describe("Design system smoke", () => {
  test("renders core sections", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto("/");
    await waitForDesignSystem(page);

    await expect(page.getByTestId("utility-bar")).toBeVisible();
    await expect(page.getByTestId("header")).toBeVisible();
    await expect(page.getByTestId("category-nav")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Top News" })).toBeVisible();
    await expect(page.getByTestId("news-card")).toHaveCount(3);
    await expect(page.getByTestId("footer")).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("renders bias meter and token reference", async ({ page }) => {
    await page.goto("/");
    await waitForDesignSystem(page);

    await expect(page.getByTestId("bias-meter").first()).toBeVisible();
    await expect(page.getByTestId("token-reference")).toBeVisible();
    await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
  });
});

test.describe("Theme toggle", () => {
  test("persists selected theme after reload", async ({ page }) => {
    await page.goto("/");
    await waitForDesignSystem(page);

    await page.getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await waitForDesignSystem(page);
    await expect(page.locator("html")).toHaveClass(/dark/);

    const stored = await page.evaluate(() =>
      localStorage.getItem("biasly-theme"),
    );
    expect(stored).toBe("dark");

    await page.getByRole("button", { name: "Light" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("auto follows system preference", async ({ context, page }) => {
    await context.addInitScript(() => {
      localStorage.setItem("biasly-theme", "auto");
    });
    await page.emulateMedia({ colorScheme: "dark" });

    await page.goto("/");
    await waitForDesignSystem(page);

    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

for (const [name, viewport] of Object.entries(viewports)) {
  test.describe(`Responsive layout - ${name}`, () => {
    test.use({ viewport });

    test(`news grid uses expected columns`, async ({ page }) => {
      await page.goto("/");
      await waitForDesignSystem(page);

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

    test(`core sections render`, async ({ page }) => {
      await page.goto("/");
      await waitForDesignSystem(page);

      await expect(page.getByTestId("header")).toBeVisible();
      await expect(page.getByTestId("news-card").first()).toBeVisible();
      await expect(page.getByTestId("footer")).toBeVisible();
    });
  });
}

test.describe("Visual snapshots", () => {
  const cases: { name: string; viewport: Viewport; dark: boolean }[] = [
    { name: "desktop", viewport: viewports.desktop, dark: false },
    { name: "desktop", viewport: viewports.desktop, dark: true },
    { name: "tablet", viewport: viewports.tablet, dark: false },
    { name: "tablet", viewport: viewports.tablet, dark: true },
    { name: "mobile", viewport: viewports.mobile, dark: false },
    { name: "mobile", viewport: viewports.mobile, dark: true },
  ];

  for (const testCase of cases) {
    test(`${testCase.name} ${testCase.dark ? "dark" : "light"}`, async ({
      page,
    }) => {
      await page.setViewportSize(testCase.viewport);

      if (testCase.dark) {
        await page.addInitScript(() => {
          localStorage.setItem("biasly-theme", "dark");
        });
      }

      await page.goto("/");
      await waitForDesignSystem(page);

      const snapshotName = `design-system-${testCase.name}-${testCase.dark ? "dark" : "light"}.png`;
      await expect(page).toHaveScreenshot(snapshotName, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
        animations: "disabled",
      });
    });
  }
});
