import { Bookmark, MoreHorizontal, Share2 } from "lucide-react";

export function ArticleHeader({
  title,
  category,
  location,
  publishedAt,
}: {
  title: string;
  category: string;
  location: string;
  publishedAt: string;
}) {
  return (
    <section data-testid="article-header">
      <div className="text-[10px] text-[#444444]">
        <span className="font-semibold text-[#111111]">{category}</span>
        <span> · {location}</span>
      </div>

      <h1 className="mt-2 mb-[10px] text-[clamp(28px,3vw,39px)] font-[750] leading-[1.08] tracking-[-0.035em] text-[#111111]">
        {title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-[10px] border-t border-[#d2d3cf] pt-2">
        <div className="flex items-center gap-2 text-[10px] text-[#737373]">
          <span>By Editorial Desk</span>
          <span>|</span>
          <span>{publishedAt}</span>
          <span>|</span>
          <span>8 min read</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#4d4d4d]">
          <button type="button" className="hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123f91]">
            Save
          </button>
          <button type="button" aria-label="Bookmark article" className="hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123f91]">
            <Bookmark size={13} strokeWidth={2} />
          </button>
          <button type="button" className="hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123f91]">
            Share
          </button>
          <button type="button" aria-label="Share article" className="hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123f91]">
            <Share2 size={13} strokeWidth={2} />
          </button>
          <button type="button" aria-label="More actions" className="hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123f91]">
            <MoreHorizontal size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}