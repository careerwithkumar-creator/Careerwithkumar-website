"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { availabilityRuleSchema } from "@/lib/schemas/booking";

export type BookingFormState = { error: string | null };

export async function saveMeetLink(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const meetLink = String(formData.get("meet_link") ?? "").trim();
  if (meetLink && !/^https:\/\/meet\.google\.com\//.test(meetLink)) {
    return { error: "Enter a valid Google Meet link (https://meet.google.com/...)" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("booking_settings")
    .update({ meet_link: meetLink || null })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/booking");
  return { error: null };
}

export async function addAvailabilityRule(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const parsed = availabilityRuleSchema.safeParse({
    day_of_week: formData.get("day_of_week"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    slot_duration_minutes: formData.get("slot_duration_minutes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("booking_availability_rules").insert({
    day_of_week: parsed.data.day_of_week,
    start_time: `${parsed.data.start_time}:00`,
    end_time: `${parsed.data.end_time}:00`,
    slot_duration_minutes: parsed.data.slot_duration_minutes,
    is_active: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/booking");
  return { error: null };
}

export async function deleteAvailabilityRule(ruleId: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("booking_availability_rules")
    .delete()
    .eq("id", ruleId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/booking");
}

export async function cancelBooking(bookingId: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("session_bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/booking");
}
