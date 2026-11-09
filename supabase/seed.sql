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
  id, source_id, url, canonical_url, title, image_url, published_at,
  raw_text, scraped_at, analyzed_at, category, location, sources_count
)
values
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/1', 'https://biasly.invalid/stories/1', 'Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report', '/images/story-1.svg', '2026-05-30T12:00:00Z', 'Seeded display article.', now(), now(), 'Politics', 'United States', 12),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee02', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/2', 'https://biasly.invalid/stories/2', 'Researchers Make Case for Grapes as a ‘Superfood’ After Review of Health Evidence', '/images/story-2.svg', '2026-05-29T12:00:00Z', 'Seeded display article.', now(), now(), 'Health', 'United States', 7),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee03', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/3', 'https://biasly.invalid/stories/3', 'CERN Finds High-Significance Hint of Physics Beyond Standard Model', '/images/story-3.svg', '2026-05-28T12:00:00Z', 'Seeded display article.', now(), now(), 'Science', 'Switzerland', 8),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee04', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/4', 'https://biasly.invalid/stories/4', 'Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention', '/images/story-4.svg', '2026-05-27T12:00:00Z', 'Seeded display article.', now(), now(), 'World', 'Nicaragua', 63),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee05', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/5', 'https://biasly.invalid/stories/5', 'UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon', '/images/story-5.svg', '2026-05-26T12:00:00Z', 'Seeded display article.', now(), now(), 'World', 'Middle East', 15),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee06', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/6', 'https://biasly.invalid/stories/6', 'Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand', '/images/story-6.svg', '2026-05-25T12:00:00Z', 'Seeded display article.', now(), now(), 'Business', 'Global', 11),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee07', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/7', 'https://biasly.invalid/stories/7', 'SpaceX Launches Starship Test Flight in Milestone for Mars Program', '/images/story-7.svg', '2026-05-24T12:00:00Z', 'Seeded display article.', now(), now(), 'Technology', 'United States', 9),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee08', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/8', 'https://biasly.invalid/stories/8', 'Apple Unveils AI-Powered Features Across iPhone, iPad and Mac', '/images/story-8.svg', '2026-05-23T12:00:00Z', 'Seeded display article.', now(), now(), 'Technology', 'United States', 10),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee09', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/9', 'https://biasly.invalid/stories/9', '2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says', '/images/story-9.svg', '2026-05-22T12:00:00Z', 'Seeded display article.', now(), now(), 'Climate', 'Global', 14),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee10', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/10', 'https://biasly.invalid/stories/10', 'Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook', '/images/story-10.svg', '2026-05-21T12:00:00Z', 'Seeded display article.', now(), now(), 'Economy', 'United States', 13),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee11', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/11', 'https://biasly.invalid/stories/11', 'Real Madrid Win Champions League After Comeback Victory in Final', '/images/story-11.svg', '2026-05-20T12:00:00Z', 'Seeded display article.', now(), now(), 'Soccer', 'Europe', 26),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee12', '11111111-2222-3333-4444-555555555555', 'https://biasly.invalid/stories/12', 'https://biasly.invalid/stories/12', 'Wildfires Force Thousands to Evacuate Across Western Canada', '/images/story-12.svg', '2026-05-19T12:00:00Z', 'Seeded display article.', now(), now(), 'Environment', 'Canada', 17)
on conflict (id) do nothing;

insert into public.article_analyses (
  article_id, summary, sentiment_score, sentiment_label, bias_score, bias_label,
  left_percentage, center_percentage, right_percentage, confidence,
  framing_notes, loaded_terms, disclaimer, model
)
values
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01', 'Seeded display article.', 0, 'neutral', 0.29, 'right', 20, 31, 49, 0.7, array['Seeded from homepage mock data.'], array['seeded'], 'AI-estimated framing. Not an objective truth.', 'seed'),
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
on conflict (article_id) do nothing;