import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";
import { ArrowRightIcon } from "@/components/icons";
import type { JobListItem } from "@/types/database";

const DOT_COLORS = ["bg-blue", "bg-green", "bg-blue"];

export function RecentUpdatesCard({
  jobs,
}: {
  jobs: Pick<JobListItem, "id" | "slug" | "title" | "published_at" | "created_at">[];
}) {
  if (jobs.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-text">Recent updates</h3>
      <ul className="mt-3 flex flex-col gap-3">
        {jobs.map((job, i) => (
          <li key={job.id} className="flex gap-2.5">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`}
            />
            <Link href={`/jobs/${job.slug}`} className="group">
              <p className="text-[12.5px] leading-snug font-medium text-text group-hover:text-blue">
                {job.title}
              </p>
              <p className="mt-0.5 text-[11px] text-text-3">
                {formatRelativeTime(job.published_at ?? job.created_at)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/jobs"
        className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-blue hover:underline"
      >
        View all updates
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
