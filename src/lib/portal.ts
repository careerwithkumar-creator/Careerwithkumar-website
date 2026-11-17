import type { JobPost } from "@/types/database";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://careerwithkumar.in"
).replace(/\/$/, "");
export function safeUrl(value: string | null | undefined) {
  try {
    const u = new URL(value || "");
    return ["https:", "http:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}
export function expired(job: Pick<JobPost, "deadline_at">) {
  return !!job.deadline_at && new Date(job.deadline_at).getTime() < Date.now();
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
