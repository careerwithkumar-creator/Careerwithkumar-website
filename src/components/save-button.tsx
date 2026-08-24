"use client";

import { useSyncExternalStore } from "react";
import { HeartIcon } from "@/components/icons";
import { hasSaved, toggleSaved, subscribeSavedJobs } from "@/lib/saved-jobs-storage";

function getServerSnapshot() {
  return false;
}

export function SaveButton({ jobId }: { jobId: string }) {
  const saved = useSyncExternalStore(
    subscribeSavedJobs,
    () => hasSaved(jobId),
    getServerSnapshot,
  );

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(jobId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved jobs" : "Save job"}
      aria-pressed={saved}
      className={`shrink-0 rounded-md p-0.5 transition-colors ${
        saved ? "text-red" : "text-text-3 hover:text-red"
      }`}
    >
      <HeartIcon filled={saved} className="h-5 w-5" />
    </button>
  );
}
