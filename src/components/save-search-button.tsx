"use client";

import { BellIcon, CheckIcon } from "@/components/icons";
import { useNotificationPermission } from "@/lib/use-notification-permission";

export function SaveSearchButton() {
  const { permission, requestPermission } = useNotificationPermission();

  if (permission === "granted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-green bg-green-soft px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap text-green">
        <CheckIcon className="h-3.75 w-3.75" />
        Search saved
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={requestPermission}
      className="inline-flex items-center gap-1.5 rounded-md bg-blue px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-navy-2"
    >
      <BellIcon className="h-3.75 w-3.75" />
      Save this search & get alerts
    </button>
  );
}
