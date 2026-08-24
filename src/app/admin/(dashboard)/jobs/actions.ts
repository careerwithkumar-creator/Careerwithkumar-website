"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { jobPostSchema, slugify } from "@/lib/schemas/job-post";

export type JobFormState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

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
    .select("status, published_at")
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

  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteJobPost(jobId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("job_posts").delete().eq("id", jobId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
