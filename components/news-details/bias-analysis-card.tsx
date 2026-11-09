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
    { label: "Left", value: `${left}%`, color: "bg-[#9f1720]", countWidth: `${left}%` },
    { label: "Center", value: `${center}%`, color: "bg-[#d6d6d2]", countWidth: `${center}%` },
    { label: "Right", value: `${right}%`, color: "bg-[#123f91]", countWidth: `${right}%` },
  ];

  return (
    <section
      data-testid="bias-analysis-card"
      className="mb-[14px] rounded-[5px] border border-[#d2d3cf] bg-[#f8f8f5] px-4 py-3.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-[#111111]">Bias Analysis</h2>
        <button type="button" aria-label="About bias analysis" className="text-[10px] text-[#737373]">
          <Info size={12} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-2">
        <div className="text-[11px] text-[#4d4d4d]">Overall Bias</div>
        <div className="text-[19px] font-bold text-[#123f91]">
          {dominantLabel} {dominant}%
        </div>
        <div className="text-[9px] text-[#737373]">
          Based on {sourcesCount} stored sources
        </div>
      </div>

      <div className="mt-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_42px_70px] items-center gap-2 border-t border-[#e4e5e2] py-2 text-[10px]"
          >
            <span className="text-[#111111]">{row.label}</span>
            <span className="text-[#737373]">{row.value}</span>
            <div className="h-2 w-full rounded-full bg-[#e4e5e2]">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: row.countWidth }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[9px] text-[#737373]">
        Sentiment: {sentimentLabel} · Confidence: {Math.round(confidence * 100)}%
      </div>

      {loadedTerms.length > 0 ? (
        <div className="mt-2 text-[9px] text-[#4d4d4d]">
          Loaded terms: {loadedTerms.join(", ")}
        </div>
      ) : null}

      <p className="mt-2 text-[9px] leading-snug text-[#4d4d4d]">
        {disclaimer}
      </p>
    </section>
  );
}