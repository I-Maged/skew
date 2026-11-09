import { expect, test } from "@playwright/test";

test.describe("Supabase read routes", () => {
  test("sources route returns the seeded source", async ({ request }) => {
    const response = await request.get("/api/sources");
    expect(response.ok()).toBeTruthy();

    const sources = (await response.json()) as Array<{ name: string }>;
    expect(Array.isArray(sources)).toBe(true);
    expect(sources.some((source) => source.name === "Biasly Seed Source (Display Only)")).toBe(true);
  });

  test("articles route returns 12 seeded stories", async ({ request }) => {
    const response = await request.get("/api/articles");
    expect(response.ok()).toBeTruthy();

    const articles = (await response.json()) as Array<{ title: string }>;
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBe(12);
  });
});