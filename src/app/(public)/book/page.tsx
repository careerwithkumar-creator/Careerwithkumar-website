import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookingFlow } from "./booking-flow";
import { getAvailability } from "@/lib/booking/slots";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Book a 1:1 session — Careerwithkumar" };

export default async function BookPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/book");
  }

  const days = await getAvailability();
  const defaultName = String(user.user_metadata?.full_name ?? "");

  return (
    <div className="mx-auto w-full max-w-270 flex-1 px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-text">Book a 1:1 session</h1>
        <p className="mt-1.5 text-sm text-text-2">
          Pick a slot below for a free 1:1 over Google Meet — resume review,
          career guidance, or interview prep.
        </p>

        <div className="mt-6">
          <BookingFlow days={days} defaultName={defaultName} userEmail={user.email ?? ""} />
        </div>
      </div>
    </div>
  );
}
