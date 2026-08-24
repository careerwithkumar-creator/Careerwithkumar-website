"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ReportLinkButton({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    setPending(true);
    const supabase = createClient();
    await supabase.rpc("record_link_report", {
      p_job_post_id: jobId,
      p_reason: reason.trim() || null,
    });
    setPending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-[11.5px] text-text-3">
        Thanks — we&apos;ll review this link shortly.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-transparent p-0 text-[11.5px] text-text-3 underline transition-colors hover:text-red"
      >
        Report broken link
      </button>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-bg p-3">
      <p className="text-xs font-medium text-text">Report this link?</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="What's wrong with it? (optional)"
        rows={2}
        className="mt-2 w-full rounded-md border border-border bg-surface p-2 text-xs text-text placeholder:text-text-3 focus:border-blue focus:outline-none"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="rounded-md bg-red px-3 py-1.25 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-3 py-1.25 text-xs font-medium text-text-2 hover:text-text"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
