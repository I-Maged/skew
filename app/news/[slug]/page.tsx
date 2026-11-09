import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { HomeUtilityBar } from "@/components/home/home-utility-bar";
import { HomeHeader } from "@/components/home/home-header";
import { HomeFooter } from "@/components/home/home-footer";
import { ArticleHeader } from "@/components/news-details/article-header";
import { HeroImage } from "@/components/news-details/hero-image";
import { BiasDistribution } from "@/components/news-details/bias-distribution";
import { ArticleBody } from "@/components/news-details/article-body";
import { BiasAnalysisCard } from "@/components/news-details/bias-analysis-card";
import { AiSummaryCard } from "@/components/news-details/ai-summary-card";
import { SourceBreakdownCard } from "@/components/news-details/source-breakdown-card";
import { RelatedStoryCard, type RelatedStory } from "@/components/news-details/related-story-card";
import { NewsletterSignup } from "@/components/news-details/newsletter-signup";
import { getArticleBySlug } from "@/lib/supabase/queries/articles";

const relatedStories: RelatedStory[] = [
  {
    category: "World",
    location: "Middle East",
    title: "Iran Says It Will Not Negotiate Under ‘Maximum Pressure’",
    date: "May 29, 2026",
    readTime: "8 min read",
    image: "/images/details-iran-flag.svg",
  },
  {
    category: "Politics",
    location: "United States",
    title: "Bipartisan Group Urges Diplomacy With Iran",
    date: "May 26, 2026",
    readTime: "6 min read",
    image: "/images/details-capitol.svg",
  },
  {
    category: "World",
    location: "United States",
    title: "US Sanctions More Iranian Entities Over Nuclear Program",
    date: "May 28, 2026",
    readTime: "6 min read",
    image: "/images/details-gov.svg",
  },
  {
    category: "Science",
    location: "Nuclear Physics",
    title: "What’s in the 2015 Iran Nuclear Deal?",
    date: "May 25, 2026",
    readTime: "10 min read",
    image: "/images/details-nuclear.svg",
  },
  {
    category: "World",
    location: "Middle East",
    title: "Oman Hosts Another Round of US-Iran Talks",
    date: "May 27, 2026",
    readTime: "7 min read",
    image: "/images/details-oman.svg",
  },
  {
    category: "World",
    location: "Middle East",
    title: "Israel Reaffirms Red Line Over Iranian Nuclear Program",
    date: "May 24, 2026",
    readTime: "6 min read",
    image: "/images/details-israel.svg",
  },
];

export default function NewsDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  return (
    <Suspense fallback={null}>
      <ProtectedNewsDetails params={params} />
    </Suspense>
  );
}

async function ProtectedNewsDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await auth.protect();

  const { slug } = await params;
  const detail = await getArticleBySlug(slug);

  if (!detail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f2f3f0]">
      <HomeUtilityBar />
      <HomeHeader />

      <main className="py-[30px] pb-[32px]">
        <div className="mx-auto max-w-[1040px] px-4 md:px-[30px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,2fr)_280px] lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.92fr)]">
            <article data-testid="article-column" className="min-w-0">
              <ArticleHeader
                title={detail.title}
                category={detail.category}
                location={detail.location}
                publishedAt={detail.publishedAt}
              />
              <HeroImage image={detail.imageUrl} alt={detail.title} />
              <BiasDistribution
                left={detail.perspective.left}
                center={detail.perspective.center}
                right={detail.perspective.right}
                sourcesCount={detail.sourcesCount}
              />
              <ArticleBody paragraphs={detail.paragraphs} />

              <div className="mt-6 border-t border-[#d2d3cf] pt-4">
                <h2 className="mb-3 text-[16px] font-bold text-[#111111]">
                  Related Stories
                </h2>
                <div
                  data-testid="related-stories-grid"
                  className="grid grid-cols-1 gap-[14px_18px] md:grid-cols-2"
                >
                  {relatedStories.map((story) => (
                    <RelatedStoryCard key={story.title} story={story} />
                  ))}
                </div>
              </div>
            </article>

            <aside data-testid="sidebar" className="min-w-0">
              <BiasAnalysisCard
                left={detail.perspective.left}
                center={detail.perspective.center}
                right={detail.perspective.right}
                sourcesCount={detail.sourcesCount}
                biasLabel={detail.biasLabel}
                sentimentLabel={detail.sentimentLabel}
                confidence={detail.confidence}
                disclaimer={detail.disclaimer}
                loadedTerms={detail.loadedTerms}
              />
              <AiSummaryCard bullets={detail.summaryBullets} />
              <SourceBreakdownCard
                sourcesCount={detail.sourcesCount}
                left={detail.perspective.left}
                center={detail.perspective.center}
                right={detail.perspective.right}
              />
            </aside>
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-[1040px] px-4 md:px-[30px]">
        <NewsletterSignup />
      </div>

      <HomeFooter />
    </div>
  );
}
