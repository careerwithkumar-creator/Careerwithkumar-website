import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { JOB_LIST_COLUMNS, type JobCategory, type JobListItem, type JobPost } from "@/types/database";

// PostgREST's or()/ilike() filter strings treat comma/parens as grammar and
// % as our own wildcard — strip/escape them so a search term can't break or
// smuggle extra filter conditions.
function sanitizeIlikeTerm(raw: string): string {
  return raw.replace(/[,()]/g, " ").replace(/%/g, "\\%").trim();
}

// These reads are covered by the `job_posts_public_read` RLS policy
// (`status = 'published'`, no auth check), so they use the cookie-free public
// client and are wrapped in `unstable_cache`: identical requests across
// visitors reuse the same cached result instead of each hitting Supabase.
export const getPublishedJobs = unstable_cache(
  async (opts?: {
    category?: JobCategory;
    search?: string;
    location?: string;
  }): Promise<JobListItem[]> => {
    const supabase = createPublicClient();
    let query = supabase
      .from("job_posts")
      .select(JOB_LIST_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (opts?.category) {
      query = query.eq("category", opts.category);
    }
    if (opts?.search) {
      const term = sanitizeIlikeTerm(opts.search);
      query = query.or(`title.ilike.%${term}%,company.ilike.%${term}%`);
    }
    if (opts?.location) {
      const term = sanitizeIlikeTerm(opts.location);
      query = query.ilike("location", `%${term}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ["published-jobs"],
  { tags: ["jobs"], revalidate: 60 },
);

// `React.cache` dedupes this within a single request (e.g. `generateMetadata`
// and the page both calling it for the same slug); `unstable_cache` persists
// the result across requests.
export const getJobBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<JobPost | null> => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("job_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    ["job-by-slug"],
    { tags: ["jobs"], revalidate: 120 },
  ),
);

export const getRecentJobUpdates = unstable_cache(
  async (
    limit = 3,
  ): Promise<Pick<JobListItem, "id" | "slug" | "title" | "published_at" | "created_at">[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("job_posts")
      .select("id, slug, title, published_at, created_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ["recent-job-updates"],
  { tags: ["jobs"], revalidate: 60 },
);

export const getRelatedJobs = unstable_cache(
  async (
    category: JobCategory,
    excludeId: string,
    limit = 3,
  ): Promise<JobListItem[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("job_posts")
      .select(JOB_LIST_COLUMNS)
      .eq("status", "published")
      .eq("category", category)
      .neq("id", excludeId)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ["related-jobs"],
  { tags: ["jobs"], revalidate: 120 },
);

export async function getAllJobsForAdmin(): Promise<JobPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getJobById(id: string): Promise<JobPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
