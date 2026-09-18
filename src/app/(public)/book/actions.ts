"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getAvailability } from "@/lib/booking/slots";
import { bookingRequestSchema } from "@/lib/schemas/booking";
import { sendEmail } from "@/lib/email/resend";
import { buildGoogleCalendarLink } from "@/lib/booking/calendar-link";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export type BookingSubmitState = {
  error: string | null;
  success: boolean;
  slotLabel?: string;
  meetLink?: string | null;
  addToCalendarUrl?: string;
};

const initialState: BookingSubmitState = { error: null, success: false };

export async function createBooking(
  _prevState: BookingSubmitState,
  formData: FormData,
): Promise<BookingSubmitState> {
  // Page-level redirect already keeps a logged-out visitor from reaching
  // this form, but a server action is its own POST endpoint — re-checking
  // here is the actual security boundary, not just a UX nicety. The
  // session's own email is what gets recorded, never a posted value.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?next=/book");
  }

  const parsed = bookingRequestSchema.safeParse({
    slot_start: formData.get("slot_start"),
    name: formData.get("name"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { ...initialState, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // Re-derive availability server-side rather than trusting the posted
  // slot — the client's copy could be stale (another booking landed since
  // the page loaded) or simply tampered with.
  const days = await getAvailability();
  const matchedSlot = days
    .flatMap((d) => d.slots)
    .find((s) => s.start === parsed.data.slot_start);

  if (!matchedSlot || !matchedSlot.available) {
    return {
      ...initialState,
      error: "That slot is no longer available — please pick another.",
    };
  }

  const admin = createAdminClient();
  const { data: settings } = await admin
    .from("booking_settings")
    .select("meet_link")
    .eq("id", 1)
    .single();

  const { error } = await admin.from("session_bookings").insert({
    slot_start: matchedSlot.start,
    slot_end: matchedSlot.end,
    name: parsed.data.name,
    email: user.email,
    notes: parsed.data.notes || null,
    meet_link: settings?.meet_link ?? null,
    status: "confirmed",
  });

  if (error) {
    // Unique-violation on the active-slot index — someone else booked it
    // in the gap between our check above and this insert.
    if (error.code === "23505") {
      return {
        ...initialState,
        error: "That slot was just booked by someone else — please pick another.",
      };
    }
    return { ...initialState, error: "Couldn't book that slot. Please try again." };
  }

  const slotLabel = new Date(matchedSlot.start).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const calendarDetailsLines = [
    `Booked with: ${parsed.data.name} (${user.email})`,
    settings?.meet_link ? `Meet link: ${settings.meet_link}` : null,
    parsed.data.notes ? `Notes: ${parsed.data.notes}` : null,
  ].filter(Boolean);

  const addToCalendarUrl = buildGoogleCalendarLink({
    title: `1:1 session with ${parsed.data.name}`,
    startIso: matchedSlot.start,
    endIso: matchedSlot.end,
    details: calendarDetailsLines.join("\n"),
    location: settings?.meet_link ?? undefined,
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    // Fire-and-forget: a slow or failing email must never hold up the
    // booking confirmation the visitor is waiting on.
    void sendEmail({
      to: adminEmail,
      subject: `New 1:1 session booked — ${slotLabel} IST`,
      html: `
        <p><strong>${escapeHtml(parsed.data.name)}</strong> booked a 1:1 session.</p>
        <p><strong>When:</strong> ${slotLabel} IST</p>
        <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
        ${parsed.data.notes ? `<p><strong>Notes:</strong> ${escapeHtml(parsed.data.notes)}</p>` : ""}
        <p>
          <a href="${addToCalendarUrl}">Add to Google Calendar</a>
          &nbsp;·&nbsp;
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/booking">View in admin</a>
        </p>
      `,
    });
  }

  return {
    error: null,
    success: true,
    slotLabel: `${slotLabel} IST`,
    meetLink: settings?.meet_link ?? null,
    addToCalendarUrl,
  };
}
