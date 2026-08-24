import { createClient } from "@/lib/supabase/server";

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

export async function getPublishedJobCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("job_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

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
