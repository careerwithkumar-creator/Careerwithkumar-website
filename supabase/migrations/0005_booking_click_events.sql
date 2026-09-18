-- Tracks clicks on the "Book a session" button (which redirects out to
-- Superprofile via /go/book-session). Same convention as the other booking
-- tables — no RLS policies, service-role-only access from trusted server code.

create table booking_click_events (
  id uuid primary key default gen_random_uuid(),
  clicked_at timestamptz not null default now(),
  session_id text
);

create index booking_click_events_clicked_at_idx on booking_click_events (clicked_at desc);

alter table booking_click_events enable row level security;
-- No policies — deny-all for anon/authenticated; service role bypasses RLS.
