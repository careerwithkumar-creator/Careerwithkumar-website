import Link from "next/link";
import type { JobPost } from "@/types/database";
import { SaveButton } from "@/components/save-button";
import { MapPinIcon, BriefcaseIcon, InfoIcon } from "@/components/icons";
import { formatDate } from "@/lib/format";
import { CATEGORY_META } from "@/lib/categories";

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function JobCard({ job }: { job: JobPost }) {
  const daysLeft = job.deadline_at ? daysUntil(job.deadline_at) : null;
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

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

      <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-3">
            {formatDate(job.published_at ?? job.created_at)}
          </span>
          {isUrgent && (
            <span className="rounded-md bg-red-soft px-1.75 py-0.5 text-[11px] font-semibold text-red">
              {daysLeft === 0 ? "Closes today" : `${daysLeft}d left`}
            </span>
          )}
        </div>

        <div className="group relative">
          <Link
            href={`/jobs/${job.slug}`}
            aria-label={`View details for ${job.title}`}
            className="block text-blue hover:text-navy-2"
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
