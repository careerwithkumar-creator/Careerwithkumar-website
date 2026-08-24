"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/lib/site-config";

const TOPICS = [
  { value: "general", label: "General question" },
  { value: "job-issue", label: "Issue with a posting" },
  { value: "scam", label: "Report a scam" },
  { value: "other", label: "Other" },
];

export function ContactForm({ initialTopic }: { initialTopic?: string }) {
  const [topic, setTopic] = useState(
    TOPICS.some((t) => t.value === initialTopic) ? initialTopic! : "general",
  );
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const topicLabel = TOPICS.find((t) => t.value === topic)?.label ?? topic;
    const subject = `[Careerwithkumar] ${topicLabel}`;
    const body = `${message}\n\n— ${name || "Anonymous"}`;
    window.location.href = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="topic">
          Topic
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="name">
          Your name (optional)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-2"
      >
        Send message
      </button>
    </form>
  );
}
