import { Info } from "lucide-react";

export function BiasAnalysisCard() {
  const rows = [
    { label: "Left", value: "20%", color: "bg-[#9f1720]", countWidth: "20%" },
    { label: "Center", value: "31%", color: "bg-[#d6d6d2]", countWidth: "31%" },
    { label: "Right", value: "49%", color: "bg-[#123f91]", countWidth: "49%" },
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
        <div className="text-[19px] font-bold text-[#123f91]">Right 49%</div>
        <div className="text-[9px] text-[#737373]">Based on 12 balanced sources</div>
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

      <p className="mt-2 text-[9px] leading-snug text-[#4d4d4d]">
        Our analysis is based on the political leaning of the publication and how
        the story is framed. Sources are weighted by reliability and recency.
      </p>

      <button
        type="button"
        className="mt-3 flex h-[30px] w-full items-center justify-center rounded-[4px] border border-[#b9bab7] bg-white text-[10px] text-[#111111] hover:opacity-82"
      >
        How We Analyze Bias
      </button>
    </section>
  );
}