"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckIcon } from "@/components/icons";
import { formatCount } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { getClientSessionId } from "@/lib/session-client";
import { hasApplied, markApplied } from "@/lib/applied-storage";

function noopSubscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

export function AppliedButton({
  jobId,
  initialCount,
}: {
  jobId: string;
  initialCount: number;
}) {
  const appliedFromStorage = useSyncExternalStore(
    noopSubscribe,
    () => hasApplied(jobId),
    getServerSnapshot,
  );
  const [justApplied, setJustApplied] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const applied = appliedFromStorage || justApplied;

  async function handleClick() {
    if (applied || pending) return;
    setPending(true);

    const supabase = createClient();
    const sessionId = getClientSessionId();
    const { data, error } = await supabase.rpc("record_applied", {
      p_job_post_id: jobId,
      p_session_id: sessionId,
    });

    setPending(false);
    markApplied(jobId);
    setJustApplied(true);
    if (!error && data) {
      setCount((c) => c + 1);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={applied || pending}
      className={`flex items-center gap-1.25 rounded-md border px-2.75 py-1.25 text-xs font-medium transition-colors ${
        applied
          ? "border-green bg-green-soft text-green"
          : "border-border bg-surface text-text-2 hover:border-green hover:text-green"
      }`}
    >
      <CheckIcon className="h-3.75 w-3.75" />
      Applied · {formatCount(count)}
    </button>
  );
}
