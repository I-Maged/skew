import { NextResponse } from "next/server";

import { runScrapePipeline } from "@/lib/pipeline/scrape";

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
      sourceIds?: string[];
      perSourceLimit?: number;
    };
    const summary = await runScrapePipeline({
      sourceIds: body.sourceIds,
      perSourceLimit: body.perSourceLimit,
    });
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
