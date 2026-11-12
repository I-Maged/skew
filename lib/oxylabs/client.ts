import "server-only";

function getWebApiKey(): string {
  const key = process.env.OXYLABS_API_KEY;
  if (!key) {
    throw new Error("Missing OXYLABS_API_KEY");
  }
  return key;
}

const WEB_API = "https://webapi.oxylabs.io";

async function fetchText(url: string, init: RequestInit): Promise<string> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Oxylabs ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.text();
}

export async function scrapeUrl(url: string): Promise<string> {
  const key = getWebApiKey();
  const raw = await fetchText(`${WEB_API}/v1/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ url, output: ["html"] }),
  });
  const parsed = JSON.parse(raw) as { results?: { html?: string; content?: string }[] };
  const result = parsed?.results?.[0];
  const content = result?.html ?? result?.content;
  if (typeof content !== "string") {
    throw new Error("Oxylabs scrape returned no HTML content");
  }
  return content;
}

// Scheduler is not available on the Web API product.
// These are kept as no-op stubs so the rest of the codebase compiles.
export interface CreateScheduleResult {
  scheduleId: string;
  active: boolean;
  itemsCount: number;
  cron: string;
  endTime: string;
  nextRunAt: string;
}

export async function createSchedule(
  _cron?: string,
  _items?: Record<string, unknown>[],
  _endTime?: string,
): Promise<CreateScheduleResult> {
  throw new Error("Scheduler is not available on the Oxylabs Web API product");
}

export async function listRemoteSchedules(_?: string): Promise<string[]> {
  return [];
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

export async function getRuns(_scheduleId?: string): Promise<RunInfo[]> {
  return [];
}

export async function deactivateSchedule(_scheduleId?: string): Promise<void> {
  // no-op
}

export async function fetchJobResult(_jobId?: string): Promise<string> {
  throw new Error("Scheduler is not available on the Oxylabs Web API product");
}
