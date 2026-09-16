-- Tighten "admin" RLS policies from "any authenticated user" to "the admin,
-- specifically". 0001_init.sql predates public signup and assumed
-- auth.role() = 'authenticated' meant admin — that stopped being true once
-- job seekers could create their own accounts, leaving job_posts writes,
-- link_reports resolution, and read access to post_views/applied_reactions/
-- push_subscriptions (booker/visitor data) open to any signed-up user, not
-- just careerwithkumar@gmail.com.
--
-- is_admin() centralizes the check so a future admin-email change is a
-- one-line update here instead of re-editing every policy. Keep this in
-- sync with ADMIN_EMAIL in .env.local / Vercel — this is the DB-level half
-- of that same check; proxy.ts is the page-level half.

create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'email') = 'careerwithkumar@gmail.com', false);
$$;

drop policy if exists job_posts_admin_all on job_posts;
create policy job_posts_admin_all on job_posts
  for all using (is_admin()) with check (is_admin());

drop policy if exists post_views_admin_read on post_views;
create policy post_views_admin_read on post_views
  for select using (is_admin());

drop policy if exists applied_reactions_admin_read on applied_reactions;
create policy applied_reactions_admin_read on applied_reactions
  for select using (is_admin());

drop policy if exists link_reports_admin_all on link_reports;
create policy link_reports_admin_all on link_reports
  for all using (is_admin()) with check (is_admin());

drop policy if exists push_subscriptions_admin_read on push_subscriptions;
create policy push_subscriptions_admin_read on push_subscriptions
  for select using (is_admin());
