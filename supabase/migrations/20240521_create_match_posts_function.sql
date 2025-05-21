-- Drop the existing function first
drop function if exists match_posts(vector(1536), integer);

-- Create the match_posts function for vector similarity search
create or replace function match_posts(
  query_embedding vector(1536),
  match_count int
)
returns table (
  id uuid,
  title text,
  text text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    posts.id,
    posts.title,
    posts.text,
    1 - (posts.embedding <=> query_embedding) as similarity
  from posts
  where posts.embedding is not null
  order by posts.embedding <=> query_embedding
  limit match_count;
end;
$$; 