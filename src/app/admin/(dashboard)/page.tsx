import type { Metadata } from "next";
import Link from "next/link";
import { MetricCard } from "@/components/admin/metric-card";
import { PostingsTable } from "@/components/admin/postings-table";
import { AdminPagination } from "@/components/admin/pagination";
import { LiveReadingNow } from "@/components/live-reading-now";
import { isFlaggedForReview } from "@/components/badges";
import { formatCount } from "@/lib/format";
import { getAllJobsForAdmin } from "@/lib/queries/jobs";
import {
  getViewsToday,
  getReadingNowCount,
  getTotalAppliedCount,
  getHourlyViewBuckets,
  safeStat,
} from "@/lib/queries/stats";

export const metadata: Metadata = { title: "Dashboard — Careerwithkumar Admin" };

const PAGE_SIZE = 10;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const [jobs, viewsToday, readingNow, totalApplied] = await Promise.all([
    getAllJobsForAdmin(),
    safeStat(getViewsToday),
    safeStat(getReadingNowCount),
    safeStat(getTotalAppliedCount),
  ]);

  const flaggedCount = jobs.filter(isFlaggedForReview).length;

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const pageJobs = jobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const sparklines = await getHourlyViewBuckets(
    pageJobs.map((j) => j.id),
  ).catch((error) => {
    console.error("Sparkline query failed, falling back to empty:", error);
    return {};
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Views today" value={formatCount(viewsToday)} />
        <MetricCard
          label="Reading now"
          value={<LiveReadingNow initialCount={readingNow} />}
          tone="live"
        />
        <MetricCard label="Marked applied" value={formatCount(totalApplied)} />
        <MetricCard
          label="Flagged links"
          value={String(flaggedCount)}
          tone={flaggedCount > 0 ? "warn" : "default"}
        />
      </div>

      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">Job postings</h2>
        <Link
          href="/admin/jobs/new"
          className="rounded-md bg-blue px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
        >
          + New posting
        </Link>
      </div>

      <PostingsTable jobs={pageJobs} sparklines={sparklines} />
      <AdminPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
