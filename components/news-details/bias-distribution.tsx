export function BiasDistribution({
  left,
  center,
  right,
  sourcesCount,
}: {
  left: number;
  center: number;
  right: number;
  sourcesCount: number;
}) {
  return (
    <section
      data-testid="bias-distribution"
      className="mt-[18px] rounded-[5px] border border-[#d2d3cf] dark:border-[#3a3a45] bg-[#f8f8f5] dark:bg-[#1f1f27] px-4 py-3.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-[#111111] dark:text-[#f5f5f5]">
          Bias Distribution
        </h2>
        <button
          type="button"
          aria-label="About bias distribution"
          className="flex h-4 w-4 items-center justify-center rounded-full border border-[#b9bab7] dark:border-[#4b5563] text-[9px] text-[#737373] dark:text-[#9ca3af]"
        >
          i
        </button>
      </div>

      <div className="mt-3 grid h-[17px] grid-cols-[1fr_1.35fr_1.4fr] overflow-hidden text-center text-[9px] font-semibold leading-[17px]">
        <span className="bg-[#9f1720] dark:bg-[#e0555c] text-white">Left {left}%</span>
        <span className="border-t border-b border-[#d2d2ce] dark:border-[#3a3a45] bg-[#f6f6f3] dark:bg-[#2a2a35] text-[#111]">
          Center {center}%
        </span>
        <span className="bg-[#123f91] dark:bg-[#4f7cff] text-white">Right {right}%</span>
      </div>

      <p className="mt-2 text-[10px] text-[#737373] dark:text-[#9ca3af]">{sourcesCount} sources</p>
    </section>
  );
}