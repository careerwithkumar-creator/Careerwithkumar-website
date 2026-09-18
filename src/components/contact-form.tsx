"use client";

import { useActionState } from "react";
import { CheckCircleIcon, InfoIcon } from "@/components/icons";
import { sendContactMessage, type ContactFormState } from "@/app/(public)/contact/actions";

const TOPIC_SUBJECTS: Record<string, string> = {
  "job-issue": "Issue with a posting",
  scam: "Report a scam",
};

const initialState: ContactFormState = { error: null, success: false };

export function ContactForm({ initialTopic }: { initialTopic?: string }) {
  const [state, formAction, isPending] = useActionState(sendContactMessage, initialState);
  const initialSubject = initialTopic ? TOPIC_SUBJECTS[initialTopic] ?? "" : "";

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-soft text-green">
          <CheckCircleIcon className="h-5.5 w-5.5" />
        </span>
        <p className="text-sm font-medium text-green">Message sent!</p>
        <p className="text-sm text-text-2">
          Thanks for reaching out — we&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-text-2" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-2" htmlFor="email">
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="subject">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          defaultValue={initialSubject}
          className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="flex items-center gap-1.5 rounded-md bg-red-soft px-3 py-2 text-sm text-red">
          <InfoIcon className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-2 disabled:opacity-60"
      >
        {isPending && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {isPending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
