import { Globe, ChevronDown } from "lucide-react";

export function HomeUtilityBar() {
  return (
    <div
      data-testid="utility-bar"
      className="hidden bg-black text-white md:block"
    >
      <div className="mx-auto flex h-7 max-w-[936px] items-center justify-between px-[44px] text-[10px] text-gray-300">
        <div className="flex items-center gap-2">
          <span>Browser Extension</span>
          <span className="text-gray-500">|</span>
          <span>Theme:</span>
          <button type="button" className="hover:opacity-80">Light</button>
          <button type="button" className="hover:opacity-80">Dark</button>
          <button type="button" className="hover:opacity-80">Auto</button>
        </div>
        <div className="flex items-center gap-2">
          <span>Monday, June 1, 2026</span>
          <span className="text-gray-500">|</span>
          <span>Set Location</span>
          <Globe size={11} strokeWidth={2} />
          <span>International Edition</span>
          <ChevronDown size={11} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}