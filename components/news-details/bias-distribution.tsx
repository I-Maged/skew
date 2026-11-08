export function BiasDistribution() {
  return (
    <section
      data-testid="bias-distribution"
      className="mt-[18px] rounded-[5px] border border-[#d2d3cf] bg-[#f8f8f5] px-4 py-3.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-[#111111]">
          Bias Distribution
        </h2>
        <button
          type="button"
          aria-label="About bias distribution"
          className="flex h-4 w-4 items-center justify-center rounded-full border border-[#b9bab7] text-[9px] text-[#737373]"
        >
          i
        </button>
      </div>

      <div className="mt-3 grid h-[17px] grid-cols-[1fr_1.35fr_1.4fr] overflow-hidden text-center text-[9px] font-semibold leading-[17px]">
        <span className="bg-[#9f1720] text-white">Left 20%</span>
        <span className="border-t border-b border-[#d2d2ce] bg-[#f6f6f3] text-[#111]">
          Center 31%
        </span>
        <span className="bg-[#123f91] text-white">Right 49%</span>
      </div>

      <p className="mt-2 text-[10px] text-[#737373]">12 sources</p>
    </section>
  );
}