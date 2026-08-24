import { createClient } from "@/lib/supabase/server";
import type { JobCategory, JobPost } from "@/types/database";

// PostgREST's or()/ilike() filter strings treat comma/parens as grammar and
// % as our own wildcard — strip/escape them so a search term can't break or
// smuggle extra filter conditions.
function sanitizeIlikeTerm(raw: string): string {
  return raw.replace(/[,()]/g, " ").replace(/%/g, "\\%").trim();
}

export async function getPublishedJobs(opts?: {
  category?: JobCategory;
  search?: string;
  location?: string;
}): Promise<JobPost[]> {
  const supabase = await createClient();
  let query = supabase
    .from("job_posts")
    .select("*")
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
}

export async function getJobBySlug(slug: string): Promise<JobPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getRelatedJobs(
  category: JobCategory,
  excludeId: string,
  limit = 3,
): Promise<JobPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

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
