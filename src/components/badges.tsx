import type { JobCategory, JobPost } from "@/types/database";
import { CATEGORY_META } from "@/lib/categories";
import { getDeadlineInfo } from "@/lib/format";
import { CheckCircleIcon } from "@/components/icons";

export const NEEDS_REVIEW_THRESHOLD = 3;

export function isFlaggedForReview(job: Pick<JobPost, "report_count">) {
  return job.report_count >= NEEDS_REVIEW_THRESHOLD;
}

export function CategoryTag({ category }: { category: JobCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-[11px] font-semibold ${meta.tagClass}`}
    >
      {meta.label}
    </span>
  );
}

const URGENCY_CLASS: Record<string, string> = {
  open: "bg-green-soft text-green",
  ok: "bg-amber-soft text-amber",
  soon: "bg-red-soft text-red",
  closed: "bg-border-soft text-text-3",
};

// Text-only equivalent of URGENCY_CLASS — for a deadline row that isn't
// pill-shaped (e.g. JobCard's calendar-icon date line), which still needs
// to read as urgent without a background chip.
export const URGENCY_TEXT_CLASS: Record<string, string> = {
  open: "text-text-3",
  ok: "text-amber",
  soon: "text-red",
  closed: "text-text-3",
};

export function DeadlineBadge({ deadlineAt }: { deadlineAt: string | null }) {
  const info = getDeadlineInfo(deadlineAt);
  if (!info) return null;

  return (
    <span
      className={`inline-flex h-fit items-center whitespace-nowrap rounded-md px-2.5 py-1 text-[11.5px] font-semibold ${URGENCY_CLASS[info.urgency]}`}
    >
      {info.label}
    </span>
  );
}

const STATUS_CLASS: Record<JobPost["status"], string> = {
  published: "bg-green-soft text-green",
  draft: "bg-border-soft text-text-2",
  archived: "bg-border-soft text-text-3",
};

export function StatusPill({ job }: { job: JobPost }) {
  if (isFlaggedForReview(job)) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-soft px-2.5 py-0.75 text-[10.5px] font-semibold text-red">
        Needs review
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.75 text-[10.5px] font-semibold capitalize ${STATUS_CLASS[job.status]}`}
    >
      {job.status}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-0.75 text-[11.5px] font-semibold text-blue">
      <CheckCircleIcon className="h-3.75 w-3.75" />
      Verified source
    </span>
  );
}
