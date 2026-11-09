import { Plus } from "lucide-react";

const topics = [
  "World Cup",
  "IPL",
  "Social Media",
  "Business & Markets",
  "Health & Medicine",
  "Soccer",
  "Artificial Intelligence",
  "Arsenal FC",
  "Extreme Weather and Disasters",
];

export function TopicBar() {
  return (
    <div
      data-testid="topic-bar"
      className="border-b border-[#bfc0bd] dark:border-[#2a2a35] bg-[#e4e5e2] dark:bg-[#25252e]"
    >
      <div className="mx-auto flex h-[44px] max-w-[936px] items-center gap-2 overflow-x-auto px-[44px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          aria-label="Topics"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#bfc0bd] dark:border-[#2a2a35] bg-white dark:bg-[#1f1f27] text-[#111111] dark:text-[#f5f5f5]"
        >
          <Plus size={14} strokeWidth={2} />
        </button>
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            className="flex flex-shrink-0 items-center gap-1 rounded-full bg-[#d8d9d5] dark:bg-[#3a3a45] px-3 py-1 text-[12px] text-[#111111] dark:text-[#f5f5f5] hover:opacity-82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
          >
            {topic}
            <Plus size={11} strokeWidth={2} />
          </button>
        ))}
      </div>
    </div>
  );
}