import "server-only";

function getCredentials(): { username: string; password: string } {
  const username = process.env.OXY_WSA_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD;
  if (!username || !password) {
    throw new Error("Missing OXY_WSA_USERNAME or OXY_WSA_PASSWORD");
  }
  return { username, password };
}

function basicAuthHeader(): string {
  const { username, password } = getCredentials();
  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${token}`;
}

const DATA_API = "https://data.oxylabs.io";
const REALTIME_API = "https://realtime.oxylabs.io";

async function fetchText(url: string, init: RequestInit): Promise<string> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Oxylabs ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.text();
}

export async function scrapeUrl(url: string): Promise<string> {
  const raw = await fetchText(`${REALTIME_API}/v1/queries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(),
    },
    body: JSON.stringify({ source: "universal", url }),
  });
  let parsed: { results?: { content?: string; html?: string }[] } | null = null;
  try {
    parsed = JSON.parse(raw) as { results?: { content?: string; html?: string }[] };
  } catch {
    throw new Error("Oxylabs scrape returned unparseable response");
  }
  const result = parsed?.results?.[0];
  const content = result?.content ?? result?.html;
  if (typeof content !== "string" || content.length === 0) {
    throw new Error("Oxylabs scrape returned no HTML content");
  }
  return content;
}

export interface CreateScheduleResult {
  scheduleId: string;
  active: boolean;
  itemsCount: number;
  cron: string;
  endTime: string;
  nextRunAt: string;
}

export async function createSchedule(
  cron: string,
  items: Record<string, unknown>[],
  endTime: string,
): Promise<CreateScheduleResult> {
  const raw = await fetchText(`${DATA_API}/v1/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(),
    },
    body: JSON.stringify({ cron, items, end_time: endTime }),
  });

  const idMatch = raw.match(/"schedule_id"\s*:\s*"?(\d+)"?/);
  if (!idMatch) {
    throw new Error("Oxylabs createSchedule returned no schedule_id");
  }
  const scheduleId = idMatch[1];

  let parsed: {
    active?: boolean;
    items_count?: number;
    cron?: string;
    end_time?: string;
    next_run_at?: string;
  } = {};
  try {
    parsed = JSON.parse(raw) as typeof parsed;
  } catch {
    // ignore; we already have the id
  }

  return {
    scheduleId,
    active: parsed.active ?? true,
    itemsCount: parsed.items_count ?? items.length,
    cron: parsed.cron ?? cron,
    endTime: parsed.end_time ?? endTime,
    nextRunAt: parsed.next_run_at ?? "",
  };
}

export async function listRemoteSchedules(): Promise<string[]> {
  const raw = await fetchText(`${DATA_API}/v1/schedules`, {
    method: "GET",
    headers: { Authorization: basicAuthHeader() },
  });
  let ids: string[] = [];
  try {
    const parsed = JSON.parse(raw) as { schedules?: unknown };
    if (Array.isArray(parsed?.schedules)) {
      ids = parsed.schedules.map((v) => String(v));
    }
  } catch {
    // ignore
  }
  if (ids.length === 0) {
    const re = /"(\d{10,})"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw)) !== null) ids.push(m[1]);
    ids = Array.from(new Set(ids));
  }
  return ids;
}

export interface RunJob {
  id: string;
  createStatusCode: number;
  resultStatus: string;
  createdAt: string;
  resultCreatedAt: string;
}

export interface RunInfo {
  runId: string;
  jobs: RunJob[];
  successRate: number;
}

export async function getRuns(scheduleId: string): Promise<RunInfo[]> {
  const raw = await fetchText(`${DATA_API}/v1/schedules/${scheduleId}/runs`, {
    method: "GET",
    headers: { Authorization: basicAuthHeader() },
  });
  let parsed: { runs?: unknown[] } = {};
  try {
    parsed = JSON.parse(raw) as { runs?: unknown[] };
  } catch {
    throw new Error("Oxylabs getRuns returned unparseable response");
  }
  const runs = Array.isArray(parsed?.runs) ? parsed.runs : [];
  return runs.map((r) => {
    const row = r as {
      run_id?: unknown;
      jobs?: unknown[];
      success_rate?: number;
    };
    const jobs = Array.isArray(row.jobs) ? row.jobs : [];
    return {
      runId: String(row.run_id ?? ""),
      jobs: jobs.map((j) => {
        const job = j as {
          id?: unknown;
          create_status_code?: number;
          result_status?: string;
          created_at?: string;
          result_created_at?: string;
        };
        return {
          id: String(job.id ?? ""),
          createStatusCode: job.create_status_code ?? 0,
          resultStatus: job.result_status ?? "",
          createdAt: job.created_at ?? "",
          resultCreatedAt: job.result_created_at ?? "",
        };
      }),
      successRate: row.success_rate ?? 0,
    };
  });
}

export async function deactivateSchedule(scheduleId: string): Promise<void> {
  await fetchText(`${DATA_API}/v1/schedules/${scheduleId}/state`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(),
    },
    body: JSON.stringify({ active: false }),
  });
}

export async function fetchJobResult(jobId: string): Promise<string> {
  const candidates = [
    `${DATA_API}/v1/queries/${jobId}`,
    `${DATA_API}/v1/queries/${jobId}/results`,
  ];
  let lastErr: Error | null = null;
  for (const url of candidates) {
    try {
      const raw = await fetchText(url, {
        method: "GET",
        headers: { Authorization: basicAuthHeader() },
      });
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        if (raw.includes("<html") || raw.includes("<!DOCTYPE")) return raw;
        throw new Error("unparseable");
      }
      const obj = parsed as {
        results?: { content?: string; html?: string }[];
        content?: string;
        html?: string;
        result?: { content?: string; html?: string };
      };
      const content =
        obj?.results?.[0]?.content ??
        obj?.results?.[0]?.html ??
        obj?.content ??
        obj?.html ??
        obj?.result?.content ??
        obj?.result?.html;
      if (typeof content === "string" && content.length > 0) return content;
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastErr ?? new Error("Failed to fetch job result");
}
