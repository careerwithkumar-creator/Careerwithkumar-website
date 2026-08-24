import { z } from "zod";

export const jobPostSchema = z.object({
  title: z.string().min(3, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  category: z.enum(["govt", "private", "internship", "remote", "walkin"]),
  description: z.string().min(1, "Description is required"),
  eligibility: z.string().optional(),
  salary: z.string().optional(),
  apply_url: z
    .string()
    .url("Enter a valid URL")
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
