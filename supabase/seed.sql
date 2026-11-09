-- Seed display data for the homepage read path.
-- Run after supabase/schema.sql. These rows are display-only seed data.

insert into public.sources (id, name, listing_url, parser_strategy, active, logo_url)
values (
  '11111111-2222-3333-4444-555555555555',
  'Biasly Seed Source (Display Only)',
  'https://biasly.invalid/seed',
  'seed',
  false,
  null
)
on conflict (id) do nothing;

insert into public.articles (
  id, source_id, url, canonical_url, title, slug, image_url, published_at,
  raw_text, scraped_at, analyzed_at, category, location, sources_count
)
values
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/1', 'https://biasly.invalid/stories/1', 'Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report', 'trump-iran-proposal', '/images/story-1.svg', '2026-05-30T12:00:00Z', 'The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and centrifugation measures, according to a report published Saturday.

The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.

“This is a take-it-or-leave-it proposal,” a senior administration official told the Wall Street Journal. “The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk.”

Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran’s right to peaceful nuclear energy and include the lifting of all U.S. sanctions.

The fate of the proposal now rests with Iran, as global attention remains focused on whether a new nuclear agreement can be reached—or if tensions will escalate further.', now(), now(), 'Politics', 'United States', 12),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee02', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/2', 'https://biasly.invalid/stories/2', 'Researchers Make Case for Grapes as a â€˜Superfoodâ€™ After Review of Health Evidence', 'researchers-make-case-for-grapes-as-a-superfood-after-review-of-health-evidence', '/images/story-2.svg', '2026-05-29T12:00:00Z', 'Seeded display article.', now(), now(), 'Health', 'United States', 7),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee03', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/3', 'https://biasly.invalid/stories/3', 'CERN Finds High-Significance Hint of Physics Beyond Standard Model', 'cern-finds-high-significance-hint-of-physics-beyond-standard-model', '/images/story-3.svg', '2026-05-28T12:00:00Z', 'Seeded display article.', now(), now(), 'Science', 'Switzerland', 8),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee04', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/4', 'https://biasly.invalid/stories/4', 'Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention', 'indigenous-leader-brooklyn-rivera-dies-in-nicaragua-after-nearly-3-years-of-detention', '/images/story-4.svg', '2026-05-27T12:00:00Z', 'Seeded display article.', now(), now(), 'World', 'Nicaragua', 63),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee05', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/5', 'https://biasly.invalid/stories/5', 'UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon', 'un-security-council-to-hold-emergency-meeting-as-israel-pushes-deeper-into-lebanon', '/images/story-5.svg', '2026-05-26T12:00:00Z', 'Seeded display article.', now(), now(), 'World', 'Middle East', 15),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee06', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/6', 'https://biasly.invalid/stories/6', 'Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand', 'oil-prices-dip-as-opec-considers-output-increase-amid-weak-demand', '/images/story-6.svg', '2026-05-25T12:00:00Z', 'Seeded display article.', now(), now(), 'Business', 'Global', 11),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee07', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/7', 'https://biasly.invalid/stories/7', 'SpaceX Launches Starship Test Flight in Milestone for Mars Program', 'spacex-launches-starship-test-flight-in-milestone-for-mars-program', '/images/story-7.svg', '2026-05-24T12:00:00Z', 'Seeded display article.', now(), now(), 'Technology', 'United States', 9),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee08', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/8', 'https://biasly.invalid/stories/8', 'Apple Unveils AI-Powered Features Across iPhone, iPad and Mac', 'apple-unveils-ai-powered-features-across-iphone-ipad-and-mac', '/images/story-8.svg', '2026-05-23T12:00:00Z', 'Seeded display article.', now(), now(), 'Technology', 'United States', 10),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee09', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/9', 'https://biasly.invalid/stories/9', '2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says', '2025-on-track-to-be-among-top-3-hottest-years-eu-climate-service-says', '/images/story-9.svg', '2026-05-22T12:00:00Z', 'Seeded display article.', now(), now(), 'Climate', 'Global', 14),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee10', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/10', 'https://biasly.invalid/stories/10', 'Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook', 'fed-holds-rates-steady-signals-caution-on-inflation-and-growth-outlook', '/images/story-10.svg', '2026-05-21T12:00:00Z', 'Seeded display article.', now(), now(), 'Economy', 'United States', 13),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee11', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/11', 'https://biasly.invalid/stories/11', 'Real Madrid Win Champions League After Comeback Victory in Final', 'real-madrid-win-champions-league-after-comeback-victory-in-final', '/images/story-11.svg', '2026-05-20T12:00:00Z', 'Seeded display article.', now(), now(), 'Soccer', 'Europe', 26),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee12', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/12', 'https://biasly.invalid/stories/12', 'Wildfires Force Thousands to Evacuate Across Western Canada', 'wildfires-force-thousands-to-evacuate-across-western-canada', '/images/story-12.svg', '2026-05-19T12:00:00Z', 'Seeded display article.', now(), now(), 'Environment', 'Canada', 17)
on conflict (id) do update set slug=excluded.slug, raw_text=excluded.raw_text, category=excluded.category, location=excluded.location, sources_count=excluded.sources_count;

insert into public.article_analyses (
  article_id, summary, sentiment_score, sentiment_label, bias_score, bias_label,
  left_percentage, center_percentage, right_percentage, confidence,
  framing_notes, loaded_terms, disclaimer, model
)
values
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01', 'Seeded display article.', 0, 'neutral', 0.29, 'right', 20, 31, 49, 0.7, array['The Trump administration has sent Iran a revised nuclear deal proposal with tougher terms, including a complete halt to uranium enrichment and the removal of enriched uranium stockpiles.', 'The proposal also demands unrestricted inspector access to all nuclear sites, including military facilities.', 'Iran has not responded officially but says any deal must respect its right to peaceful nuclear energy and include sanctions relief.', 'The U.S. warns it is prepared to take other action if diplomacy fails, while European allies urge continued negotiations.', 'Israel supports the tougher stance, praising the administration’s determination to prevent Iran from acquiring nuclear weapons.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee02', 'Seeded display article.', 0, 'neutral', 0.22, 'right', 18, 42, 40, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee03', 'Seeded display article.', 0, 'neutral', 0.06, 'center', 16, 62, 22, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee04', 'Seeded display article.', 0, 'neutral', -0.36, 'left', 54, 28, 18, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee05', 'Seeded display article.', 0, 'neutral', 0.21, 'right', 22, 35, 43, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee06', 'Seeded display article.', 0, 'neutral', 0.03, 'center', 25, 50, 28, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee07', 'Seeded display article.', 0, 'neutral', 0.37, 'right', 12, 45, 49, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee08', 'Seeded display article.', 0, 'neutral', 0.30, 'right', 15, 40, 45, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee09', 'Seeded display article.', 0, 'neutral', 0.00, 'mixed', 33, 34, 33, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee10', 'Seeded display article.', 0, 'neutral', -0.04, 'center', 30, 45, 26, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee11', 'Seeded display article.', 0, 'neutral', 0.61, 'right', 9, 20, 70, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee12', 'Seeded display article.', 0, 'neutral', 0.13, 'right', 27, 33, 40, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed')
on conflict (article_id) do update set summary=excluded.summary, framing_notes=excluded.framing_notes, loaded_terms=excluded.loaded_terms, disclaimer=excluded.disclaimer;
