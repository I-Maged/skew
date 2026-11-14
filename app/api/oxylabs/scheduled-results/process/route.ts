import { NextResponse } from "next/server";

import { listStoredSchedules } from "@/lib/supabase/queries/oxylabs";
import { getRuns, fetchJobResult } from "@/lib/oxylabs/client";
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
    const schedules = await listStoredSchedules();
    const processed: { scheduleId: string; runs: number; inserted: number }[] = [];

    for (const sched of schedules) {
      const runs = await getRuns(sched.oxylabsRemoteId);
      const doneJobHtmls: string[] = [];
      let runCount = 0;
      for (const run of runs) {
        for (const job of run.jobs) {
          if (job.resultStatus === "done") {
            try {
              const html = await fetchJobResult(job.id);
              doneJobHtmls.push(html);
              runCount += 1;
            } catch {
              // skip failed fetch
            }
          }
        }
      }

      let htmlIndex = 0;
      const summary = await runScrapePipeline({
        sourceIds: [sched.sourceId],
        perSourceLimit: 5,
        homepageHtmlProvider: async () => {
          const h = doneJobHtmls[htmlIndex] ?? null;
          htmlIndex += 1;
          return h;
        },
      });

      processed.push({
        scheduleId: sched.id,
        runs: runCount,
        inserted: summary.articlesInserted,
      });
    }

    return NextResponse.json({ processed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Process failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
