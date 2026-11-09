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

    const articles = (await response.json()) as Array<{ title: string; slug: string }>;
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBe(12);
  });

  test("article route returns the seeded story by slug", async ({ request }) => {
    const response = await request.get("/api/articles/trump-iran-proposal");
    expect(response.ok()).toBeTruthy();

    const article = (await response.json()) as { title: string; slug: string; paragraphs: string[] };
    expect(article.slug).toBe("trump-iran-proposal");
    expect(article.title).toBe("Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report");
    expect(article.paragraphs.length).toBeGreaterThan(1);
  });
});