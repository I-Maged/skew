import { test, expect } from "@playwright/test";

test.describe("candidate url filtering", () => {
  test("rejects non-article paths", async () => {
    const { isArticleUrl } = await import("../lib/oxylabs/parsers");
    expect(isArticleUrl("reuters", "https://www.reuters.com/world/")).toBe(false);
    expect(isArticleUrl("reuters", "https://www.reuters.com/search?q=foo")).toBe(false);
  });
});
