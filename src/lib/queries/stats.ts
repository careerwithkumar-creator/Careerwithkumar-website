import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { JobCategory } from "@/types/database";

// Stats are decorative — if Supabase hiccups (a transient auth/network
// error), fall back to 0 rather than taking down a whole page over a number
// in a metric card.
export async function safeStat(fn: () => Promise<number>): Promise<number> {
  try {
    return await fn();
  } catch (error) {
    // Next.js's internal signal for "this route needs dynamic rendering" —
    // not a real failure, must propagate untouched or the build's static
    // analysis can't see it.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      error.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error("Stat query failed, falling back to 0:", error);
    return 0;
  }
}

// Covered by the same public RLS policy as the job list reads — cookie-free
// client so this can be cached across visitors instead of counted on every
// page load.
export const getPublishedJobCount = unstable_cache(
  async (): Promise<number> => {
    const supabase = createPublicClient();
    const { count, error } = await supabase
      .from("job_posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    if (error) throw new Error(error.message);
    return count ?? 0;
  },
  ["published-job-count"],
  { tags: ["jobs"], revalidate: 60 },
);

export async function getReadingNowCount(): Promise<number> {
  const supabase = await createClient();
  const cutoff = new Date(Date.now() - 60_000).toISOString();
  const { data, error } = await supabase
    .from("post_presence")
    .select("session_id")
    .gt("last_seen_at", cutoff);

  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r) => r.session_id)).size;
}

export async function getViewsToday(): Promise<number> {
  const supabase = await createClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("post_views")
    .select("*", { count: "exact", head: true })
    .gte("viewed_at", startOfDay.toISOString());

  if (error) throw new Error(error.message);
  return count ?? 0;
}

// One query for all jobs' post_views in the last 24h, bucketed into 12
// 2-hour buckets per job — avoids an N+1 query per row in the postings table.
export async function getHourlyViewBuckets(
  jobIds: string[],
  hours = 24,
  buckets = 12,
): Promise<Record<string, number[]>> {
  const result: Record<string, number[]> = {};
  for (const id of jobIds) result[id] = new Array(buckets).fill(0);
  if (jobIds.length === 0) return result;

  const supabase = await createClient();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const { data, error } = await supabase
    .from("post_views")
    .select("job_post_id, viewed_at")
    .in("job_post_id", jobIds)
    .gte("viewed_at", since.toISOString());

  if (error) throw new Error(error.message);

  const bucketMs = (hours * 60 * 60 * 1000) / buckets;
  for (const row of data ?? []) {
    const age = Date.now() - new Date(row.viewed_at).getTime();
    const bucketIndex = Math.min(
      buckets - 1,
      Math.max(0, buckets - 1 - Math.floor(age / bucketMs)),
    );
    result[row.job_post_id][bucketIndex] += 1;
  }

  return result;
}

export async function getTotalAppliedCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("applied_reactions")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getTotalViewsAllTime(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("post_views")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getUnresolvedReportCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("link_reports")
    .select("*", { count: "exact", head: true })
    .eq("resolved", false);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

// Daily view counts for the last `days` days (oldest first), for a simple
// trend chart — one query, bucketed client-side by calendar day.
export async function getDailyViewCounts(
  days = 14,
): Promise<{ date: string; count: number }[]> {
  const supabase = await createClient();
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const { data, error } = await supabase
    .from("post_views")
    .select("viewed_at")
    .gte("viewed_at", since.toISOString());

  if (error) throw new Error(error.message);

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of data ?? []) {
    const key = row.viewed_at.slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([date, count]) => ({ date, count }));
}

// Published job count per category — powers the category-breakdown chart.
export async function getCategoryBreakdown(): Promise<
  Record<JobCategory, number>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_posts")
    .select("category")
    .eq("status", "published");

  if (error) throw new Error(error.message);

  const counts: Record<JobCategory, number> = {
    govt: 0,
    private: 0,
    internship: 0,
    remote: 0,
    walkin: 0,
  };
  for (const row of data ?? []) {
    counts[row.category] += 1;
  }
  return counts;
}

// Top jobs by view count — job_posts.view_count is a running total, so this
// avoids re-aggregating post_views for a number we already keep on the row.
export async function getTopViewedJobs(limit = 5): Promise<
  { id: string; title: string; company: string; view_count: number }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_posts")
    .select("id, title, company, view_count")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}
