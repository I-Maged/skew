export interface RelatedStory {
  category: string;
  location: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
}

export function RelatedStoryCard({ story }: { story: RelatedStory }) {
  return (
    <article
      data-testid="related-story-card"
      className="flex gap-3 rounded-[5px] border border-[#d2d3cf] dark:border-[#3a3a45] bg-[#f8f8f5] dark:bg-[#1f1f27] p-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={story.image}
        alt={story.title}
        className="h-[62px] w-[86px] flex-shrink-0 rounded-[4px] object-cover"
      />
      <div className="min-w-0">
        <div className="text-[9px] text-[#4d4d4d] dark:text-[#a0aec0]">
          <span className="font-semibold text-[#111111] dark:text-[#f5f5f5]">{story.category}</span>
          <span> · {story.location}</span>
        </div>
        <h3 className="mt-1 line-clamp-2 text-[11px] font-bold leading-tight text-[#111111] dark:text-[#f5f5f5]">
          {story.title}
        </h3>
        <div className="mt-1 text-[9px] text-[#737373] dark:text-[#9ca3af]">
          {story.date} · {story.readTime}
        </div>
      </div>
    </article>
  );
}