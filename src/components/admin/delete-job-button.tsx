"use client";

import { useTransition } from "react";
import { TrashIcon } from "@/components/icons";
import { deleteJobPost } from "@/app/admin/(dashboard)/jobs/actions";

export function DeleteJobButton({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${jobTitle}"? This can't be undone.`)) return;
    startTransition(() => {
      deleteJobPost(jobId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-md p-1.5 text-text-3 transition-colors hover:bg-red-soft hover:text-red disabled:opacity-50"
      aria-label={`Delete ${jobTitle}`}
    >
      <TrashIcon className="h-3.75 w-3.75" />
    </button>
  );
}
