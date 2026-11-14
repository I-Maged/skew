import { NextResponse } from "next/server";

import { listActiveSources } from "@/lib/supabase/queries/oxylabs";
import {
  listRemoteSchedules,
  createSchedule,
  deactivateSchedule,
} from "@/lib/oxylabs/client";
import { db } from "@/lib/supabase/queries/oxylabs";

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
    const sources = await listActiveSources();
    const created: string[] = [];
    for (const source of sources) {
      const result = await createSchedule(
        "0 * * * *",
        [{ source: "universal", url: source.listingUrl }],
        "2032-12-21 12:34:45",
      );
      await db()
        .from("oxylabs_schedules")
        .upsert(
          {
            source_id: source.id,
            oxylabs_remote_id: result.scheduleId,
            status: "active",
          },
          { onConflict: "oxylabs_remote_id" },
        );
      created.push(result.scheduleId);
    }

    // Orphan deactivation
    const remoteIds = await listRemoteSchedules();
    const stored = await db().from("oxylabs_schedules").select("oxylabs_remote_id");
    const storedSet = new Set(
      (stored.data ?? []).map((r: { oxylabs_remote_id: string }) => r.oxylabs_remote_id),
    );
    const orphans = remoteIds.filter((id) => !storedSet.has(id));
    for (const orphan of orphans) {
      try {
        await deactivateSchedule(orphan);
      } catch {
        // best effort
      }
    }

    return NextResponse.json({
      created: created.length,
      orphansDeactivated: orphans.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { data, error } = await db()
      .from("oxylabs_schedules")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return NextResponse.json(data ?? []);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
