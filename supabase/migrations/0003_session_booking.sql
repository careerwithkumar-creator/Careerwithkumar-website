-- 1:1 session booking: a weekly recurring availability pattern the admin
-- sets once, plus the bookings visitors make against it.
--
-- Unlike job_posts et al, these tables carry no RLS policies at all — every
-- read/write goes through the service-role client (src/lib/supabase/admin.ts)
-- from trusted server code. That's deliberate: this app now has public
-- signup, so "authenticated" no longer means "the admin," and these rows
-- hold booker PII (name/email) that must never be readable via a public
-- anon-key query.

create table booking_availability_rules (
  id uuid primary key default gen_random_uuid(),
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0=Sunday
  start_time time not null,
  end_time time not null,
  slot_duration_minutes integer not null default 30 check (slot_duration_minutes > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create index booking_availability_rules_day_idx
  on booking_availability_rules (day_of_week) where is_active;

create table session_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  name text not null,
  email text not null,
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  meet_link text,
  created_at timestamptz not null default now()
);

-- Partial unique index (not a plain unique constraint) so a cancelled
-- booking never blocks someone else from taking that same slot.
create unique index session_bookings_active_slot_idx
  on session_bookings (slot_start) where status = 'confirmed';
create index session_bookings_slot_start_idx on session_bookings (slot_start);

-- Single-row settings table (the fixed Meet link, reused for every booking
-- until/unless this becomes per-booking Google Calendar generation later).
create table booking_settings (
  id smallint primary key default 1 check (id = 1),
  meet_link text,
  updated_at timestamptz not null default now()
);

insert into booking_settings (id, meet_link) values (1, null);

create trigger booking_settings_set_updated_at
  before update on booking_settings
  for each row
  execute function set_updated_at();

alter table booking_availability_rules enable row level security;
alter table session_bookings enable row level security;
alter table booking_settings enable row level security;
-- No policies — deny-all for anon/authenticated; service role bypasses RLS.
