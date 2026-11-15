import { NextResponse } from "next/server";

import { runPendingAnalysis } from "@/lib/pipeline/analyze";

function checkAdmin(request: Request): boolean {
  const secret = process.env.BIASLY_ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get("x-biasly-admin-secret") === secret;
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json().catch(() => ({}))) as {
      limit?: number;
      articleIds?: string[];
      batchSize?: number;
    };
    const summary = await runPendingAnalysis({
      limit: body.limit,
      articleIds: body.articleIds,
      batchSize: body.batchSize,
    });
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}