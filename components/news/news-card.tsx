import Image from "next/image";
import { Info } from "lucide-react";
import { BiasMeter } from "@/components/ui/bias-meter";
import { Card } from "@/components/ui/card";

interface NewsCardProps {
  title: string;
  category: string;
  location?: string;
  imageUrl?: string;
  imageAlt?: string;
  left: number;
  center: number;
  right: number;
  sourceCount?: number;
  readTime?: string;
}

export function NewsCard({
  title,
  category,
  location,
  imageUrl,
  imageAlt,
  left,
  center,
  right,
  sourceCount,
  readTime,
}: NewsCardProps) {
  return (
    <Card data-testid="news-card" className="overflow-hidden">
      <div className="relative aspect-video w-full bg-surface">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-secondary">
            Image placeholder
          </div>
        )}
        <button
          type="button"
          aria-label="Source info"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-bg-primary/90 text-text-secondary shadow-sm"
        >
          <Info size={14} strokeWidth={2} />
        </button>
      </div>
      <div className="space-y-3 p-4">
        <div className="text-xs font-medium text-text-secondary">
          {category}
          {location ? ` · ${location}` : ""}
        </div>
        <h3 className="font-sans text-lg font-semibold leading-snug text-text-primary">
          {title}
        </h3>
        <BiasMeter left={left} center={center} right={right} />
        <div className="flex items-center justify-between text-xs text-text-secondary">
          {sourceCount !== undefined && <span>{sourceCount} sources</span>}
          {readTime && <span>{readTime}</span>}
        </div>
      </div>
    </Card>
  );
}