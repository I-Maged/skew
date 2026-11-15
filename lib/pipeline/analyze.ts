import "server-only";

import { generateText, Output } from "ai";
import { embed } from "ai";
import { z } from "zod";

import { getAnalysisModel, getEmbeddingModel, ANALYSIS_MODEL_ID } from "@/lib/ai/openrouter";
import { AnalysisOutputSchema } from "@/lib/pipeline/analysis-schema";
import {
  listPendingAnalysisArticles,
  getAnalysisByArticleId,
  upsertAnalysis,
  setAnalyzedAt,
} from "@/lib/supabase/queries/articles";

export interface AnalysisSummary {
  analyzed: number;
  skipped: number;
  failed: number;
  totalDurationMs?: number;
}

function log(msg: string, meta?: Record<string, unknown>) {
  if (meta) console.log(`[analyze] ${msg}`, meta);
  else console.log(`[analyze] ${msg}`);
}

const DEFAULT_BATCH_SIZE = 5;

function getBatchSize(override?: number) {
  if (override && override > 0) return override;
  const env = process.env.ANALYSIS_BATCH_SIZE;
  const n = env ? Number(env) : NaN;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_BATCH_SIZE;
}

function buildPrompt(title: string, rawText: string): string {
  const body = rawText.trim().slice(0, 12000);
  return [
    "Analyze the following news article and return structured JSON per the schema.",
    "Framing must be AI-estimated based on article text evidence only, not source name.",
    "Percentages left/center/right must sum to 100.",
    "",
    `Title: ${title}`,
    "",
    "Article text:",
    body || "(no body text available)",
  ].join("\n");
}

async function analyzeOne(article: { id: string; title: string; rawText: string }): Promise<"analyzed" | "skipped" | "failed"> {
  // Backfill path: analysis exists but embedding missing
  const existing = await getAnalysisByArticleId(article.id);
  if (existing && !existing.embedding) {
    try {
      const embeddingResult = await embed({
        model: getEmbeddingModel(),
        value: `${existing.summary ?? ""}\n${article.rawText}`.slice(0, 8000),
      });
      await upsertAnalysis({
        articleId: article.id,
        summary: existing.summary ?? article.title,
        sentimentScore: existing.sentiment_score ?? 0,
        sentimentLabel: (existing.sentiment_label as "positive" | "neutral" | "negative") ?? "neutral",
        biasScore: existing.bias_score ?? 0,
        biasLabel: (existing.bias_label as "left" | "center" | "right" | "mixed" | "unclear") ?? "unclear",
        leftPercentage: existing.left_percentage,
        centerPercentage: existing.center_percentage,
        rightPercentage: existing.right_percentage,
        confidence: existing.confidence ?? 0,
        framingNotes: existing.framing_notes ?? [],
        loadedTerms: existing.loaded_terms ?? [],
        disclaimer: existing.disclaimer ?? "AI-estimated framing. Not an objective truth.",
        model: existing.model ?? ANALYSIS_MODEL_ID,
        embedding: embeddingResult.embedding,
      });
      await setAnalyzedAt(article.id);
      log("embedding backfilled", { articleId: article.id });
      return "analyzed";
    } catch (err) {
      log("embedding backfill failed", { articleId: article.id, error: err instanceof Error ? err.message : String(err) });
      return "failed";
    }
  }

  if (existing) {
    // Already fully analyzed
    return "skipped";
  }

  // Full analysis
  let parsed: z.infer<typeof AnalysisOutputSchema> | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await generateText({
        model: getAnalysisModel(),
        output: Output.object({ schema: AnalysisOutputSchema }),
        prompt: buildPrompt(article.title, article.rawText),
      });
      parsed = result.output;
      break;
    } catch (err) {
      log("generation attempt failed", {
        articleId: article.id,
        attempt: attempt + 1,
        error: err instanceof Error ? err.message : String(err),
      });
      if (attempt === 1) return "failed";
    }
  }
  if (!parsed) return "failed";

  const biasScore = (parsed.rightPercentage - parsed.leftPercentage) / 100;

  let embedding: number[] | null = null;
  try {
    const emb = await embed({
      model: getEmbeddingModel(),
      value: `${parsed.summary}\n${article.rawText}`.slice(0, 8000),
    });
    embedding = emb.embedding;
  } catch (err) {
    log("embedding generation failed", { articleId: article.id, error: err instanceof Error ? err.message : String(err) });
  }

  try {
    await upsertAnalysis({
      articleId: article.id,
      summary: parsed.summary,
      sentimentScore: parsed.sentimentScore,
      sentimentLabel: parsed.sentimentLabel,
      biasScore,
      biasLabel: parsed.biasLabel,
      leftPercentage: parsed.leftPercentage,
      centerPercentage: parsed.centerPercentage,
      rightPercentage: parsed.rightPercentage,
      confidence: parsed.confidence,
      framingNotes: parsed.framingNotes,
      loadedTerms: parsed.loadedTerms,
      disclaimer: parsed.disclaimer,
      model: ANALYSIS_MODEL_ID,
      embedding,
    });
  } catch (err) {
    log("save failed", { articleId: article.id, error: err instanceof Error ? err.message : String(err) });
    return "failed";
  }

  if (embedding) {
    await setAnalyzedAt(article.id);
  } else {
    // analysis saved but embedding missing; leave analyzed_at null so backfill retries
    log("analysis saved without embedding; will retry embedding later", { articleId: article.id });
  }

  log("article analyzed", { articleId: article.id });
  return "analyzed";
}

export async function runPendingAnalysis(options?: {
  limit?: number;
  articleIds?: string[];
  batchSize?: number;
}): Promise<AnalysisSummary> {
  const started = Date.now();
  const summary: AnalysisSummary = { analyzed: 0, skipped: 0, failed: 0 };

  log("analysis started");

  let pending = await listPendingAnalysisArticles();
  if (options?.articleIds && options.articleIds.length > 0) {
    const set = new Set(options.articleIds);
    pending = pending.filter((a) => set.has(a.id));
  }
  if (options?.limit && options.limit > 0) {
    pending = pending.slice(0, options.limit);
  }

  log("pending articles", { count: pending.length });

  const batchSize = getBatchSize(options?.batchSize);
  for (let i = 0; i < pending.length; i += batchSize) {
    const batch = pending.slice(i, i + batchSize);
    log("processing batch", { batch: Math.floor(i / batchSize) + 1, size: batch.length });
    for (const article of batch) {
      try {
        const res = await analyzeOne(article);
        if (res === "analyzed") summary.analyzed += 1;
        else if (res === "skipped") summary.skipped += 1;
        else summary.failed += 1;
      } catch (err) {
        summary.failed += 1;
        log("article failed", { articleId: article.id, error: err instanceof Error ? err.message : String(err) });
      }
    }
    log("batch complete", { analyzed: summary.analyzed, skipped: summary.skipped, failed: summary.failed });
  }

  // Backfill: articles that have analysis but missing embedding are not in pending list (they have analysis row).
  // Handle separately: find them.
  try {
    // backfill handled inside analyzeOne only when reached. To catch embedding-only gaps,
    // query articles with analysis but null embedding:
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const client = createSupabaseServerClient();
    const { data } = await client
      .from("articles")
      .select("id, title, raw_text, article_analyses!inner(embedding)");
    // filter rows where embedding is null
    const gaps: { id: string; title: string; rawText: string }[] = [];
    for (const row of data ?? []) {
      const r = row as { id: string; title: string; raw_text: string | null; article_analyses: { embedding: unknown } | { embedding: unknown }[] };
      const a = Array.isArray(r.article_analyses) ? r.article_analyses[0] : r.article_analyses;
      if (a && !a.embedding) {
        gaps.push({ id: r.id, title: r.title, rawText: r.raw_text ?? "" });
      }
    }
    if (gaps.length > 0) {
      log("embedding backfill gaps", { count: gaps.length });
      for (const g of gaps) {
        try {
          const res = await analyzeOne(g);
          if (res === "analyzed") summary.analyzed += 1;
          else if (res === "failed") summary.failed += 1;
        } catch {
          summary.failed += 1;
        }
      }
    }
  } catch (err) {
    log("backfill scan failed", { error: err instanceof Error ? err.message : String(err) });
  }

  summary.totalDurationMs = Date.now() - started;
  log("analysis completed", { summary });
  return summary;
}