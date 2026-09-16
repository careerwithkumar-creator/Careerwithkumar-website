"use client";

import { useTransition } from "react";
import { cancelBooking } from "@/app/admin/(dashboard)/booking/actions";

export function CancelBookingButton({
  bookingId,
  name,
}: {
  bookingId: string;
  name: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Cancel the session with ${name}?`)) return;
    startTransition(() => cancelBooking(bookingId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-text-2 transition-colors hover:border-red hover:text-red disabled:opacity-50"
    >
      Cancel
    </button>
  );
}
