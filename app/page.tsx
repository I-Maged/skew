import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { CategoryNav } from "@/components/layout/category-nav";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BiasMeter } from "@/components/ui/bias-meter";
import { Input } from "@/components/ui/input";
import { NewsCard } from "@/components/news/news-card";
import { RelatedArticleCard } from "@/components/news/related-article-card";
import {
  AISummaryCard,
  BiasAnalysisCard,
  SourceBreakdownCard,
} from "@/components/news/analysis-cards";

const sampleCards = [
  {
    title: "Senators Debate New Funding Package for Infrastructure",
    category: "Politics",
    location: "United States",
    left: 28,
    center: 41,
    right: 31,
    sourceCount: 18,
    readTime: "6 min read",
  },
  {
    title: "Tech Giants Announce Shared Standards for AI Safety",
    category: "Technology",
    location: "Global",
    left: 34,
    center: 45,
    right: 21,
    sourceCount: 12,
    readTime: "4 min read",
  },
  {
    title: "Central Banks Signal Slower Rate Cuts This Quarter",
    category: "Business",
    location: "Europe",
    left: 19,
    center: 36,
    right: 45,
    sourceCount: 21,
    readTime: "5 min read",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <UtilityBar />
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <Container className="py-10">
          <div className="mb-6 flex items-center gap-3">
            <Badge>Design system preview</Badge>
            <span className="text-sm text-text-secondary">
              Placeholder homepage — to be replaced by real news feed.
            </span>
          </div>

          <h1 className="font-sans text-3xl font-bold text-text-primary">
            Top News
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Three-column discovery grid built from the design system tokens.
          </p>

          <div
            data-testid="news-grid"
            className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {sampleCards.map((card) => (
              <NewsCard key={card.title} {...card} />
            ))}
          </div>

          <section className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card data-testid="token-reference" className="p-6">
              <h2 className="font-sans text-xl font-semibold text-text-primary">
                Token reference
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Primary text, secondary text, surface, borders, and bias meters
                all derive from CSS variables and adapt to dark mode.
              </p>
              <div className="mt-6">
                <BiasMeter left={28} center={41} right={31} />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="text">Text</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Input placeholder="Email address" className="max-w-xs" />
                <Button variant="primary">Subscribe</Button>
              </div>
            </Card>

            <div className="space-y-4">
              <BiasAnalysisCard
                overallLabel="Right 49%"
                basedOn="Based on 12 balanced sources"
                left={20}
                center={31}
                right={49}
                analysisText="Article cites multiple sources across the spectrum. Framing leans right on economic implications."
              />
              <AISummaryCard
                generated="Generated May 31, 2020"
                readTime="3 min read"
                bullets={[
                  "Key point one from the article.",
                  "Second important takeaway.",
                  "Third supporting detail.",
                ]}
                disclaimer="AI summaries can make mistakes."
              />
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-sans text-xl font-semibold text-text-primary">
              Source Breakdown & Related
            </h2>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <SourceBreakdownCard
                left={{ count: 4, percent: 33 }}
                center={{ count: 4, percent: 33 }}
                right={{ count: 4, percent: 34 }}
                topSources={[
                  { name: "Fox News", bias: "Right" },
                  { name: "BBC", bias: "Center" },
                  { name: "The Guardian", bias: "Left" },
                ]}
              />
              <div className="space-y-3">
                <RelatedArticleCard
                  title="Related story one about global markets"
                  category="Business · Europe"
                  date="May 31, 2020"
                />
                <RelatedArticleCard
                  title="Related story two on voting reforms"
                  category="Politics · United States"
                  date="Jun 01, 2020"
                />
              </div>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}