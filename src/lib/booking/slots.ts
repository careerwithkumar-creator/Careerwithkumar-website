import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// India doesn't observe DST, so a fixed offset is safe (no timezone library
// needed). Every wall-clock time in this file — rule start/end times, the
// day labels shown to visitors — is IST.
const IST_OFFSET_MIN = 330;
const DAY_MS = 24 * 60 * 60 * 1000;

// Don't let someone book a slot starting in the next hour — gives the admin
// a little notice instead of a booking landing 2 minutes before it starts.
const MIN_LEAD_MINUTES = 60;
const DAYS_AHEAD = 14;

export type Slot = { start: string; end: string; available: boolean };
export type DaySlots = {
  dateKey: string; // "2026-09-01"
  label: string; // "Tue, 1 Sep"
  slots: Slot[];
  availableCount: number;
  totalCount: number;
};

function istShifted(d: Date): Date {
  return new Date(d.getTime() + IST_OFFSET_MIN * 60_000);
}

function dateKeyOf(istShiftedDate: Date): string {
  const y = istShiftedDate.getUTCFullYear();
  const m = String(istShiftedDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(istShiftedDate.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// A specific IST calendar date + "HH:MM:SS" time-of-day -> the real UTC instant.
function istToUtc(dateKey: string, timeStr: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  const [h, min, s] = timeStr.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, min ?? 0, s ?? 0) - IST_OFFSET_MIN * 60_000);
}

function dayLabel(istShiftedDate: Date): string {
  return new Date(
    Date.UTC(
      istShiftedDate.getUTCFullYear(),
      istShiftedDate.getUTCMonth(),
      istShiftedDate.getUTCDate(),
    ),
  ).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export async function getAvailability(): Promise<DaySlots[]> {
  const admin = createAdminClient();
  const [{ data: rules }, { data: bookings }] = await Promise.all([
    admin
      .from("booking_availability_rules")
      .select("*")
      .eq("is_active", true),
    admin
      .from("session_bookings")
      .select("slot_start")
      .eq("status", "confirmed"),
  ]);

  return computeAvailability(rules ?? [], bookings ?? []);
}

// Pure so it's testable and reusable from the booking action (which
// re-derives availability server-side to validate a submission rather than
// trusting whatever the client posted).
export function computeAvailability(
  rules: { day_of_week: number; start_time: string; end_time: string; slot_duration_minutes: number }[],
  bookedRows: { slot_start: string }[],
  now: Date = new Date(),
): DaySlots[] {
  const bookedSet = new Set(bookedRows.map((b) => new Date(b.slot_start).toISOString()));
  const minBookableMs = now.getTime() + MIN_LEAD_MINUTES * 60_000;
  const nowIst = istShifted(now);

  const days: DaySlots[] = [];

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const dayIst = new Date(nowIst.getTime() + i * DAY_MS);
    const dateKey = dateKeyOf(dayIst);
    const dow = dayIst.getUTCDay();

    const dayRules = rules.filter((r) => r.day_of_week === dow);
    if (dayRules.length === 0) continue;

    // Keyed by start time so two overlapping rules for the same day (e.g.
    // one added by mistake, or a broad rule plus a narrower override) can't
    // produce the same slot twice.
    const slotsByStart = new Map<string, Slot>();
    for (const rule of dayRules) {
      let cursor = istToUtc(dateKey, rule.start_time);
      const end = istToUtc(dateKey, rule.end_time);
      const stepMs = rule.slot_duration_minutes * 60_000;

      while (cursor.getTime() + stepMs <= end.getTime()) {
        const slotEnd = new Date(cursor.getTime() + stepMs);
        if (cursor.getTime() >= minBookableMs) {
          const startIso = cursor.toISOString();
          slotsByStart.set(startIso, {
            start: startIso,
            end: slotEnd.toISOString(),
            available: !bookedSet.has(startIso),
          });
        }
        cursor = slotEnd;
      }
    }

    if (slotsByStart.size === 0) continue;

    const slots = [...slotsByStart.values()].sort((a, b) =>
      a.start.localeCompare(b.start),
    );
    days.push({
      dateKey,
      label: dayLabel(dayIst),
      slots,
      availableCount: slots.filter((s) => s.available).length,
      totalCount: slots.length,
    });
  }

  return days;
}
