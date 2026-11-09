import "server-only";

import { createSupabaseServerClient } from "../server";
import type { HomeStory } from "@/components/home/home-news-card";

type Tables = import("../types").Database["public"]["Tables"];
type ArticleRow = Tables["articles"]["Row"];
type SourceRow = Tables["sources"]["Row"];
type AnalysisRow = Tables["article_analyses"]["Row"];

interface ArticleRelationRow extends ArticleRow {
  sources?: SourceRow | SourceRow[] | null;
  article_analyses?: AnalysisRow | AnalysisRow[] | null;
}

export interface HomepageArticle {
  id: string;
  slug: string;
  sourceId: string;
  sourceName: string;
  url: string;
  title: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
  location: string;
  sourcesCount: number;
  perspective: {
    left: number;
    center: number;
    right: number;
  };
}

export interface ArticleDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  publishedAt: string;
  sourceName: string;
  sourcesCount: number;
  url: string;
  paragraphs: string[];
  perspective: {
    left: number;
    center: number;
    right: number;
  };
  biasScore: number;
  biasLabel: string;
  sentimentScore: number;
  sentimentLabel: string;
  confidence: number;
  summary: string;
  summaryBullets: string[];
  framingNotes: string[];
  loadedTerms: string[];
  disclaimer: string;
  modelName: string;
}

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : null;
  }

  return value ?? null;
}

function slugForArticle(row: ArticleRow): string {
  if (row.slug && row.slug.trim().length > 0) {
    return row.slug;
  }

  return row.id;
}

function mapHomepageArticle(row: ArticleRelationRow): HomepageArticle {
  const source = firstOrNull(row.sources);
  const analysis = firstOrNull(row.article_analyses);

  return {
    id: row.id,
    slug: slugForArticle(row),
    sourceId: row.source_id,
    sourceName: source?.name ?? "Unknown source",
    url: row.url,
    title: row.title,
    imageUrl: row.image_url,
    publishedAt: row.published_at,
    category: row.category,
    location: row.location,
    sourcesCount: row.sources_count,
    perspective: {
      left: analysis?.left_percentage ?? 0,
      center: analysis?.center_percentage ?? 0,
      right: analysis?.right_percentage ?? 0,
    },
  };
}

export async function listHomepageArticles(options?: {
  limit?: number;
}): Promise<HomepageArticle[]> {
  const client = createSupabaseServerClient();
  const limit = Math.min(Math.max(options?.limit ?? 24, 1), 100);

  const { data, error } = await client
    .from("articles")
    .select(
      "id, source_id, url, title, slug, image_url, published_at, category, location, sources_count, raw_text, sources ( name ), article_analyses ( left_percentage, center_percentage, right_percentage )",
    )
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load articles: ${error.message}`);
  }

  return ((data ?? []) as ArticleRelationRow[]).map(mapHomepageArticle);
}

export async function listArticles(options?: {
  limit?: number;
}): Promise<HomepageArticle[]> {
  return listHomepageArticles(options);
}

export function toHomeStory(article: HomepageArticle): HomeStory {
  return {
    category: article.category,
    location: article.location,
    title: article.title,
    image: article.imageUrl,
    sources: article.sourcesCount,
    perspective: article.perspective,
  };
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  if (!slug) {
    return null;
  }

  const client = createSupabaseServerClient();

  let data: ArticleRelationRow | null = null;
  let error: { message: string } | null = null;

  const bySlug = await client
    .from("articles")
    .select(
      "id, source_id, url, title, slug, image_url, published_at, category, location, sources_count, raw_text, sources ( name ), article_analyses ( summary, sentiment_score, sentiment_label, bias_score, bias_label, left_percentage, center_percentage, right_percentage, confidence, framing_notes, loaded_terms, disclaimer, model )",
    )
    .eq("slug", slug)
    .maybeSingle();

  data = bySlug.data as ArticleRelationRow | null;
  error = bySlug.error;

  if (!data && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
    const byId = await client
      .from("articles")
      .select(
        "id, source_id, url, title, slug, image_url, published_at, category, location, sources_count, raw_text, sources ( name ), article_analyses ( summary, sentiment_score, sentiment_label, bias_score, bias_label, left_percentage, center_percentage, right_percentage, confidence, framing_notes, loaded_terms, disclaimer, model )",
      )
      .eq("id", slug)
      .maybeSingle();

    data = byId.data as ArticleRelationRow | null;
    error = byId.error;
  }

  if (error) {
    throw new Error(`Failed to load article: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const source = firstOrNull(data.sources);
  const analysis = firstOrNull(data.article_analyses);
  const paragraphs = data.raw_text
    ? data.raw_text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : ["Seeded display article."];

  const summary =
    analysis?.summary?.trim() || data.title;

  return {
    id: data.id,
    slug: slugForArticle(data),
    title: data.title,
    category: data.category,
    location: data.location,
    imageUrl: data.image_url,
    publishedAt: new Date(data.published_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    sourceName: source?.name ?? "Unknown source",
    sourcesCount: data.sources_count,
    url: data.url,
    paragraphs,
    perspective: {
      left: analysis?.left_percentage ?? 0,
      center: analysis?.center_percentage ?? 0,
      right: analysis?.right_percentage ?? 0,
    },
    biasScore: analysis?.bias_score ?? 0,
    biasLabel: analysis?.bias_label ?? "unclear",
    sentimentScore: analysis?.sentiment_score ?? 0,
    sentimentLabel: analysis?.sentiment_label ?? "neutral",
    confidence: analysis?.confidence ?? 0,
    summary,
    summaryBullets:
      analysis?.framing_notes && analysis.framing_notes.length > 0
        ? analysis.framing_notes
        : [summary],
    framingNotes: analysis?.framing_notes ?? [],
    loadedTerms: analysis?.loaded_terms ?? [],
    disclaimer:
      analysis?.disclaimer ?? "AI-estimated framing. Not an objective truth.",
    modelName: analysis?.model ?? "seed",
  };
}