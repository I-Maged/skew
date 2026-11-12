import * as cheerio from "cheerio";

export interface ValidationResult {
  ok: boolean;
  reason?: string;
  article?: {
    title: string;
    url: string;
    canonicalUrl: string | null;
    imageUrl: string;
    publishedAt: string;
    rawText: string;
  };
}

const GENERIC_TITLES = [
  "home",
  "news",
  "world",
  "politics",
  "business",
  "sports",
  "entertainment",
  "technology",
  "health",
  "science",
];

function cleanText(html: string): string {
  const $ = cheerio.load(html);
  // remove scripts/styles/ads/nav/footer/header/aside
  $("script, style, noscript, iframe, nav, footer, header, aside, form").remove();
  // remove common junk blocks
  $("[class*='ad'], [class*='sponsor'], [class*='newsletter'], [class*='subscribe'], [class*='related'], [class*='most-viewed'], [class*='share'], [id*='ad']").remove();

  // Try article body selectors
  const selectors = ["article", "main", "[role='main']", ".article-body", ".story-body", ".post-content"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let container: any = null;
  for (const sel of selectors) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = $(sel).first();
    if (c.length && c.text().trim().length > 200) {
      container = c;
      break;
    }
  }
  const root = container ?? $("body");

  const paragraphs: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  root.find("p, h1, h2, h3, li").each((_: number, el: any) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (t.length >= 40) paragraphs.push(t);
  });

  // fallback: split big text blocks
  if (paragraphs.length === 0) {
    const txt = root.text().replace(/\s+/g, " ").trim();
    if (txt.length >= 900) paragraphs.push(txt);
  }

  // dedupe
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const p of paragraphs) {
    if (seen.has(p)) continue;
    seen.add(p);
    unique.push(p);
  }
  return unique.join("\n\n");
}

function extractTitle($: cheerio.CheerioAPI): string {
  const og = $('meta[property="og:title"]').attr("content");
  if (og && og.trim()) return og.trim();
  const h1 = $("h1").first().text().trim();
  if (h1) return h1;
  const t = $("title").first().text().trim();
  return t;
}

function extractImage($: cheerio.CheerioAPI): string | null {
  const og = $('meta[property="og:image"]').attr("content");
  if (og && og.trim()) return og.trim();
  const tw = $('meta[name="twitter:image"]').attr("content");
  if (tw && tw.trim()) return tw.trim();
  const img = $("article img, main img").first().attr("src");
  if (img && img.trim()) {
    try {
      return new URL(img.trim(), "https://example.com").toString();
    } catch {
      return img.trim();
    }
  }
  return null;
}

function extractPublished($: cheerio.CheerioAPI): string | null {
  const candidates = [
    $('meta[property="article:published_time"]').attr("content"),
    $('meta[name="pubdate"]').attr("content"),
    $('meta[name="publish-date"]').attr("content"),
    $('meta[name="date"]').attr("content"),
    $("time[datetime]").first().attr("datetime"),
  ];
  for (const c of candidates) {
    if (c && c.trim()) {
      const d = new Date(c.trim());
      if (!isNaN(d.getTime())) return d.toISOString();
    }
  }
  return null;
}

function extractCanonical($: cheerio.CheerioAPI, fallback: string): string {
  const link = $('link[rel="canonical"]').attr("href");
  if (link && link.trim()) {
    try {
      return new URL(link.trim(), fallback).toString();
    } catch {
      return link.trim();
    }
  }
  return fallback;
}

export function validateArticleDetail(
  url: string,
  html: string,
): ValidationResult {
  const $ = cheerio.load(html);
  const title = extractTitle($);
  const imageUrl = extractImage($);
  const publishedAt = extractPublished($);
  const canonicalUrl = extractCanonical($, url);
  const rawText = cleanText(html);

  // Reject generic titles
  const lowerTitle = title.toLowerCase().trim();
  if (!title || title.length < 10) {
    return { ok: false, reason: "title too short or missing" };
  }
  if (GENERIC_TITLES.includes(lowerTitle)) {
    return { ok: false, reason: "generic title" };
  }

  if (!imageUrl) {
    return { ok: false, reason: "missing image url" };
  }
  if (!publishedAt) {
    return { ok: false, reason: "missing published date" };
  }

  // canonical must not point to listing/category/program/product page
  if (canonicalUrl && /\/(category|section|topic|tag|show|program|podcast|product|shop)\b/i.test(canonicalUrl)) {
    return { ok: false, reason: "canonical points to non-article page" };
  }

  // body quality gate
  const paragraphs = rawText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const meaningfulChars = rawText.replace(/\s+/g, "").length;
  const bodyOk = paragraphs.length >= 3 || (meaningfulChars >= 900 && title.length >= 10);
  if (!bodyOk) {
    return { ok: false, reason: "insufficient body content" };
  }

  // url must be article-specific (not homepage)
  try {
    const u = new URL(url);
    if (u.pathname === "/" || u.pathname === "") {
      return { ok: false, reason: "url is homepage" };
    }
  } catch {
    return { ok: false, reason: "invalid url" };
  }

  return {
    ok: true,
    article: {
      title,
      url,
      canonicalUrl,
      imageUrl,
      publishedAt,
      rawText,
    },
  };
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
