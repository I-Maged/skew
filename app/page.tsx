import { connection } from "next/server";
import { HomeUtilityBar } from "@/components/home/home-utility-bar";
import { HomeHeader } from "@/components/home/home-header";
import { TopicBar } from "@/components/home/topic-bar";
import { HomeNewsCard } from "@/components/home/home-news-card";
import { HomeFooter } from "@/components/home/home-footer";
import { listHomepageArticles, toHomeStory } from "@/lib/supabase/queries/articles";

export const instant = false;

export default async function HomePage() {
  await connection();
  const articles = await listHomepageArticles({ limit: 24 });
  const items = articles.map((article) => ({
    story: toHomeStory(article),
    href: `/news/${article.slug}`,
  }));

  return (
    <div className="min-h-screen bg-[#f1f2ef] dark:bg-[#0a0a0f]">
      <HomeUtilityBar />
      <HomeHeader />
      <TopicBar />

      <main>
        <div className="mx-auto max-w-234 px-4 py-6.5 pb-4.5 md:px-11">
          <h1 className="mb-4 text-[24px] font-bold text-[#111111] dark:text-[#f5f5f5]">
            Top News
          </h1>

          <div
            data-testid="news-grid"
            className="grid grid-cols-1 gap-[20px_21px] md:grid-cols-2 lg:grid-cols-3"
          >
            {items.map(({ story, href }) => (
              <HomeNewsCard key={story.title} story={story} href={href} />
            ))}
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}