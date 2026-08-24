-- Fix: post_presence's original composite primary key (session_id,
-- job_post_id) implicitly made job_post_id NOT NULL, which broke site-wide
-- presence heartbeats (job_post_id = null). Switch to session_id alone.
alter table post_presence drop constraint post_presence_pkey;
alter table post_presence add primary key (session_id);
-- Dropping the composite PK does NOT revert the implicit NOT NULL it put on
-- job_post_id — that has to be lifted explicitly.
alter table post_presence alter column job_post_id drop not null;

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
