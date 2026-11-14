import "server-only";

export interface SourceRecord {
  id: string;
  name: string;
  listingUrl: string;
  parserStrategy: string | null;
  active: boolean;
  logoUrl: string | null;
}

export interface CandidateFilterResult {
  kept: string[];
  rejected: { url: string; reason: string }[];
}

export interface ArticleInsert {
  sourceId: string;
  url: string;
  canonicalUrl: string | null;
  title: string;
  slug: string;
  imageUrl: string;
  publishedAt: string;
  rawText: string;
  category?: string;
  location?: string;
}

export interface ValidatedArticle {
  title: string;
  url: string;
  canonicalUrl: string | null;
  imageUrl: string;
  publishedAt: string;
  rawText: string;
}

export interface RunSummary {
  status: "completed" | "failed";
  sourcesChecked: number;
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  rejectionReasons: Record<string, number>;
  error?: string;
}

export interface PipelineOptions {
  sourceIds?: string[];
  perSourceLimit?: number;
  // For scheduler: provide homepage HTML instead of live fetch
  homepageHtmlProvider?: (source: SourceRecord) => Promise<string | null>;
}
