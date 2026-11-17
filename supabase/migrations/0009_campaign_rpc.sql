create function public.record_job_traffic(p_slug text,p_source text,p_campaign text,p_medium text,p_apply boolean) returns void language sql security definer set search_path = public as $$
 insert into job_traffic_daily(day,job_post_id,source,campaign,medium,views,apply_clicks)
 select current_date,id,p_source,p_campaign,p_medium,case when p_apply then 0 else 1 end,case when p_apply then 1 else 0 end from job_posts where slug=p_slug and status='published'
 on conflict(day,job_post_id,source,campaign,medium) do update set views=job_traffic_daily.views+excluded.views,apply_clicks=job_traffic_daily.apply_clicks+excluded.apply_clicks;
$$;
revoke all on function public.record_job_traffic(text,text,text,text,boolean) from public,anon,authenticated;
grant execute on function public.record_job_traffic(text,text,text,text,boolean) to service_role;
