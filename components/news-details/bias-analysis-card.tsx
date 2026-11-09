import { Info } from "lucide-react";

export function BiasAnalysisCard({
  left,
  center,
  right,
  sourcesCount,
  biasLabel,
  sentimentLabel,
  confidence,
  disclaimer,
  loadedTerms,
}: {
  left: number;
  center: number;
  right: number;
  sourcesCount: number;
  biasLabel: string;
  sentimentLabel: string;
  confidence: number;
  disclaimer: string;
  loadedTerms: string[];
}) {
  const dominant = Math.max(left, center, right);
  const dominantLabel = biasLabel.charAt(0).toUpperCase() + biasLabel.slice(1);
  const rows = [
    { label: "Left", value: `${left}%`, color: "bg-[#9f1720] dark:bg-[#e0555c]", countWidth: `${left}%` },
    { label: "Center", value: `${center}%`, color: "bg-[#d6d6d2] dark:bg-[#4b5563]", countWidth: `${center}%` },
    { label: "Right", value: `${right}%`, color: "bg-[#123f91] dark:bg-[#4f7cff]", countWidth: `${right}%` },
  ];

  return (
    <section
      data-testid="bias-analysis-card"
      className="mb-[14px] rounded-[5px] border border-[#d2d3cf] dark:border-[#3a3a45] bg-[#f8f8f5] dark:bg-[#1f1f27] px-4 py-3.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-[#111111] dark:text-[#f5f5f5]">Bias Analysis</h2>
        <button type="button" aria-label="About bias analysis" className="text-[10px] text-[#737373] dark:text-[#9ca3af]">
          <Info size={12} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-2">
        <div className="text-[11px] text-[#4d4d4d] dark:text-[#a0aec0]">Overall Bias</div>
        <div className="text-[19px] font-bold text-[#123f91] dark:text-[#4f7cff]">
          {dominantLabel} {dominant}%
        </div>
        <div className="text-[9px] text-[#737373] dark:text-[#9ca3af]">
          Based on {sourcesCount} stored sources
        </div>
      </div>

      <div className="mt-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_42px_70px] items-center gap-2 border-t border-[#e4e5e2] dark:border-[#25252e] py-2 text-[10px]"
          >
            <span className="text-[#111111] dark:text-[#f5f5f5]">{row.label}</span>
            <span className="text-[#737373] dark:text-[#9ca3af]">{row.value}</span>
            <div className="h-2 w-full rounded-full bg-[#e4e5e2] dark:bg-[#25252e]">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: row.countWidth }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[9px] text-[#737373] dark:text-[#9ca3af]">
        Sentiment: {sentimentLabel} · Confidence: {Math.round(confidence * 100)}%
      </div>

      {loadedTerms.length > 0 ? (
        <div className="mt-2 text-[9px] text-[#4d4d4d] dark:text-[#a0aec0]">
          Loaded terms: {loadedTerms.join(", ")}
        </div>
      ) : null}

      <p className="mt-2 text-[9px] leading-snug text-[#4d4d4d] dark:text-[#a0aec0]">
        {disclaimer}
      </p>
    </section>
  );
}