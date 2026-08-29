export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Four states: "closed" (past deadline), "soon" (closing within 3 days),
// "ok" (closing within two weeks), "open" (plenty of time left).
export type DeadlineUrgency = "open" | "ok" | "soon" | "closed";

export function getDeadlineInfo(iso: string | null): {
  label: string;
  urgency: DeadlineUrgency;
} | null {
  if (!iso) return null;
  const deadline = new Date(iso);
  const diffDays = Math.ceil(
    (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return { label: "Closed", urgency: "closed" };
  if (diffDays === 0) return { label: "Closing today", urgency: "soon" };
  if (diffDays <= 3) return { label: "Closing Soon", urgency: "soon" };
  if (diffDays <= 14) return { label: "Apply Soon", urgency: "ok" };
  return { label: "Application Open", urgency: "open" };
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCount(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
}
