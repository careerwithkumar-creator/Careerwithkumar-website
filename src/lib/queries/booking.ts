import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingAvailabilityRule, SessionBooking } from "@/types/database";

export async function getAvailabilityRules(): Promise<BookingAvailabilityRule[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("booking_availability_rules")
    .select("*")
    .order("day_of_week")
    .order("start_time");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMeetLink(): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("booking_settings")
    .select("meet_link")
    .eq("id", 1)
    .single();

  if (error) throw new Error(error.message);
  return data?.meet_link ?? null;
}

export async function getUpcomingBookings(): Promise<SessionBooking[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("session_bookings")
    .select("*")
    .eq("status", "confirmed")
    .gte("slot_start", new Date().toISOString())
    .order("slot_start");

  if (error) throw new Error(error.message);
  return data ?? [];
}

// booking_click_events carries no RLS policies at all (see its migration),
// so these always go through the service-role client, even though the rest
// of the admin analytics page's stats use the anon-key/RLS path.
export async function getBookingClicksToday(): Promise<number> {
  const admin = createAdminClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count, error } = await admin
    .from("booking_click_events")
    .select("*", { count: "exact", head: true })
    .gte("clicked_at", startOfDay.toISOString());

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getBookingClicksAllTime(): Promise<number> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("booking_click_events")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getDailyBookingClickCounts(
  days = 14,
): Promise<{ date: string; count: number }[]> {
  const admin = createAdminClient();
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const { data, error } = await admin
    .from("booking_click_events")
    .select("clicked_at")
    .gte("clicked_at", since.toISOString());

  if (error) throw new Error(error.message);

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of data ?? []) {
    const key = row.clicked_at.slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([date, count]) => ({ date, count }));
}
