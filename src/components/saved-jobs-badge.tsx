"use client";

import { useSyncExternalStore } from "react";
import { HeartIcon } from "@/components/icons";
import { getSavedCount, subscribeSavedJobs } from "@/lib/saved-jobs-storage";

function getServerSnapshot() {
  return 0;
}

export function SavedJobsBadge() {
  const count = useSyncExternalStore(
    subscribeSavedJobs,
    getSavedCount,
    getServerSnapshot,
  );

  return (
    <span
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-text-2"
      aria-label={`${count} saved job${count === 1 ? "" : "s"}`}
    >
      <HeartIcon className="h-4.5 w-4.5" filled={count > 0} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
}
