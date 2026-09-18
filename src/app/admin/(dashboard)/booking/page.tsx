import type { Metadata } from "next";
import { DeleteRuleButton } from "@/components/admin/delete-rule-button";
import { CancelBookingButton } from "@/components/admin/cancel-booking-button";
import { MeetLinkForm, AddRuleForm } from "@/components/admin/booking-schedule-form";
import {
  getAvailabilityRules,
  getMeetLink,
  getUpcomingBookings,
} from "@/lib/queries/booking";

export const metadata: Metadata = { title: "Booking — Careerwithkumar Admin" };

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTimeOfDay(hhmmss: string): string {
  const [h, m] = hhmmss.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatSlotTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function AdminBookingPage() {
  const [rules, meetLink, bookings] = await Promise.all([
    getAvailabilityRules(),
    getMeetLink(),
    getUpcomingBookings(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold text-text">1:1 session booking</h1>
      <p className="mt-1 text-sm text-text-2">
        Set your weekly availability and Meet link — visitors book directly
        against it at <span className="font-medium text-text">/book</span>.
      </p>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-text">Google Meet link</h2>
        <p className="mt-1 text-[12.5px] text-text-2">
          Reused for every booking. Create one once at{" "}
          <a
            href="https://meet.google.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue hover:underline"
          >
            meet.google.com/new
          </a>
          .
        </p>
        <div className="mt-3">
          <MeetLinkForm initialValue={meetLink ?? ""} />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-text">Weekly availability</h2>

        {rules.length === 0 ? (
          <p className="mt-3 text-[13px] text-text-3">
            No availability set yet — add a slot below.
          </p>
        ) : (
          <div className="mt-3 flex flex-col divide-y divide-border-soft">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between py-2.5"
              >
                <span className="text-[13.5px] text-text">
                  <span className="font-medium">{DAY_NAMES[rule.day_of_week]}</span>{" "}
                  · {formatTimeOfDay(rule.start_time)}–
                  {formatTimeOfDay(rule.end_time)} · {rule.slot_duration_minutes}
                  -min slots
                </span>
                <DeleteRuleButton ruleId={rule.id} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-border-soft pt-4">
          <AddRuleForm />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-text">Upcoming sessions</h2>

        {bookings.length === 0 ? (
          <p className="mt-3 text-[13px] text-text-3">No sessions booked yet.</p>
        ) : (
          <div className="mt-3 flex flex-col divide-y divide-border-soft">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13.5px] font-medium text-text">
                    {formatSlotTime(booking.slot_start)}
                  </p>
                  <p className="text-[12.5px] text-text-2">
                    {booking.name} · {booking.email}
                  </p>
                  {booking.notes && (
                    <p className="mt-0.5 text-[12px] text-text-3">{booking.notes}</p>
                  )}
                </div>
                <CancelBookingButton bookingId={booking.id} name={booking.name} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
