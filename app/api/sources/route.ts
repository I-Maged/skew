import { NextResponse } from "next/server";

import { listSources } from "@/lib/supabase/queries/sources";

export async function GET() {
  try {
    const sources = await listSources();
    return NextResponse.json(sources);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load sources";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}