import "server-only";

import { listActiveSources, existingArticleUrls, insertArticle } from "@/lib/supabase/queries/oxylabs";
import type { SourceRecord } from "@/lib/pipeline/types";
import type { PipelineOptions, RunSummary } from "@/lib/pipeline/types";
import { extractCandidateLinks, isArticleUrl, normalizeUrl } from "@/lib/oxylabs/parsers";
import { validateArticleDetail, slugify } from "@/lib/pipeline/validate";
import { scrapeUrl } from "@/lib/oxylabs/client";

function log(msg: string, meta?: Record<string, unknown>) {
  if (meta) console.log(`[scrape] ${msg}`, meta);
  else console.log(`[scrape] ${msg}`);
}

export async function runScrapePipeline(options: PipelineOptions = {}): Promise<RunSummary> {
  const started = Date.now();
  const perSourceLimit = options.perSourceLimit ?? 5;
  const summary: RunSummary = {
    status: "completed",
    sourcesChecked: 0,
    candidatesFound: 0,
    candidatesRejected: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    totalDurationMs: 0,
    rejectionReasons: {},
  };

  const rejectionReasons: Record<string, number> = {};

  function bumpReason(reason: string) {
    rejectionReasons[reason] = (rejectionReasons[reason] ?? 0) + 1;
  }

  try {
    log("scrape started");
    const allSources = await listActiveSources();
    let sources: SourceRecord[] = allSources;
    if (options.sourceIds && options.sourceIds.length > 0) {
      const set = new Set(options.sourceIds);
      sources = allSources.filter((s) => set.has(s.id));
    }
    log("selected sources", { count: sources.length, names: sources.map((s) => s.name) });

    for (const source of sources) {
      summary.sourcesChecked += 1;
      log("per-source start", { source: source.name });
      try {
        let html: string | null = null;
        if (options.homepageHtmlProvider) {
          html = await options.homepageHtmlProvider(source);
        } else {
          html = await scrapeUrl(source.listingUrl);
        }
        if (!html) {
          log("homepage fetch failed", { source: source.name });
          continue;
        }
        log("homepage fetched", { source: source.name });

        const candidatesRaw = extractCandidateLinks(source.parserStrategy, source.listingUrl, html);
        const kept: string[] = [];
        for (const c of candidatesRaw) {
          const n = normalizeUrl(c);
          if (isArticleUrl(source.parserStrategy, n)) {
            kept.push(n);
          } else {
            summary.candidatesRejected += 1;
            bumpReason("candidate url rejected");
          }
        }
        const unique = Array.from(new Set(kept));
        const capped = unique.slice(0, perSourceLimit * 3);
        summary.candidatesFound += capped.length;
        log("candidate links found", { source: source.name, count: capped.length });

        const existing = await existingArticleUrls(capped);
        const toScrape: string[] = [];
        for (const u of capped) {
          if (existing.has(u)) {
            summary.duplicatesSkipped += 1;
          } else {
            toScrape.push(u);
          }
        }
        log("duplicates skipped", { source: source.name, count: summary.duplicatesSkipped });

        let insertedThisSource = 0;
        for (const articleUrl of toScrape) {
          if (insertedThisSource >= perSourceLimit) break;
          summary.detailPagesScraped += 1;
          try {
            const detailHtml = await scrapeUrl(articleUrl);
            const result = validateArticleDetail(articleUrl, detailHtml);
            if (!result.ok || !result.article) {
              summary.articlesRejected += 1;
              bumpReason(result.reason ?? "validation failed");
              log("article rejected after validation", { url: articleUrl, reason: result.reason });
              continue;
            }
            const art = result.article;
            const slug = slugify(art.title);
            await insertArticle({
              sourceId: source.id,
              url: art.url,
              canonicalUrl: art.canonicalUrl,
              title: art.title,
              slug,
              imageUrl: art.imageUrl,
              publishedAt: art.publishedAt,
              rawText: art.rawText,
            });
            summary.articlesInserted += 1;
            insertedThisSource += 1;
            log("article inserted", { url: art.url });
          } catch (err) {
            summary.articlesFailed += 1;
            bumpReason("detail scrape failed");
            log("article failed", { url: articleUrl, error: err instanceof Error ? err.message : String(err) });
          }
        }
      } catch (err) {
        log("source-level error", { source: source.name, error: err instanceof Error ? err.message : String(err) });
      }
    }

    summary.rejectionReasons = rejectionReasons;
    summary.totalDurationMs = Date.now() - started;
    log("scrape completed", { summary });
    return summary;
  } catch (err) {
    summary.status = "failed";
    summary.error = err instanceof Error ? err.message : String(err);
    summary.rejectionReasons = rejectionReasons;
    summary.totalDurationMs = Date.now() - started;
    log("scrape failed", { error: summary.error });
    return summary;
  }
}
