import { NextResponse } from "next/server";

import { getArticleBySlug } from "@/lib/supabase/queries/articles";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}