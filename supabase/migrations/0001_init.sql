-- Careerwithkumar schema
-- Single-admin app: RLS allows public read of published jobs and public
-- write only through SECURITY DEFINER RPC functions below. Direct table
-- writes to engagement tables are reserved for the authenticated admin.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type job_category as enum ('govt', 'private', 'internship', 'remote', 'walkin');
create type job_status as enum ('draft', 'published', 'archived');
create type job_source as enum ('manual', 'instagram');

-- ---------------------------------------------------------------------------
-- job_posts
-- ---------------------------------------------------------------------------
create table job_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  company text not null,
  location text,
  category job_category not null,
  description text not null default '',
  eligibility text,
  salary text,
  apply_url text,
  deadline_at timestamptz,
  status job_status not null default 'draft',
  source job_source not null default 'manual',
  ig_media_id text unique,
  cover_image_url text,
  view_count integer not null default 0,
  applied_count integer not null default 0,
  report_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index job_posts_status_published_idx on job_posts (status, published_at desc);
create index job_posts_category_idx on job_posts (category);
create index job_posts_ig_media_id_idx on job_posts (ig_media_id);

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger job_posts_set_updated_at
  before update on job_posts
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- post_views (raw view events, used for hourly sparkline aggregation)
-- ---------------------------------------------------------------------------
create table post_views (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid not null references job_posts(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  session_id text not null
);

create index post_views_job_post_id_idx on post_views (job_post_id, viewed_at desc);

-- ---------------------------------------------------------------------------
-- applied_reactions (one tap per session per post)
-- ---------------------------------------------------------------------------
create table applied_reactions (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid not null references job_posts(id) on delete cascade,
  session_id text not null,
  created_at timestamptz not null default now(),
  unique (job_post_id, session_id)
);

-- ---------------------------------------------------------------------------
-- link_reports
-- ---------------------------------------------------------------------------
create table link_reports (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid not null references job_posts(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  resolved boolean not null default false
);

create index link_reports_job_post_id_idx on link_reports (job_post_id);

-- ---------------------------------------------------------------------------
-- push_subscriptions
-- ---------------------------------------------------------------------------
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- post_presence ("reading now" live counter, short TTL heartbeat rows)
-- ---------------------------------------------------------------------------
-- One row per session: whatever the session is currently looking at (a
-- specific post, or null for site-wide/home). A composite primary key on
-- (session_id, job_post_id) doesn't work here since primary key columns are
-- implicitly NOT NULL in Postgres, and job_post_id must be nullable.
create table post_presence (
  session_id text primary key,
  job_post_id uuid references job_posts(id) on delete cascade,
  last_seen_at timestamptz not null default now()
);

create index post_presence_last_seen_idx on post_presence (last_seen_at desc);
create index post_presence_job_post_id_idx on post_presence (job_post_id);

alter publication supabase_realtime add table post_presence;
alter publication supabase_realtime add table job_posts;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table job_posts enable row level security;
alter table post_views enable row level security;
alter table applied_reactions enable row level security;
alter table link_reports enable row level security;
alter table push_subscriptions enable row level security;
alter table post_presence enable row level security;

-- Public can read published posts; admin (any authenticated user — this app
-- has a single admin account and no public signup) can read/write everything.
create policy job_posts_public_read on job_posts
  for select using (status = 'published');

create policy job_posts_admin_all on job_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Engagement tables: no direct anon access. All public writes go through the
-- SECURITY DEFINER functions below; admin can read for the dashboard.
create policy post_views_admin_read on post_views
  for select using (auth.role() = 'authenticated');

create policy applied_reactions_admin_read on applied_reactions
  for select using (auth.role() = 'authenticated');

create policy link_reports_admin_all on link_reports
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy push_subscriptions_admin_read on push_subscriptions
  for select using (auth.role() = 'authenticated');

create policy post_presence_read on post_presence
  for select using (true);

-- ---------------------------------------------------------------------------
-- RPC functions (SECURITY DEFINER — callable by anon, bypass RLS internally)
-- ---------------------------------------------------------------------------

-- Record a de-duplicated view by slug. Called from middleware, which
-- resolves it in one round trip and only calls it once per (post, session)
-- per day — enforced by an app-side "viewed_<slug>" cookie — this function
-- just performs the write atomically. Only published posts count.
create or replace function record_post_view_by_slug(p_slug text, p_session_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_post_id uuid;
begin
  select id into v_post_id from job_posts where slug = p_slug and status = 'published';
  if v_post_id is null then
    return;
  end if;

  insert into post_views (job_post_id, session_id) values (v_post_id, p_session_id);
  update job_posts set view_count = view_count + 1 where id = v_post_id;
end;
$$;

grant execute on function record_post_view_by_slug(text, text) to anon, authenticated;

-- Record an "applied" tap. Silently no-ops on a duplicate (session, post).
-- Returns true if this call actually counted.
create or replace function record_applied(p_job_post_id uuid, p_session_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into applied_reactions (job_post_id, session_id)
  values (p_job_post_id, p_session_id)
  on conflict (job_post_id, session_id) do nothing;

  if found then
    update job_posts set applied_count = applied_count + 1 where id = p_job_post_id;
    return true;
  end if;
  return false;
end;
$$;

grant execute on function record_applied(uuid, text) to anon, authenticated;

-- Report a broken link. Bumps report_count; the admin dashboard flags the
-- post as "needs review" once report_count >= 3 (derived, no status change).
create or replace function record_link_report(p_job_post_id uuid, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into link_reports (job_post_id, reason) values (p_job_post_id, p_reason);
  update job_posts set report_count = report_count + 1 where id = p_job_post_id;
end;
$$;

grant execute on function record_link_report(uuid, text) to anon, authenticated;

-- Upsert a presence heartbeat. Client calls this every ~15s while a tab is
-- open; p_job_post_id is null when browsing the home/feed rather than a post.
create or replace function upsert_presence(p_session_id text, p_job_post_id uuid default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into post_presence (session_id, job_post_id, last_seen_at)
  values (p_session_id, p_job_post_id, now())
  on conflict (session_id)
  do update set job_post_id = excluded.job_post_id, last_seen_at = now();

  delete from post_presence where last_seen_at < now() - interval '2 minutes';
end;
$$;

grant execute on function upsert_presence(text, uuid) to anon, authenticated;

-- Public opt-in for push notifications.
create or replace function record_push_subscription(p_endpoint text, p_keys jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into push_subscriptions (endpoint, keys)
  values (p_endpoint, p_keys)
  on conflict (endpoint) do update set keys = excluded.keys;
end;
$$;

grant execute on function record_push_subscription(text, jsonb) to anon, authenticated;
