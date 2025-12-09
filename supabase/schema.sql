-- UmukoziHR Academy Database Schema
-- Run this in Supabase SQL Editor

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Create custom types
create type user_role as enum ('admin', 'editor', 'author', 'reader');
create type post_status as enum ('draft', 'pending', 'published');
create type post_category as enum ('hr', 'talent', 'team');
create type event_type as enum ('post_opened', 'post_scrolled', 'post_shared', 'cta_clicked');
create type submission_status as enum ('pending', 'approved', 'rejected');

-- Authors table
create table authors (
  id uuid primary key default uuid_generate_v4(),
  supabase_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text unique not null,
  bio text,
  avatar_url text,
  approved boolean default false,
  role user_role default 'author',
  linkedin_url text,
  organization text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts table
create table posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  body text not null,
  excerpt text,
  status post_status default 'draft',
  author_id uuid references authors(id) on delete cascade not null,
  category post_category not null,
  thumbnail_url text,
  featured boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events table (analytics raw data)
create table events (
  id bigserial primary key,
  event_type event_type not null,
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references authors(id) on delete set null,
  anon_id text,
  meta jsonb,
  created_at timestamptz default now()
);

-- Post aggregates table (materialized metrics)
create table post_aggregates (
  post_id uuid references posts(id) on delete cascade,
  day date not null,
  views int default 0,
  uniques int default 0,
  avg_time numeric,
  scroll_50 int default 0,
  shares int default 0,
  cta_clicks int default 0,
  primary key (post_id, day)
);

-- Submission queue for author applications
create table submission_queue (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  bio text,
  linkedin_url text,
  organization text,
  reason text,
  status submission_status default 'pending',
  reviewed_by uuid references authors(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- Create indexes for performance
create index idx_posts_slug on posts(slug);
create index idx_posts_status on posts(status);
create index idx_posts_category on posts(category);
create index idx_posts_author on posts(author_id);
create index idx_posts_published_at on posts(published_at desc);
create index idx_posts_featured on posts(featured) where featured = true;
create index idx_events_post_id on events(post_id);
create index idx_events_created_at on events(created_at);
create index idx_events_type on events(event_type);
create index idx_authors_user_id on authors(supabase_user_id);
create index idx_authors_approved on authors(approved);
create index idx_submission_status on submission_queue(status);

-- Full text search index for posts
create index idx_posts_search on posts using gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, ''))
);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger authors_updated_at
  before update on authors
  for each row execute function update_updated_at();

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

-- Function to auto-set published_at when status changes to published
create or replace function set_published_at()
returns trigger as $$
begin
  if new.status = 'published' and old.status != 'published' then
    new.published_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger posts_published_at
  before update on posts
  for each row execute function set_published_at();

-- Function to generate slug from title
create or replace function generate_slug(title text)
returns text as $$
begin
  return lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
end;
$$ language plpgsql;

-- Create storage bucket for media uploads
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policy for media bucket (public read, authenticated write)
create policy "Public read access for media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "Users can update own media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]);
