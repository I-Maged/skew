import { Info } from "lucide-react";

const breakdown = [
  { label: "Left", count: 2, percent: 20, color: "bg-[#9f1720]", barWidth: "20%" },
  { label: "Center", count: 4, percent: 31, color: "bg-[#d6d6d2]", barWidth: "31%" },
  { label: "Right", count: 6, percent: 49, color: "bg-[#123f91]", barWidth: "49%" },
];

const topSources = [
  { name: "Fox News", bias: "Right", color: "text-[#9f1720]" },
  { name: "The Wall Street Journal", bias: "Center", color: "text-[#737373]" },
  { name: "Reuters", bias: "Center", color: "text-[#737373]" },
  { name: "BBC", bias: "Center", color: "text-[#737373]" },
  { name: "CNN", bias: "Left", color: "text-[#9f1720]" },
  { name: "The New York Times", bias: "Center", color: "text-[#737373]" },
  { name: "The Washington Post", bias: "Center", color: "text-[#737373]" },
  { name: "Newsmax", bias: "Right", color: "text-[#9f1720]" },
];

export function SourceBreakdownCard() {
  return (
    <section
      data-testid="source-breakdown-card"
      className="mb-[14px] rounded-[5px] border border-[#d2d3cf] bg-[#f8f8f5] px-4 py-3.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-[#111111]">
          Source Breakdown
        </h2>
        <button type="button" aria-label="About source breakdown" className="text-[10px] text-[#737373]">
          <Info size={12} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-1 text-[12px] font-bold text-[#111111]">12 Total Sources</div>

      <div className="mt-2">
        {breakdown.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_70px_70px] items-center gap-2 border-t border-[#e4e5e2] py-2 text-[10px]"
          >
            <span className="text-[#111111]">{row.label}</span>
            <span className="text-[#737373]">
              {row.count} ({row.percent}%)
            </span>
            <div className="h-2 w-full rounded-full bg-[#e4e5e2]">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: row.barWidth }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[9px] font-semibold text-[#4d4d4d]">
          <span>Top Sources</span>
          <span>Bias</span>
        </div>
        <div className="mt-1 border-t border-[#e4e5e2]">
          {topSources.map((source) => (
            <div
              key={source.name}
              className="flex items-center justify-between py-1.5 text-[10px]"
            >
              <span className="text-[#111111]">{source.name}</span>
              <span className={source.color}>{source.bias}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mt-3 flex h-[30px] w-full items-center justify-center rounded-[4px] border border-[#b9bab7] bg-white text-[10px] text-[#111111] hover:opacity-82"
      >
        View All Sources
      </button>
    </section>
  );
}