-- Related articles via pgvector cosine similarity
-- Run in Supabase Dashboard -> SQL Editor after enabling pgvector.

create or replace function public.match_related_articles(
  query_embedding vector(1536),
  match_count int default 5,
  exclude_id uuid default null
)
returns table (
  id uuid,
  slug text,
  title text,
  image_url text,
  source_name text,
  published_at timestamptz
)
language sql
stable
as $$
  select a.id,
         a.slug,
         a.title,
         a.image_url,
         s.name as source_name,
         a.published_at
  from public.article_analyses aa
  join public.articles a on a.id = aa.article_id
  join public.sources s on s.id = a.source_id
  where aa.embedding is not null
    and aa.article_id is distinct from exclude_id
  order by aa.embedding <=> query_embedding
  limit match_count;
$$;