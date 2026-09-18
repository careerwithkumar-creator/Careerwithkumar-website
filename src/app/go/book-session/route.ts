import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SESSION_COOKIE = "cwk_sid";

// The header's "Book a session" CTA points here instead of straight to
// Superprofile, so the click gets recorded before continuing on — a plain
// external <a> gives no server-side hook to count anything.
const BOOKING_LINK =
  "https://superprofile.bio/bookings/careerwithtkumar?sessionId=6a9bf3d0feb4740013772036";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value ?? null;

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("booking_click_events")
      .insert({ session_id: sessionId });
    if (error) console.error("Failed to record booking click:", error.message);
  } catch (error) {
    // Never let a broken tracking write block the redirect itself.
    console.error("Booking click tracking threw:", error);
  }

  return NextResponse.redirect(BOOKING_LINK);
}
