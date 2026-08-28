import { SearchBanner } from "@/components/search-banner";
import { JobResults } from "@/components/job-results";
import { JobsSidebar } from "@/components/jobs-sidebar";
import { TrustStrip } from "@/components/trust-strip";
import { InstagramFollowStrip } from "@/components/instagram-follow-strip";
import { getPublishedJobs, getRecentJobUpdates } from "@/lib/queries/jobs";
import { getPublishedJobCount, safeStat } from "@/lib/queries/stats";

export default async function Home() {
  const [jobs, totalJobsPosted, recentUpdates] = await Promise.all([
    getPublishedJobs(),
    safeStat(getPublishedJobCount),
    getRecentJobUpdates(),
  ]);

  return (
    <div className="flex-1">
      <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-6 px-5 py-8 md:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <SearchBanner totalJobCount={totalJobsPosted} />

          <div className="mt-6">
            <JobResults jobs={jobs} />
          </div>

          <div className="mt-8">
            <InstagramFollowStrip />
          </div>

        </div>

        <JobsSidebar recentUpdates={recentUpdates} />
      </div>

      {/* <TrustStrip /> */}
    </div>
  );
}
