"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getJobBySlug } from "@/lib/queries/jobs";
import { jobPostSchema, slugify } from "@/lib/schemas/job-post";

export type JobFormState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

// Runs the same cached lookup a visitor's page render would, right here in
// the admin action — one direct Supabase read, no HTTP round trip back into
// the app. It populates the shared query cache so the next real visitor's
// render finds the data already there instead of querying live.
async function warmJobCache(slug: string) {
  try {
    await getJobBySlug(slug);
  } catch {
    // Best-effort: if this fails, the first real visitor just triggers the
    // query normally, same as before this existed.
  }
}

function parseForm(formData: FormData) {
  return jobPostSchema.safeParse({
    title: formData.get("title"),
    company: formData.get("company"),
    location: formData.get("location") || undefined,
    category: formData.get("category"),
    description: formData.get("description"),
    eligibility: formData.get("eligibility") || undefined,
    salary: formData.get("salary") || undefined,
    apply_url: formData.get("apply_url") || "",
    deadline_at: formData.get("deadline_at") || undefined,
    status: formData.get("status"),
  });
}

export async function createJobPost(
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v?.[0] ?? "",
        ]),
      ),
    };
  }

  const supabase = await createClient();
  const data = parsed.data;
  const slug = `${slugify(data.title)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("job_posts").insert({
    ...data,
    slug,
    apply_url: data.apply_url || null,
    deadline_at: data.deadline_at || null,
    published_at: data.status === "published" ? new Date().toISOString() : null,
    source: "manual",
  });

  if (error) {
    return { error: error.message };
  }

  updateTag("jobs");
  if (data.status === "published") await warmJobCache(slug);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateJobPost(
  jobId: string,
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v?.[0] ?? "",
        ]),
      ),
    };
  }

  const supabase = await createClient();
  const data = parsed.data;

  const { data: existing } = await supabase
    .from("job_posts")
    .select("slug, status, published_at")
    .eq("id", jobId)
    .single();

  const { error } = await supabase
    .from("job_posts")
    .update({
      ...data,
      apply_url: data.apply_url || null,
      deadline_at: data.deadline_at || null,
      published_at:
        data.status === "published" && !existing?.published_at
          ? new Date().toISOString()
          : existing?.published_at,
    })
    .eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  updateTag("jobs");
  if (data.status === "published" && existing?.slug) await warmJobCache(existing.slug);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteJobPost(jobId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("job_posts").delete().eq("id", jobId);
  if (error) throw new Error(error.message);
  updateTag("jobs");
  revalidatePath("/admin");
}
