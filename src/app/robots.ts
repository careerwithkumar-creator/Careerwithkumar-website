import { siteUrl } from "@/lib/portal";
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    sitemap: siteUrl + "/sitemap.xml",
  };
}
