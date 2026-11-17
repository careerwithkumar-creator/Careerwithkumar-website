"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getJobBySlug } from "@/lib/queries/jobs";
import { jobPostSchema, slugify } from "@/lib/schemas/job-post";

import { JOB_FIELDS } from "@/lib/job-fields";
async function requireAdmin() {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (
    !user ||
    !process.env.ADMIN_EMAIL ||
    user.email !== process.env.ADMIN_EMAIL
  )
    throw new Error("Unauthorized");
  return db;
}
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
  const parsed = jobPostSchema.safeParse({
    ...Object.fromEntries(
      Object.keys(JOB_FIELDS).map((k) => [k, String(formData.get(k) || "")]),
    ),
    featured: formData.get("featured") === "on",
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
  if (parsed.success && process.env.PORTAL_SCHEMA_READY !== "true") {
    for (const key of [...Object.keys(JOB_FIELDS), "featured"])
      delete (parsed.data as Record<string, unknown>)[key];
  }
  return parsed;
}

export async function createJobPost(
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  if (formData.get("verified") !== "on")
    return { error: "Verify the official sources before saving." };
  if (
    process.env.PORTAL_SCHEMA_READY !== "true" &&
    (Object.keys(JOB_FIELDS).some((key) =>
      String(formData.get(key) || "").trim(),
    ) ||
      formData.get("featured") === "on" ||
      formData.get("category") === "apprenticeship")
  )
    return {
      error:
        "Extended job fields require portal migrations and PORTAL_SCHEMA_READY=true. Your existing job fields can still be saved without them.",
    };
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

  const supabase = await requireAdmin();
  const data = parsed.data;
  const slug = `${slugify(data.title)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("job_posts").insert({
    ...data,
    slug,
    apply_url: data.apply_url || null,
    deadline_at: data.deadline_at
      ? new Date(data.deadline_at + "T23:59:59+05:30").toISOString()
      : null,
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
  if (formData.get("verified") !== "on")
    return { error: "Verify the official sources before saving." };
  if (
    process.env.PORTAL_SCHEMA_READY !== "true" &&
    (Object.keys(JOB_FIELDS).some((key) =>
      String(formData.get(key) || "").trim(),
    ) ||
      formData.get("featured") === "on" ||
      formData.get("category") === "apprenticeship")
  )
    return {
      error:
        "Extended job fields require portal migrations and PORTAL_SCHEMA_READY=true. Your existing job fields can still be saved without them.",
    };
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

  const supabase = await requireAdmin();
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
      deadline_at: data.deadline_at
        ? new Date(data.deadline_at + "T23:59:59+05:30").toISOString()
        : null,
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
  if (data.status === "published" && existing?.slug)
    await warmJobCache(existing.slug);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteJobPost(jobId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("job_posts").delete().eq("id", jobId);
  if (error) throw new Error(error.message);
  updateTag("jobs");
  revalidatePath("/admin");
}

export async function duplicateJobPost(id: string) {
  const db = await requireAdmin();
  const { data, error } = await db
    .from("job_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) throw Error("Listing unavailable");
  const {
    id: oldId,
    created_at,
    updated_at,
    view_count,
    applied_count,
    report_count,
    ig_media_id,
    ...copy
  } = data;
  void oldId;
  void created_at;
  void updated_at;
  void view_count;
  void applied_count;
  void report_count;
  void ig_media_id;
  const { error: writeError } = await db
    .from("job_posts")
    .insert({
      ...copy,
      slug: slugify(data.title) + "-" + crypto.randomUUID().slice(0, 8),
      status: "draft",
      published_at: null,
      source: "manual",
    });
  if (writeError) throw Error(writeError.message);
  updateTag("jobs");
  redirect("/admin");
}
