import { z } from "zod";

export const availabilityRuleSchema = z
  .object({
    day_of_week: z.coerce.number().int().min(0).max(6),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time"),
    slot_duration_minutes: z.coerce.number().int().positive(),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  });

// No email field — the booking is always recorded against the authenticated
// session's own email (see the createBooking action), never whatever a form
// post claims, so a signed-in visitor can't book under someone else's address.
export const bookingRequestSchema = z.object({
  slot_start: z.string().min(1, "Pick a time slot"),
  name: z.string().trim().min(1, "Name is required"),
  notes: z.string().trim().optional(),
});
