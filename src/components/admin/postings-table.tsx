import Link from "next/link";
import type { JobPost } from "@/types/database";
import { CategoryTag, StatusPill } from "@/components/badges";
import { Sparkline } from "@/components/admin/sparkline";
import { DeleteJobButton } from "@/components/admin/delete-job-button";
import { PencilIcon } from "@/components/icons";
import { formatCount } from "@/lib/format";

export function PostingsTable({
  jobs,
  sparklines,
}: {
  jobs: JobPost[];
  sparklines: Record<string, number[]>;
}) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-text-2">
        No postings yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-[860px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-bg text-[11.5px] font-semibold text-text-3">
            <th className="px-3 py-2.5">Posting</th>
            <th className="px-3 py-2.5">Status</th>
            <th className="px-3 py-2.5">Views</th>
            <th className="px-3 py-2.5">Applied</th>
            <th className="px-3 py-2.5">Trend</th>
            <th className="px-3 py-2.5">Reports</th>
            <th className="px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b border-border-soft last:border-0">
              <td className="max-w-60 px-3 py-2.75">
                <div className="truncate font-medium text-text">{job.title}</div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <CategoryTag category={job.category} />
                  <span className="truncate text-[11px] text-text-3">{job.company}</span>
                </div>
              </td>
              <td className="px-3 py-2.75">
                <StatusPill job={job} />
              </td>
              <td className="px-3 py-2.75 text-text">{formatCount(job.view_count)}</td>
              <td className="px-3 py-2.75 text-text">{formatCount(job.applied_count)}</td>
              <td className="px-3 py-2.75">
                <Sparkline data={sparklines[job.id] ?? [0, 0]} />
              </td>
              <td className="px-3 py-2.75">
                {job.report_count > 0 ? (
                  <span className="font-semibold text-red">{job.report_count}</span>
                ) : (
                  <span className="text-text-3">—</span>
                )}
              </td>
              <td className="px-3 py-2.75">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    className="rounded-md p-1.5 text-text-3 transition-colors hover:bg-blue-soft hover:text-blue"
                    aria-label={`Edit ${job.title}`}
                  >
                    <PencilIcon className="h-3.75 w-3.75" />
                  </Link>
                  <DeleteJobButton jobId={job.id} jobTitle={job.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
