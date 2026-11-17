import type { Metadata } from "next";
import { SearchBanner } from "@/components/search-banner";
import { JobResults } from "@/components/job-results";
import { JobsSidebar } from "@/components/jobs-sidebar";

import { getPublishedJobs, getRecentJobUpdates } from "@/lib/queries/jobs";
import { getPublishedJobCount, safeStat } from "@/lib/queries/stats";
import { CATEGORY_META } from "@/lib/categories";
import type { JobCategory } from "@/types/database";

const VALID_CATEGORIES = new Set<JobCategory>([
  "apprenticeship",
  "govt",
  "private",
  "internship",
  "remote",
  "walkin",
]);

function isJobCategory(value: string | undefined): value is JobCategory {
  return !!value && VALID_CATEGORIES.has(value as JobCategory);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const shared: Metadata = {
    description:
      "Find government jobs, private jobs, internships and apprenticeships. Check official eligibility and application details.",
    alternates: { canonical: "/jobs" },
    openGraph: { title: "Jobs & Internships | CareerWithKumar", url: "/jobs" },
    twitter: { card: "summary", title: "Jobs & Internships | CareerWithKumar" },
  };
  if (isJobCategory(category)) {
    return {
      ...shared,
      title: `${CATEGORY_META[category].label} Jobs — Careerwithkumar`,
    };
  }
  return { ...shared, title: "All Jobs — Careerwithkumar" };
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; location?: string }>;
}) {
  const { category, q, location } = await searchParams;
  const activeCategory = isJobCategory(category) ? category : undefined;

  const [jobs, totalJobsPosted, recentUpdates] = await Promise.all([
    getPublishedJobs({ category: activeCategory, search: q, location }),
    safeStat(getPublishedJobCount),
    getRecentJobUpdates(),
  ]);

  return (
    <div className="flex-1">
      <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-6 px-5 py-8 md:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <SearchBanner
            totalJobCount={totalJobsPosted}
            breadcrumb={[
              { label: "Home", href: "/" },
              {
                label: activeCategory
                  ? `${CATEGORY_META[activeCategory].label} jobs`
                  : "Browse jobs",
              },
            ]}
            initialQuery={q}
            initialLocation={location}
            initialCategory={activeCategory}
          />

          <div className="mt-6">
            <JobResults jobs={jobs} />
          </div>
        </div>

        <JobsSidebar recentUpdates={recentUpdates} />
      </div>

      {/* <TrustStrip /> */}
    </div>
  );
}
