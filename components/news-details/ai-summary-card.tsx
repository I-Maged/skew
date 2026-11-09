import { Info } from "lucide-react";

export function AiSummaryCard({ bullets }: { bullets: string[] }) {
  const items = bullets.length > 0 ? bullets : ["AI summary is not available."];

  return (
    <section
      data-testid="ai-summary-card"
      className="mb-[14px] rounded-[5px] border border-[#d2d3cf] bg-[#f8f8f5] px-4 py-3.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-[#111111]">AI Summary</h2>
        <button type="button" aria-label="About AI summary" className="text-[10px] text-[#737373]">
          <Info size={12} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-1 text-[9px] text-[#737373]">
        Generated from stored analysis
      </div>

      <ul className="mt-2 list-disc pl-4 text-[10.5px] leading-[1.35] text-[#181818]">
        {items.map((bullet, index) => (
          <li key={`${index}-${bullet}`} className="mb-[13px]">
            {bullet}
          </li>
        ))}
      </ul>

      <p className="text-[9px] italic text-[#737373]">AI summaries can make mistakes.</p>
    </section>
  );
}