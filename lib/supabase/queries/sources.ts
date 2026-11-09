import "server-only";

import { createSupabaseServerClient } from "../server";

type SourceRow = import("../types").Database["public"]["Tables"]["sources"]["Row"];

export interface SourceRecord {
  id: string;
  name: string;
  listingUrl: string;
  parserStrategy: string | null;
  active: boolean;
  logoUrl: string | null;
}

function mapSource(row: SourceRow): SourceRecord {
  return {
    id: row.id,
    name: row.name,
    listingUrl: row.listing_url,
    parserStrategy: row.parser_strategy,
    active: row.active,
    logoUrl: row.logo_url,
  };
}

export async function listSources(options?: { activeOnly?: boolean }): Promise<SourceRecord[]> {
  const client = createSupabaseServerClient();
  let query = client.from("sources").select("*").order("name", { ascending: true });

  if (options?.activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load sources: ${error.message}`);
  }

  return (data ?? []).map(mapSource);
}