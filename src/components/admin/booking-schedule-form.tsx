"use client";

import { useActionState } from "react";
import { saveMeetLink, addAvailabilityRule } from "@/app/admin/(dashboard)/booking/actions";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DURATION_OPTIONS = [15, 30, 45, 60];

export function MeetLinkForm({ initialValue }: { initialValue: string }) {
  const [state, formAction, isPending] = useActionState(saveMeetLink, {
    error: null,
  });

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <div className="flex-1">
        <input
          name="meet_link"
          type="url"
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
          defaultValue={initialValue}
          className="input"
        />
        {state.error && <p className="mt-1.5 text-xs text-red">{state.error}</p>}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-2 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save link"}
      </button>
    </form>
  );
}

export function AddRuleForm() {
  const [state, formAction, isPending] = useActionState(addAvailabilityRule, {
    error: null,
  });

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="block">
          <span className="text-xs font-medium text-text-2">Day</span>
          <select name="day_of_week" defaultValue="1" className="input mt-1">
            {DAY_NAMES.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-text-2">Start (IST)</span>
          <input type="time" name="start_time" required className="input mt-1" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-text-2">End (IST)</span>
          <input type="time" name="end_time" required className="input mt-1" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-text-2">Slot length</span>
          <select name="slot_duration_minutes" defaultValue="30" className="input mt-1">
            {DURATION_OPTIONS.map((min) => (
              <option key={min} value={min}>
                {min} min
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.error && <p className="text-xs text-red">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-blue hover:text-blue disabled:opacity-60"
      >
        {isPending ? "Adding…" : "+ Add availability"}
      </button>
    </form>
  );
}
