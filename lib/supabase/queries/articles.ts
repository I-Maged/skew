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

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : null;
  }

  return value ?? null;
}

function mapHomepageArticle(row: ArticleRelationRow): HomepageArticle {
  const source = firstOrNull(row.sources);
  const analysis = firstOrNull(row.article_analyses);

  return {
    id: row.id,
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
      "id, source_id, url, title, image_url, published_at, category, location, sources_count, sources ( name ), article_analyses ( left_percentage, center_percentage, right_percentage )",
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