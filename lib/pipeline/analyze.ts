// Stub analysis pipeline module. Full AI analysis is implemented in a separate prompt.
// Exposes runPendingAnalysis() used by the cron pipeline; returns a no-op summary.

export interface AnalysisSummary {
  analyzed: number;
  skipped: number;
  failed: number;
}

export async function runPendingAnalysis(): Promise<AnalysisSummary> {
  console.log("[analyze] analysis module is a stub; no articles analyzed");
  return { analyzed: 0, skipped: 0, failed: 0 };
}
