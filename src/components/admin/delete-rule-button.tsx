"use client";

import { useTransition } from "react";
import { TrashIcon } from "@/components/icons";
import { deleteAvailabilityRule } from "@/app/admin/(dashboard)/booking/actions";

export function DeleteRuleButton({ ruleId }: { ruleId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => deleteAvailabilityRule(ruleId))}
      disabled={isPending}
      className="rounded-md p-1.5 text-text-3 transition-colors hover:bg-red-soft hover:text-red disabled:opacity-50"
      aria-label="Delete rule"
    >
      <TrashIcon className="h-3.75 w-3.75" />
    </button>
  );
}
