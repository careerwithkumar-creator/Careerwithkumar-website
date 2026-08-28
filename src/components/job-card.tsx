import Link from "next/link";
import type { JobListItem } from "@/types/database";
import { SaveButton } from "@/components/save-button";
import { CategoryTag, DeadlineBadge, URGENCY_TEXT_CLASS } from "@/components/badges";
import { MapPinIcon, BriefcaseIcon, CalendarIcon, InfoIcon } from "@/components/icons";
import { formatDate, getDeadlineInfo } from "@/lib/format";
import { CATEGORY_META } from "@/lib/categories";

export function JobCard({ job }: { job: JobListItem }) {
  const deadlineInfo = getDeadlineInfo(job.deadline_at);

  return (
    <article className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-blue">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/jobs/${job.slug}`}
          className="line-clamp-2 text-[17px] font-semibold text-blue hover:underline"
        >
          {job.title}
        </Link>
        <SaveButton jobId={job.id} />
      </div>

      <p className="mt-2 text-[14px] text-text-2">{job.company}</p>

      <div className="mt-3 space-y-1.5 text-[13.5px] text-text-2">
        {job.location && (
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 shrink-0 text-text-3" />
            {job.location}
          </div>
        )}
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-4 w-4 shrink-0 text-text-3" />
          {CATEGORY_META[job.category].label}
        </div>
      </div>

      {job.salary && (
        <p className="mt-3 text-[15px] font-semibold text-green">
          {job.salary}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CategoryTag category={job.category} />
        <DeadlineBadge deadlineAt={job.deadline_at} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-3.5">
        <div
          className={`flex items-center gap-1.5 text-xs ${deadlineInfo ? URGENCY_TEXT_CLASS[deadlineInfo.urgency] : "text-text-3"}`}
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          {job.deadline_at
            ? `Deadline: ${formatDate(job.deadline_at)}`
            : "No deadline specified"}
        </div>

        <div className="group relative">
          <Link
            href={`/jobs/${job.slug}`}
            aria-label={`View details for ${job.title}`}
            className="block text-blue hover:text-text"
          >
            <InfoIcon className="h-5 w-5" />
          </Link>

          <div className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 w-56 rounded-lg border border-border bg-surface p-3 text-xs text-text-2 opacity-0 shadow-none transition-opacity group-hover:opacity-100">
            <p>
              <span className="font-medium text-text">Deadline:</span>{" "}
              {job.deadline_at ? formatDate(job.deadline_at) : "Not specified"}
            </p>
            {job.source === "instagram" && (
              <p className="mt-1 text-text-3">Synced from Instagram</p>
            )}
            <p className="mt-1 text-blue">View full details →</p>
          </div>
        </div>
      </div>
    </article>
  );
}
