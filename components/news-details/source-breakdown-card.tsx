import { Info } from "lucide-react";

export function SourceBreakdownCard({
  sourcesCount,
  left,
  center,
  right,
}: {
  sourcesCount: number;
  left: number;
  center: number;
  right: number;
}) {
  const leftCount = Math.round((sourcesCount * left) / 100);
  const centerCount = Math.round((sourcesCount * center) / 100);
  const rightCount = Math.max(0, sourcesCount - leftCount - centerCount);

  const breakdown = [
    { label: "Left", count: leftCount, percent: left, color: "bg-[#9f1720] dark:bg-[#e0555c]", barWidth: `${left}%` },
    { label: "Center", count: centerCount, percent: center, color: "bg-[#d6d6d2] dark:bg-[#4b5563]", barWidth: `${center}%` },
    { label: "Right", count: rightCount, percent: right, color: "bg-[#123f91] dark:bg-[#4f7cff]", barWidth: `${right}%` },
  ];

  const topSources = [
    { name: "Stored source", bias: center >= 40 ? "Center" : right > left ? "Right" : "Left", color: "text-[#737373] dark:text-[#9ca3af]" },
  ];

  return (
    <section
      data-testid="source-breakdown-card"
      className="mb-[14px] rounded-[5px] border border-[#d2d3cf] dark:border-[#3a3a45] bg-[#f8f8f5] dark:bg-[#1f1f27] px-4 py-3.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-[#111111] dark:text-[#f5f5f5]">
          Source Breakdown
        </h2>
        <button type="button" aria-label="About source breakdown" className="text-[10px] text-[#737373] dark:text-[#9ca3af]">
          <Info size={12} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-1 text-[12px] font-bold text-[#111111] dark:text-[#f5f5f5]">{sourcesCount} Total Sources</div>

      <div className="mt-2">
        {breakdown.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_70px_70px] items-center gap-2 border-t border-[#e4e5e2] dark:border-[#25252e] py-2 text-[10px]"
          >
            <span className="text-[#111111] dark:text-[#f5f5f5]">{row.label}</span>
            <span className="text-[#737373] dark:text-[#9ca3af]">
              {row.count} ({row.percent}%)
            </span>
            <div className="h-2 w-full rounded-full bg-[#e4e5e2] dark:bg-[#25252e]">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: row.barWidth }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[9px] font-semibold text-[#4d4d4d] dark:text-[#a0aec0]">
          <span>Top Sources</span>
          <span>Bias</span>
        </div>
        <div className="mt-1 border-t border-[#e4e5e2] dark:border-[#25252e]">
          {topSources.map((source) => (
            <div
              key={source.name}
              className="flex items-center justify-between py-1.5 text-[10px]"
            >
              <span className="text-[#111111] dark:text-[#f5f5f5]">{source.name}</span>
              <span className={source.color}>{source.bias}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}