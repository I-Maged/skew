import { Info } from "lucide-react";

const bullets = [
  "The Trump administration has sent Iran a revised nuclear deal proposal with tougher terms, including a complete halt to uranium enrichment and the removal of enriched uranium stockpiles.",
  "The proposal also demands unrestricted inspector access to all nuclear sites, including military facilities.",
  "Iran has not responded officially but says any deal must respect its right to peaceful nuclear energy and include sanctions relief.",
  "The U.S. warns it is prepared to take other action if diplomacy fails, while European allies urge continued negotiations.",
  "Israel supports the tougher stance, praising the administration’s determination to prevent Iran from acquiring nuclear weapons.",
];

export function AiSummaryCard() {
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
        Generated May 31, 2026 · 3 min read
      </div>

      <ul className="mt-2 list-disc pl-4 text-[10.5px] leading-[1.35] text-[#181818]">
        {bullets.map((bullet) => (
          <li key={bullet} className="mb-[13px]">
            {bullet}
          </li>
        ))}
      </ul>

      <p className="text-[9px] italic text-[#737373]">AI summaries can make mistakes.</p>

      <button
        type="button"
        className="mt-3 flex h-[30px] w-full items-center justify-center rounded-[4px] border border-[#b9bab7] bg-white text-[10px] text-[#111111] hover:opacity-82"
      >
        Provide Feedback
      </button>
    </section>
  );
}