import type { Metadata } from "next";
import Link from "next/link";
import { MetricCard } from "@/components/admin/metric-card";
import { DailyViewsChart } from "@/components/admin/daily-views-chart";
import { CategoryBreakdownChart } from "@/components/admin/category-breakdown-chart";
import { LiveReadingNow } from "@/components/live-reading-now";
import { formatCount } from "@/lib/format";
import {
  getViewsToday,
  getTotalViewsAllTime,
  getReadingNowCount,
  getTotalAppliedCount,
  getUnresolvedReportCount,
  getDailyViewCounts,
  getCategoryBreakdown,
  getTopViewedJobs,
  safeStat,
} from "@/lib/queries/stats";

export const metadata: Metadata = { title: "Analytics — Careerwithkumar Admin" };

export default async function AdminAnalyticsPage() {
  const [
    viewsToday,
    totalViews,
    readingNow,
    totalApplied,
    unresolvedReports,
    dailyViews,
    categoryCounts,
    topJobs,
  ] = await Promise.all([
    safeStat(getViewsToday),
    safeStat(getTotalViewsAllTime),
    safeStat(getReadingNowCount),
    safeStat(getTotalAppliedCount),
    safeStat(getUnresolvedReportCount),
    getDailyViewCounts(14).catch(() => []),
    getCategoryBreakdown().catch(() => ({
      govt: 0,
      private: 0,
      internship: 0,
      remote: 0,
      walkin: 0,
    })),
    getTopViewedJobs(5).catch(() => []),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold text-text">Analytics</h1>
      <p className="mt-1 text-sm text-text-2">
        Traffic and engagement across your published postings.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Views today" value={formatCount(viewsToday)} />
        <MetricCard label="Views all-time" value={formatCount(totalViews)} />
        <MetricCard
          label="Reading now"
          value={<LiveReadingNow initialCount={readingNow} />}
          tone="live"
        />
        <MetricCard label="Marked applied" value={formatCount(totalApplied)} />
        <MetricCard
          label="Unresolved reports"
          value={String(unresolvedReports)}
          tone={unresolvedReports > 0 ? "warn" : "default"}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DailyViewsChart data={dailyViews} />
        <CategoryBreakdownChart counts={categoryCounts} />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-text">Most viewed postings</h3>
        {topJobs.length === 0 ? (
          <p className="mt-3 text-[13px] text-text-3">No views recorded yet.</p>
        ) : (
          <div className="mt-3 flex flex-col divide-y divide-border-soft">
            {topJobs.map((job, i) => (
              <div key={job.id} className="flex items-center gap-3 py-2.5">
                <span className="w-5 shrink-0 text-[12.5px] font-semibold text-text-3">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    className="block truncate text-[13.5px] font-medium text-text hover:text-blue"
                  >
                    {job.title}
                  </Link>
                  <p className="truncate text-[12px] text-text-3">{job.company}</p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold text-text">
                  {formatCount(job.view_count)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
