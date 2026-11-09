import Link from "next/link";
import { Info } from "lucide-react";

export interface HomeStory {
  category: string;
  location: string;
  title: string;
  image: string;
  sources: number;
  perspective: { left: number; center: number; right: number };
}

export function HomeNewsCard({ story, href }: { story: HomeStory; href?: string }) {
  const card = (
    <article
      data-testid="news-card"
      className="overflow-hidden rounded-[5px] border border-[#bfc0bd] dark:border-[#2a2a35] bg-[#f8f8f5] dark:bg-[#1f1f27] transition-all hover:-translate-y-[1px] hover:border-[#777]"
    >
      <div className="relative aspect-[16/9] w-full bg-[#e4e5e2] dark:bg-[#25252e]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt={story.title}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          aria-label="Story perspective info"
          className="absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black/70 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Info size={11} strokeWidth={2} />
        </button>
      </div>

      <div className="px-[11px] pb-[10px] pt-[10px]">
        <div className="text-[10px] text-[#444444] dark:text-[#a0aec0]">
          <span className="font-semibold text-[#111111] dark:text-[#f5f5f5]">{story.category}</span>
          <span> · {story.location}</span>
        </div>

        <h3 className="mt-1 min-h-[2.6em] text-[15px] font-bold leading-[1.2] text-[#111111] dark:text-[#f5f5f5]">
          {story.title}
        </h3>

        <div className="mt-[13px] grid h-[14px] grid-cols-3 overflow-hidden text-[9px] leading-[14px]">
          <span className="bg-[#a81721] text-center text-white">
            L {story.perspective.left}%
          </span>
          <span className="border-t border-b border-[#d6d6d2] dark:border-[#4b5563] bg-[#f5f5f2] dark:bg-[#2a2a35] text-center text-[#333]">
            Center {story.perspective.center}%
          </span>
          <span className="bg-[#123f91] text-center text-white">
            Right {story.perspective.right}%
          </span>
        </div>

        <div className="mt-[12px] mb-[2px] text-[10px] font-medium text-[#111111] dark:text-[#f5f5f5]">
          {story.sources} sources
        </div>
      </div>
    </article>
  );

  if (!href) {
    return card;
  }

  return (
    <Link href={href} className="block rounded-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123f91]">
      {card}
    </Link>
  );
}