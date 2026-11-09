-- biasly core database schema
-- Run this file in Supabase Dashboard -> SQL Editor before testing.

create extension if not exists "pgcrypto";

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  listing_url text not null,
  parser_strategy text,
  active boolean not null default true,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  url text not null unique,
  canonical_url text,
  title text not null,
  image_url text not null,
  published_at timestamptz not null,
  raw_text text,
  scraped_at timestamptz not null default now(),
  analyzed_at timestamptz,
  created_at timestamptz not null default now(),
  category text not null default 'News',
  location text not null default 'Global',
  sources_count integer not null default 1 check (sources_count >= 0)
);

create table if not exists public.article_analyses (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null unique references public.articles(id) on delete cascade,
  summary text,
  sentiment_score numeric(4,3) check (sentiment_score between -1 and 1),
  sentiment_label text check (sentiment_label in ('positive', 'neutral', 'negative')),
  bias_score numeric(4,3) check (bias_score between -1 and 1),
  bias_label text check (bias_label in ('left', 'center', 'right', 'mixed', 'unclear')),
  left_percentage integer not null default 0 check (left_percentage between 0 and 100),
  center_percentage integer not null default 0 check (center_percentage between 0 and 100),
  right_percentage integer not null default 0 check (right_percentage between 0 and 100),
  confidence numeric(4,3) check (confidence between 0 and 1),
  framing_notes text[] not null default '{}',
  loaded_terms text[] not null default '{}',
  disclaimer text,
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  level text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.oxylabs_schedules (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  oxylabs_remote_id text not null unique,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oxylabs_schedule_runs (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.oxylabs_schedules(id) on delete cascade,
  remote_run_id text,
  result_status text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists articles_source_id_idx on public.articles(source_id);
create index if not exists articles_published_at_idx on public.articles(published_at desc);
create index if not exists articles_url_idx on public.articles(url);
create index if not exists article_analyses_article_id_idx on public.article_analyses(article_id);
create index if not exists oxylabs_schedules_source_id_idx on public.oxylabs_schedules(source_id);
create index if not exists oxylabs_schedule_runs_schedule_id_idx on public.oxylabs_schedule_runs(schedule_id);

alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.article_analyses enable row level security;
alter table public.logs enable row level security;
alter table public.oxylabs_schedules enable row level security;
alter table public.oxylabs_schedule_runs enable row level security;

create policy "public_read_sources"
  on public.sources for select
  to anon, authenticated
  using (true);

create policy "public_read_articles"
  on public.articles for select
  to anon, authenticated
  using (true);

create policy "public_read_article_analyses"
  on public.article_analyses for select
  to anon, authenticated
  using (true);

grant usage on schema public to anon, authenticated;
grant select on public.sources, public.articles, public.article_analyses to anon, authenticated;