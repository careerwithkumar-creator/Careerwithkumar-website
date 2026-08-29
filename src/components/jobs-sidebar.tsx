import { PopularSearchesCard } from "@/components/popular-searches-card";
import { JobAlertCard } from "@/components/job-alert-card";
import { RecentUpdatesCard } from "@/components/recent-updates-card";
import type { JobListItem } from "@/types/database";

export function JobsSidebar({
  recentUpdates,
}: {
  recentUpdates: Pick<JobListItem, "id" | "slug" | "title" | "published_at" | "created_at">[];
}) {
  return (
    <aside className="flex flex-col gap-6">
      <PopularSearchesCard />
      <JobAlertCard />
      <RecentUpdatesCard jobs={recentUpdates} />
    </aside>
  );
}
