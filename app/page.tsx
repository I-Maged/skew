import { HomeUtilityBar } from "@/components/home/home-utility-bar";
import { HomeHeader } from "@/components/home/home-header";
import { TopicBar } from "@/components/home/topic-bar";
import { HomeNewsCard, type HomeStory } from "@/components/home/home-news-card";
import { HomeFooter } from "@/components/home/home-footer";

const stories: HomeStory[] = [
  {
    category: "Politics",
    location: "United States",
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    image: "/images/story-1.svg",
    sources: 12,
    perspective: { left: 20, center: 31, right: 49 },
  },
  {
    category: "Health",
    location: "United States",
    title:
      "Researchers Make Case for Grapes as a ‘Superfood’ After Review of Health Evidence",
    image: "/images/story-2.svg",
    sources: 7,
    perspective: { left: 18, center: 42, right: 40 },
  },
  {
    category: "Science",
    location: "Switzerland",
    title: "CERN Finds High-Significance Hint of Physics Beyond Standard Model",
    image: "/images/story-3.svg",
    sources: 8,
    perspective: { left: 16, center: 62, right: 22 },
  },
  {
    category: "World",
    location: "Nicaragua",
    title:
      "Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention",
    image: "/images/story-4.svg",
    sources: 63,
    perspective: { left: 54, center: 28, right: 18 },
  },
  {
    category: "World",
    location: "Middle East",
    title:
      "UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon",
    image: "/images/story-5.svg",
    sources: 15,
    perspective: { left: 22, center: 35, right: 43 },
  },
  {
    category: "Business",
    location: "Global",
    title: "Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand",
    image: "/images/story-6.svg",
    sources: 11,
    perspective: { left: 25, center: 50, right: 28 },
  },
  {
    category: "Technology",
    location: "United States",
    title: "SpaceX Launches Starship Test Flight in Milestone for Mars Program",
    image: "/images/story-7.svg",
    sources: 9,
    perspective: { left: 12, center: 45, right: 49 },
  },
  {
    category: "Technology",
    location: "United States",
    title: "Apple Unveils AI-Powered Features Across iPhone, iPad and Mac",
    image: "/images/story-8.svg",
    sources: 10,
    perspective: { left: 15, center: 40, right: 45 },
  },
  {
    category: "Climate",
    location: "Global",
    title:
      "2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says",
    image: "/images/story-9.svg",
    sources: 14,
    perspective: { left: 33, center: 34, right: 33 },
  },
  {
    category: "Economy",
    location: "United States",
    title:
      "Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook",
    image: "/images/story-10.svg",
    sources: 13,
    perspective: { left: 30, center: 45, right: 26 },
  },
  {
    category: "Soccer",
    location: "Europe",
    title: "Real Madrid Win Champions League After Comeback Victory in Final",
    image: "/images/story-11.svg",
    sources: 26,
    perspective: { left: 9, center: 20, right: 70 },
  },
  {
    category: "Environment",
    location: "Canada",
    title: "Wildfires Force Thousands to Evacuate Across Western Canada",
    image: "/images/story-12.svg",
    sources: 17,
    perspective: { left: 27, center: 33, right: 40 },
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f1f2ef]">
      <HomeUtilityBar />
      <HomeHeader />
      <TopicBar />

      <main>
        <div className="mx-auto max-w-234 px-4 py-6.5 pb-4.5 md:px-11">
          <h1 className="mb-4 text-[24px] font-bold text-[#111111]">
            Top News
          </h1>

          <div
            data-testid="news-grid"
            className="grid grid-cols-1 gap-[20px_21px] md:grid-cols-2 lg:grid-cols-3"
          >
            {stories.map((story) => (
              <HomeNewsCard key={story.title} story={story} />
            ))}
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
