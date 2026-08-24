"use client";

import { BellIcon, CheckIcon } from "@/components/icons";
import { useNotificationPermission } from "@/lib/use-notification-permission";

export function GetAlertsButton() {
  const { permission, requestPermission } = useNotificationPermission();

  if (permission === "granted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-green bg-green-soft px-3.5 py-2 text-[13px] font-semibold text-green">
        <CheckIcon className="h-3.75 w-3.75" />
        Alerts on
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={requestPermission}
      className="inline-flex items-center gap-1.5 rounded-md border border-blue bg-surface px-3.5 py-2 text-[13px] font-semibold text-blue transition-colors hover:bg-bg"
    >
      <BellIcon className="h-3.75 w-3.75" />
      Get alerts
    </button>
  );
}
