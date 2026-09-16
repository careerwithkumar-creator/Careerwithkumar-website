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
