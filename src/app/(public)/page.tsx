import { SearchBanner } from "@/components/search-banner";
import { JobResults } from "@/components/job-results";
import { InstagramFollowStrip } from "@/components/instagram-follow-strip";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getPublishedJobCount, safeStat } from "@/lib/queries/stats";

export default async function Home() {
  const [jobs, totalJobsPosted] = await Promise.all([
    getPublishedJobs(),
    safeStat(getPublishedJobCount),
  ]);

  return (
    <>
      <SearchBanner totalJobCount={totalJobsPosted} />

      <div className="mx-auto w-full max-w-270 flex-1 px-5 py-8">
        <JobResults jobs={jobs} />

        <div className="mt-8">
          <InstagramFollowStrip />
        </div>
      </div>
    </>
  );
}
