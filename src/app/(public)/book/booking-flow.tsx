"use client";

import { useActionState, useState } from "react";
import { CalendarIcon, ClockIcon, CheckCircleIcon, ExternalLinkIcon } from "@/components/icons";
import type { DaySlots } from "@/lib/booking/slots";
import { createBooking } from "./actions";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function BookingFlow({
  days,
  defaultName,
  userEmail,
}: {
  days: DaySlots[];
  defaultName: string;
  userEmail: string;
}) {
  const [selectedDay, setSelectedDay] = useState(days[0]?.dateKey);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(createBooking, {
    error: null,
    success: false,
  });

  if (state.success) {
    return (
      <div className="rounded-lg border border-border bg-surface p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-soft text-green">
          <CheckCircleIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-text">Session booked!</h2>
        <p className="mt-1.5 text-sm text-text-2">{state.slotLabel}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {state.meetLink && (
            <a
              href={state.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-2"
            >
              Join with Google Meet
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
          )}
          {state.addToCalendarUrl && (
            <a
              href={state.addToCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-blue hover:text-blue"
            >
              <CalendarIcon className="h-3.75 w-3.75" />
              Add to Google Calendar
            </a>
          )}
        </div>
        {!state.meetLink && (
          <p className="mt-4 text-sm text-text-3">
            The meeting link will be shared with you before the session.
          </p>
        )}
        <p className="mt-4 text-xs text-text-3">
          Save this link — a confirmation isn&apos;t emailed yet, so screenshot
          or bookmark this page.
        </p>
      </div>
    );
  }

  const activeDay = days.find((d) => d.dateKey === selectedDay);

  if (days.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-text-2">
          No slots are open right now — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-text">
        <CalendarIcon className="h-4 w-4 text-text-3" />
        Pick a day
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const isSelected = day.dateKey === selectedDay;
          const isFull = day.availableCount === 0;
          return (
            <button
              key={day.dateKey}
              type="button"
              disabled={isFull}
              onClick={() => {
                setSelectedDay(day.dateKey);
                setSelectedSlot(null);
              }}
              className={`flex shrink-0 flex-col items-center rounded-md border px-3.5 py-2 text-left transition-colors ${
                isSelected
                  ? "border-blue bg-blue-soft"
                  : "border-border bg-surface hover:border-blue"
              } ${isFull ? "cursor-not-allowed opacity-40" : ""}`}
            >
              <span className={`text-[13px] font-medium ${isSelected ? "text-blue" : "text-text"}`}>
                {day.label}
              </span>
              <span className="text-[11px] text-text-3">
                {isFull ? "Full" : `${day.availableCount} left`}
              </span>
            </button>
          );
        })}
      </div>

      {activeDay && (
        <>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-text">
            <ClockIcon className="h-4 w-4 text-text-3" />
            Pick a time (IST)
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {activeDay.slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.start)}
                className={`rounded-md border px-3 py-2 text-[13px] font-medium transition-colors ${
                  selectedSlot === slot.start
                    ? "border-blue bg-blue text-white"
                    : slot.available
                      ? "border-border bg-surface text-text hover:border-blue hover:text-blue"
                      : "cursor-not-allowed border-border-soft bg-border-soft text-text-3 line-through"
                }`}
              >
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedSlot && (
        <form action={formAction} className="mt-6 space-y-4 border-t border-border-soft pt-5">
          <input type="hidden" name="slot_start" value={selectedSlot} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-text-2">Your name</span>
              <input
                name="name"
                required
                defaultValue={defaultName}
                className="input mt-1"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-text-2">Email</span>
              <input
                value={userEmail}
                readOnly
                disabled
                className="input mt-1 cursor-not-allowed opacity-70"
              />
              <span className="mt-1 block text-[11px] text-text-3">
                Linked to your account
              </span>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-text-2">
              What would you like to discuss? (optional)
            </span>
            <textarea name="notes" rows={3} className="input mt-1" />
          </label>

          {state.error && (
            <p className="rounded-md bg-red-soft px-3 py-2 text-sm text-red">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-2 disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Booking…" : "Confirm booking"}
          </button>
        </form>
      )}
    </div>
  );
}
