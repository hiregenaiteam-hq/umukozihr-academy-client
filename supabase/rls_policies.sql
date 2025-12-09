-- UmukoziHR Academy Row Level Security Policies
-- Run this AFTER schema.sql in Supabase SQL Editor

-- Enable RLS on all tables
alter table authors enable row level security;
alter table posts enable row level security;
alter table events enable row level security;
alter table post_aggregates enable row level security;
alter table submission_queue enable row level security;

-- Helper function to get current user's author record
create or replace function get_current_author_id()
returns uuid as $$
  select id from authors where supabase_user_id = auth.uid()
$$ language sql security definer;

-- Helper function to check if current user is admin or editor
create or replace function is_admin_or_editor()
returns boolean as $$
  select exists (
    select 1 from authors 
    where supabase_user_id = auth.uid() 
    and role in ('admin', 'editor')
    and approved = true
  )
$$ language sql security definer;

-- Helper function to check if current user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from authors 
    where supabase_user_id = auth.uid() 
    and role = 'admin'
    and approved = true
  )
$$ language sql security definer;

-- Helper function to check if current user is approved author
create or replace function is_approved_author()
returns boolean as $$
  select exists (
    select 1 from authors 
    where supabase_user_id = auth.uid() 
    and approved = true
  )
$$ language sql security definer;

-- AUTHORS POLICIES

-- Public can view approved authors
create policy "Anyone can view approved authors"
  on authors for select
  using (approved = true);

-- Users can view their own author profile
create policy "Users can view own author profile"
  on authors for select
  using (supabase_user_id = auth.uid());

-- Admin/editors can view all authors
create policy "Admins can view all authors"
  on authors for select
  using (is_admin_or_editor());

-- Users can update their own profile
create policy "Users can update own profile"
  on authors for update
  using (supabase_user_id = auth.uid())
  with check (
    supabase_user_id = auth.uid() 
    and role = (select role from authors where supabase_user_id = auth.uid())
    and approved = (select approved from authors where supabase_user_id = auth.uid())
  );

-- Admin can update any author
create policy "Admins can update any author"
  on authors for update
  using (is_admin());

-- Admin can insert authors
create policy "Admins can insert authors"
  on authors for insert
  with check (is_admin());

-- Admin can delete authors
create policy "Admins can delete authors"
  on authors for delete
  using (is_admin());

-- POSTS POLICIES

-- Public can view published posts
create policy "Anyone can view published posts"
  on posts for select
  using (status = 'published');

-- Authors can view their own posts (any status)
create policy "Authors can view own posts"
  on posts for select
  using (author_id = get_current_author_id());

-- Admin/editors can view all posts
create policy "Admins can view all posts"
  on posts for select
  using (is_admin_or_editor());

-- Approved authors can create posts
create policy "Approved authors can create posts"
  on posts for insert
  with check (
    is_approved_author() 
    and author_id = get_current_author_id()
  );

-- Authors can update their own drafts/pending posts
create policy "Authors can update own unpublished posts"
  on posts for update
  using (
    author_id = get_current_author_id() 
    and status in ('draft', 'pending')
  )
  with check (
    author_id = get_current_author_id()
    and status in ('draft', 'pending')
  );

-- Admin/editors can update any post
create policy "Admins can update any post"
  on posts for update
  using (is_admin_or_editor());

-- Authors can delete their own drafts
create policy "Authors can delete own drafts"
  on posts for delete
  using (
    author_id = get_current_author_id() 
    and status = 'draft'
  );

-- Admin can delete any post
create policy "Admins can delete any post"
  on posts for delete
  using (is_admin());

-- EVENTS POLICIES

-- Events are insert-only via server (service role key)
-- No public policies - all event inserts go through API route

-- Admin can view events for analytics
create policy "Admins can view events"
  on events for select
  using (is_admin_or_editor());

-- POST_AGGREGATES POLICIES

-- Authors can view their own post aggregates
create policy "Authors can view own post aggregates"
  on post_aggregates for select
  using (
    exists (
      select 1 from posts 
      where posts.id = post_aggregates.post_id 
      and posts.author_id = get_current_author_id()
    )
  );

-- Admin/editors can view all aggregates
create policy "Admins can view all aggregates"
  on post_aggregates for select
  using (is_admin_or_editor());

-- SUBMISSION_QUEUE POLICIES

-- Anyone can submit application (insert)
create policy "Anyone can submit application"
  on submission_queue for insert
  with check (true);

-- Users can view their own submission
create policy "Users can view own submission"
  on submission_queue for select
  using (email = (select email from auth.users where id = auth.uid()));

-- Admin can view all submissions
create policy "Admins can view all submissions"
  on submission_queue for select
  using (is_admin_or_editor());

-- Admin can update submissions
create policy "Admins can update submissions"
  on submission_queue for update
  using (is_admin_or_editor());

-- Admin can delete submissions
create policy "Admins can delete submissions"
  on submission_queue for delete
  using (is_admin());
