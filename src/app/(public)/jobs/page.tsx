import type { Metadata } from "next";
import { SearchBanner } from "@/components/search-banner";
import { JobResults } from "@/components/job-results";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getPublishedJobCount, safeStat } from "@/lib/queries/stats";
import { CATEGORY_META } from "@/lib/categories";
import type { JobCategory } from "@/types/database";

const VALID_CATEGORIES = new Set<JobCategory>([
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
  if (isJobCategory(category)) {
    return { title: `${CATEGORY_META[category].label} Jobs — Careerwithkumar` };
  }
  return { title: "All Jobs — Careerwithkumar" };
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; location?: string }>;
}) {
  const { category, q, location } = await searchParams;
  const activeCategory = isJobCategory(category) ? category : undefined;

  const [jobs, totalJobsPosted] = await Promise.all([
    getPublishedJobs({ category: activeCategory, search: q, location }),
    safeStat(getPublishedJobCount),
  ]);

  return (
    <>
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

      <div className="mx-auto w-full max-w-270 flex-1 px-5 py-8">
        <JobResults jobs={jobs} />
      </div>
    </>
  );
}
