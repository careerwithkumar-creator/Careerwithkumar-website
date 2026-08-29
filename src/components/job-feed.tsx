import type { JobListItem } from "@/types/database";
import { JobCard } from "@/components/job-card";

export function JobFeed({
  jobs,
  layout = "grid",
}: {
  jobs: JobListItem[];
  layout?: "grid" | "list";
}) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-text-2">
          No postings match this filter right now — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        layout === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "flex flex-col gap-3"
      }
    >
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
