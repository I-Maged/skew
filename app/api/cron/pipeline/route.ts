import { NextResponse } from "next/server";

import { runPendingAnalysis } from "@/lib/pipeline/analyze";

function isAuthorized(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  return request.headers.get("x-cron-secret") === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // Step 1: process scheduled results
  try {
    const { POST: processPost } = await import(
      "@/app/api/oxylabs/scheduled-results/process/route"
    );
    const secret = process.env.BIASLY_ADMIN_SECRET ?? "";
    const req = new Request(request.url, {
      method: "POST",
      headers: { "x-biasly-admin-secret": secret },
    });
    const res = await processPost(req);
    results.process = await res.json();
  } catch (error) {
    results.process = {
      error: error instanceof Error ? error.message : String(error),
    };
    console.error("[cron] process step failed", error);
  }

  // Step 2: run pending analysis
  try {
    results.analysis = await runPendingAnalysis();
  } catch (error) {
    results.analysis = {
      error: error instanceof Error ? error.message : String(error),
    };
    console.error("[cron] analysis step failed", error);
  }

  console.log("[cron] pipeline completed", results);
  return NextResponse.json({ ok: true, ...results });
}
