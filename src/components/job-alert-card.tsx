"use client";

import { BellIcon, CheckIcon } from "@/components/icons";
import { useNotificationPermission } from "@/lib/use-notification-permission";

export function JobAlertCard() {
  const { permission, requestPermission } = useNotificationPermission();
  const granted = permission === "granted";

  return (
    <div className="rounded-xl border border-border bg-surface p-5 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-soft text-amber">
        <BellIcon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-text">Job alert</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-text-2">
        Get instant alerts for the latest jobs matching your preferences.
      </p>
      {granted ? (
        <span className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-green bg-green-soft py-2 text-[13px] font-semibold text-green">
          <CheckIcon className="h-3.75 w-3.75" />
          Alerts on
        </span>
      ) : (
        <button
          type="button"
          onClick={requestPermission}
          className="mt-4 w-full rounded-md border border-border py-2 text-[13px] font-semibold text-text transition-colors hover:border-blue hover:text-blue"
        >
          Create alert
        </button>
      )}
    </div>
  );
}
