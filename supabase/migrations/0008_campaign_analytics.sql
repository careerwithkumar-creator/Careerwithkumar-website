create table public.job_traffic_daily (
 day date not null default current_date, job_post_id uuid not null references public.job_posts(id) on delete cascade,
 source text not null default 'direct', campaign text not null default '', medium text not null default '',
 views bigint not null default 0, apply_clicks bigint not null default 0,
 primary key(day,job_post_id,source,campaign,medium), check(length(campaign)<=80), check(length(medium)<=40), check(source in ('instagram','whatsapp','google','direct','other'))
);
alter table public.job_traffic_daily enable row level security;
create policy traffic_admin_read on public.job_traffic_daily for select to authenticated using(public.is_admin());
-- Only server-side writes. No anonymous writable RPC.
revoke all on public.job_traffic_daily from anon, authenticated;
grant select on public.job_traffic_daily to authenticated;
