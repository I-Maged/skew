import "server-only";

import { createSupabaseServerClient } from "../server";
import type { SourceRecord } from "@/lib/pipeline/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any {
  return createSupabaseServerClient();
}

export { db };

type ScheduleRow = import("../types").Database["public"]["Tables"]["oxylabs_schedules"]["Row"];
type RunRow = import("../types").Database["public"]["Tables"]["oxylabs_schedule_runs"]["Row"];

export interface StoredSchedule {
  id: string;
  sourceId: string;
  oxylabsRemoteId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredRun {
  id: string;
  scheduleId: string;
  remoteRunId: string | null;
  resultStatus: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

function mapSchedule(row: ScheduleRow): StoredSchedule {
  return {
    id: row.id,
    sourceId: row.source_id,
    oxylabsRemoteId: row.oxylabs_remote_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRun(row: RunRow): StoredRun {
  return {
    id: row.id,
    scheduleId: row.schedule_id,
    remoteRunId: row.remote_run_id,
    resultStatus: row.result_status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
}

export async function listStoredSchedules(): Promise<StoredSchedule[]> {
  const client = db();
  const { data, error } = await client
    .from("oxylabs_schedules")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Failed to load schedules: ${error.message}`);
  return (data ?? []).map(mapSchedule);
}

export async function upsertStoredSchedule(
  sourceId: string,
  remoteId: string,
  status = "active",
): Promise<StoredSchedule> {
  const client = db();
  const { data, error } = await client
    .from("oxylabs_schedules")
    .upsert(
      { source_id: sourceId, oxylabs_remote_id: remoteId, status },
      { onConflict: "oxylabs_remote_id" },
    )
    .select("*")
    .single();
  if (error) throw new Error(`Failed to upsert schedule: ${error.message}`);
  return mapSchedule(data as ScheduleRow);
}

export async function listStoredRuns(scheduleId: string): Promise<StoredRun[]> {
  const client = db();
  const { data, error } = await client
    .from("oxylabs_schedule_runs")
    .select("*")
    .eq("schedule_id", scheduleId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load runs: ${error.message}`);
  return (data ?? []).map(mapRun);
}

export async function insertStoredRun(input: {
  scheduleId: string;
  remoteRunId: string | null;
  resultStatus: string | null;
  startedAt: string | null;
  completedAt: string | null;
}): Promise<StoredRun> {
  const client = db();
  const { data, error } = await client
    .from("oxylabs_schedule_runs")
    .insert({
      schedule_id: input.scheduleId,
      remote_run_id: input.remoteRunId,
      result_status: input.resultStatus,
      started_at: input.startedAt,
      completed_at: input.completedAt,
    })
    .select("*")
    .single();
  if (error) throw new Error(`Failed to insert run: ${error.message}`);
  return mapRun(data as RunRow);
}

// URL existence check helper (chunked <= 15)
export async function existingArticleUrls(urls: string[]): Promise<Set<string>> {
  const client = db();
  const result = new Set<string>();
  const chunkSize = 15;
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    if (chunk.length === 0) continue;
    const { data, error } = await client
      .from("articles")
      .select("url")
      .in("url", chunk);
    if (error) throw new Error(`Failed to check urls: ${error.message}`);
    for (const row of data ?? []) {
      result.add((row as { url: string }).url);
    }
  }
  return result;
}

export async function insertArticle(input: {
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
}): Promise<string> {
  const client = db();
  const { data, error } = await client
    .from("articles")
    .insert({
      source_id: input.sourceId,
      url: input.url,
      canonical_url: input.canonicalUrl,
      title: input.title,
      slug: input.slug,
      image_url: input.imageUrl,
      published_at: input.publishedAt,
      raw_text: input.rawText,
      category: input.category ?? "News",
      location: input.location ?? "Global",
    })
    .select("id")
    .single();
  if (error) throw new Error(`Failed to insert article: ${error.message}`);
  return (data as { id: string }).id;
}

export async function listActiveSources(): Promise<SourceRecord[]> {
  const client = db();
  const { data, error } = await client
    .from("sources")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });
  if (error) throw new Error(`Failed to load sources: ${error.message}`);
  return (data ?? []).map((row: unknown) => {
    const r = row as import("../types").Database["public"]["Tables"]["sources"]["Row"];
    return {
      id: r.id,
      name: r.name,
      listingUrl: r.listing_url,
      parserStrategy: r.parser_strategy,
      active: r.active,
      logoUrl: r.logo_url,
    };
  });
}

export async function listPendingAnalysisArticleIds(): Promise<string[]> {
  const client = db();
  const { data, error } = await client
    .from("articles")
    .select("id, article_analyses(article_id)");
  if (error) throw new Error(`Failed to load articles: ${error.message}`);
  const pending: string[] = [];
  for (const row of data ?? []) {
    const r = row as { id: string; article_analyses?: unknown };
    const analyses = r.article_analyses;
    const hasAnalysis = Array.isArray(analyses)
      ? analyses.length > 0
      : Boolean(analyses);
    if (!hasAnalysis) pending.push(r.id);
  }
  return pending;
}
