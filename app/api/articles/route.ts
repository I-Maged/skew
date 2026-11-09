import { NextResponse } from "next/server";

import { listHomepageArticles } from "@/lib/supabase/queries/articles";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get("limit");
    const limit = rawLimit ? Number(rawLimit) : 24;

    if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "limit must be between 1 and 100" },
        { status: 400 },
      );
    }

    const articles = await listHomepageArticles({ limit });
    return NextResponse.json(articles);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load articles";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}