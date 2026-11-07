import { Card } from "@/components/ui/card";

interface RelatedArticleCardProps {
  title: string;
  category: string;
  date: string;
  imageUrl?: string;
}

export function RelatedArticleCard({
  title,
  category,
  date,
  imageUrl,
}: RelatedArticleCardProps) {
  return (
    <Card className="flex gap-3 p-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-surface">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-text-secondary">{category}</div>
        <h4 className="mt-1 line-clamp-2 font-sans text-sm font-semibold text-text-primary">
          {title}
        </h4>
        <div className="mt-1 text-xs text-text-secondary">{date}</div>
      </div>
    </Card>
  );
}