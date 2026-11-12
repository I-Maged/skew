import * as cheerio from "cheerio";

const NON_ARTICLE_PATH_PATTERNS = [
  /\/(category|categories|section|sections|topic|topics|tag|tags)\b/i,
  /\/(author|authors|profile)\b/i,
  /\/(search|results)\b/i,
  /\/(show|program|programs|podcast|podcasts)\b/i,
  /\/(live|livestream)\b/i,
  /\/(game|games|scores)\b/i,
  /\/(product|products|shop|shopping|review|reviews)\b/i,
  /\/(about|contact|support|help|privacy|terms|newsletter|subscribe|subscription)\b/i,
  /\/(video|videos)\b/i,
];

function isNonArticlePath(url: string): boolean {
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    if (path === "/" || path === "") return true;
    return NON_ARTICLE_PATH_PATTERNS.some((p) => p.test(path));
  } catch {
    return true;
  }
}

function toAbsolute(href: string, base: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

// Source-specific article URL checks
export function isArticleUrl(sourceStrategy: string | null, url: string): boolean {
  if (isNonArticlePath(url)) return false;
  const strategy = (sourceStrategy ?? "").toLowerCase();
  let pathname = "";
  try {
    pathname = new URL(url).pathname;
  } catch {
    return false;
  }
  // Generic heuristic: prefer long slugs / date paths / ids
  if (strategy === "reuters") {
    // Reuters articles: /YYYY/MM/DD/... or /world/.../<slug>-id/ ; reject section roots
    if (/^\/(world|business|technology|sports|entertainment|politics)\/?$/.test(pathname)) return false;
    return pathname.split("/").filter(Boolean).length >= 2;
  }
  if (strategy === "bbc") {
    if (/\/(sport|news)\/?$/.test(pathname)) return false;
    if (/\/news\/(world|uk|business|technology|science|health)\/?$/.test(pathname)) return false;
    return /\/news\/.+/.test(pathname) || pathname.split("/").filter(Boolean).length >= 2;
  }
  if (strategy === "cnn") {
    if (/\/(world|us|politics|business|health|entertainment|sport|travel)\/?$/.test(pathname)) return false;
    return pathname.split("/").filter(Boolean).length >= 2;
  }
  if (strategy === "globalnews") {
    if (/\/(news|world|politics|business|health|entertainment|sports|money|lifestyle)\/?$/.test(pathname)) return false;
    return pathname.split("/").filter(Boolean).length >= 2;
  }
  // default: at least 2 path segments and not a known non-article
  return pathname.split("/").filter(Boolean).length >= 2;
}

export function extractCandidateLinks(
  sourceStrategy: string | null,
  homepageUrl: string,
  html: string,
): string[] {
  const $ = cheerio.load(html);
  const base = homepageUrl;
  const seen = new Set<string>();
  const out: string[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const abs = toAbsolute(href, base);
    if (!abs) return;
    if (!abs.startsWith("http")) return;
    // same origin only
    try {
      if (new URL(abs).origin !== new URL(base).origin) return;
    } catch {
      return;
    }
    if (isNonArticlePath(abs)) return;
    if (!isArticleUrl(sourceStrategy, abs)) return;
    if (seen.has(abs)) return;
    seen.add(abs);
    out.push(abs);
  });

  return out;
}

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    // drop common tracking params
    const params = u.searchParams;
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach((p) =>
      params.delete(p),
    );
    u.search = params.toString();
    return u.toString();
  } catch {
    return url;
  }
}
