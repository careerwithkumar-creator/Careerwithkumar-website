import type { MetadataRoute } from "next";
import { siteUrl, expired } from "@/lib/portal";
import { getPublishedJobs } from "@/lib/queries/jobs";
export const revalidate = 300;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getPublishedJobs();
  return [
    ...[
      "",
      "/jobs",
      "/internships",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/disclaimer",
    ].map((path) => ({ url: siteUrl + path })),
    ...jobs
      .filter((j) => !expired(j))
      .map((j) => ({
        url: siteUrl + "/jobs/" + j.slug,
        lastModified: j.published_at || j.created_at,
      })),
  ];
}
