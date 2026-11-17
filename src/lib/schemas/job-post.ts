import { z } from "zod";

import { JOB_FIELDS } from "@/lib/job-fields";
const httpUrl = z
  .string()
  .refine((v) => !v || /^https?:\/\//i.test(v), "Use an HTTP or HTTPS URL");
export const jobPostSchema = z.object({
  ...Object.fromEntries(
    Object.keys(JOB_FIELDS).map((key) => [
      key,
      key.endsWith("_url") || key === "company_logo"
        ? httpUrl.optional()
        : z.string().max(20000).optional(),
    ]),
  ),
  featured: z.boolean().default(false),
  title: z.string().min(3, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  category: z.enum([
    "govt",
    "private",
    "internship",
    "remote",
    "walkin",
    "apprenticeship",
  ]),
  description: z.string().min(1, "Description is required"),
  eligibility: z.string().optional(),
  salary: z.string().optional(),
  apply_url: z
    .string()
    .url("Enter a valid URL")
    .refine((v) => /^https?:\/\//i.test(v), "Use HTTP or HTTPS")
    .optional()
    .or(z.literal("")),
  deadline_at: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

export type JobPostInput = z.infer<typeof jobPostSchema>;

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
