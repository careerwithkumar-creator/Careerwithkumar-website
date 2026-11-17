-- Additive migration. Existing company/salary/eligibility/apply_url/deadline_at conventions retained.
alter table public.job_posts add column if not exists employment_type text;
alter table public.job_posts add column if not exists qualification text;
alter table public.job_posts add column if not exists eligible_batches text;
alter table public.job_posts add column if not exists age_limit text;
alter table public.job_posts add column if not exists experience_required text;
alter table public.job_posts add column if not exists skills text;
alter table public.job_posts add column if not exists selection_process text;
alter table public.job_posts add column if not exists application_fee text;
alter table public.job_posts add column if not exists required_documents text;
alter table public.job_posts add column if not exists application_steps text;
alter table public.job_posts add column if not exists eligibility_notes text;
alter table public.job_posts add column if not exists official_notification_url text;
alter table public.job_posts add column if not exists company_logo text;
alter table public.job_posts add column if not exists application_start_date text;
alter table public.job_posts add column if not exists vacancies text;
alter table public.job_posts add column if not exists featured boolean not null default false;
create index if not exists job_posts_deadline_idx on public.job_posts(deadline_at) where status = 'published';
create index if not exists job_posts_featured_idx on public.job_posts(featured, published_at desc) where status = 'published';
create index if not exists job_posts_search_idx on public.job_posts using gin(to_tsvector('english', title || ' ' || company || ' ' || description));
-- Existing public published-only and is_admin() policies remain in force.
