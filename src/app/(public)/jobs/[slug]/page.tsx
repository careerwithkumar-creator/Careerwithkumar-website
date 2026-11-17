import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CategoryTag, DeadlineBadge } from "@/components/badges";
import { AppliedButton } from "@/components/applied-button";
import { ShareButtons } from "@/components/share-buttons";
import { ReportLinkButton } from "@/components/report-link-button";
import {
  MapPinIcon,
  CoinIcon,
  EyeIcon,
  ExternalLinkIcon,
  CalendarIcon,
  BriefcaseIcon,
} from "@/components/icons";
import { formatCount, formatRelativeTime } from "@/lib/format";
import {
  getJobBySlug,
  getRelatedJobs,
  getPublishedJobs,
} from "@/lib/queries/jobs";

import { JobTracking } from "@/components/job-tracking";
import { JOB_FIELDS } from "@/lib/job-fields";
import {
  safeUrl,
  expired,
  jsonLd,
  siteUrl as canonicalBase,
} from "@/lib/portal";
import { AdSlot } from "@/components/ad-slot";
// Pre-render every currently-published job at build time, so the first
// visitor to any job that already existed at deploy time gets a static page
// instantly instead of triggering the render themselves. Jobs published
// after deploy fall back to on-demand rendering on their first request (see
// the cache-warming fetch in the admin publish/update actions for how that
// gap is closed), then stay cached as a static page for `revalidate` seconds.
export async function generateStaticParams() {
  const jobs = await getPublishedJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};

  return {
    alternates: { canonical: canonicalBase + "/jobs/" + job.slug },
    openGraph: {
      title: job.title,
      description: job.description.slice(0, 155),
      url: canonicalBase + "/jobs/" + job.slug,
    },
    twitter: {
      card: "summary",
      title: job.title,
      description: job.description.slice(0, 155),
    },
    title: `${job.title} — ${job.company} | Careerwithkumar`,
    description: job.description.slice(0, 155),
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const closed = expired(job);
  const officialUrl = safeUrl(job.apply_url);
  const structured = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.published_at,
    validThrough: job.deadline_at,
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    },
    url: canonicalBase + "/jobs/" + job.slug,
  };
  const relatedJobs = await getRelatedJobs(job.category, job.id);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      {!closed && job.published_at && job.location && officialUrl && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structured) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Jobs",
                item: canonicalBase + "/jobs",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: job.title,
                item: canonicalBase + "/jobs/" + job.slug,
              },
            ],
          }),
        }}
      />
      {closed && (
        <p role="status" className="rounded-lg bg-amber-soft p-4">
          Applications closed. This listing is retained for reference.
        </p>
      )}
      <nav className="text-sm text-text-3">
        <Link href="/jobs" className="hover:text-blue">
          All jobs
        </Link>
        {" / "}
        <Link
          href={`/jobs?category=${job.category}`}
          className="hover:text-blue"
        >
          {job.category}
        </Link>
      </nav>

      <div className="mt-4 rounded-lg border border-border bg-surface p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryTag category={job.category} />
          <DeadlineBadge deadlineAt={job.deadline_at} />
          {job.source === "instagram" && (
            <span className="text-xs text-text-3">via Instagram</span>
          )}
        </div>

        {safeUrl(job.company_logo) && (
          <Image
            unoptimized
            src={safeUrl(job.company_logo)!}
            alt={job.company + " logo"}
            width={64}
            height={64}
            loading="lazy"
            className="mt-3 h-16 w-16 rounded-lg object-contain"
          />
        )}
        <h1 className="mt-3 text-2xl font-bold text-text sm:text-3xl">
          {job.title}
        </h1>
        <p className="mt-1 text-base text-text-2">{job.company}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-2">
          {job.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 text-text-3" />
              {job.location}
            </span>
          )}
          {job.salary && (
            <span className="inline-flex items-center gap-1.5">
              <CoinIcon className="h-4 w-4 text-text-3" />
              {job.salary}
            </span>
          )}
          {job.deadline_at && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4 text-text-3" />
              Deadline{" "}
              {new Date(job.deadline_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <EyeIcon className="h-4 w-4 text-text-3" />
            {formatCount(job.view_count)} views
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {officialUrl && !closed && (
            <a
              data-official-apply
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-2"
            >
              Apply on official site
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          )}
          <AppliedButton jobId={job.id} initialCount={job.applied_count} />
        </div>

        <p className="mt-2 text-xs text-text-3">
          Posted {formatRelativeTime(job.published_at ?? job.created_at)} ·
          always verify details on the official apply link before sharing any
          personal information.
        </p>
      </div>

      <p className="mt-4 text-sm text-text-2">
        CareerWithKumar is an independent career-information platform, not the
        recruiting organization. Verify eligibility, fees and dates in the
        official notification.
      </p>
      <JobTracking slug={job.slug} />
      <AdSlot placement="introduction" />
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <section className="rounded-lg border border-border bg-surface p-5 sm:p-7">
            <h2 className="text-base font-semibold text-text">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-2">
              {job.description}
            </p>

            {job.eligibility && (
              <>
                <h2 className="mt-6 flex items-center gap-1.5 text-base font-semibold text-text">
                  <BriefcaseIcon className="h-4 w-4" />
                  Eligibility
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-2">
                  {job.eligibility}
                </p>
              </>
            )}
            {Object.entries(JOB_FIELDS)
              .filter(
                ([key]) =>
                  !["company_logo", "official_notification_url"].includes(key),
              )
              .map(([key, label]) => {
                const value = job[key as keyof typeof job];
                return value ? (
                  <div key={key} className="mt-5">
                    <h2 className="font-semibold">{label}</h2>
                    <p className="whitespace-pre-line text-sm text-text-2">
                      {String(value)}
                    </p>
                  </div>
                ) : null;
              })}
            {safeUrl(job.official_notification_url) && (
              <a
                className="mt-4 block text-blue underline"
                href={safeUrl(job.official_notification_url)!}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read official notification
              </a>
            )}
          </section>
          <AdSlot placement="details" />

          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border-soft bg-bg px-4 py-3">
            <ShareButtons
              title={job.title}
              url={`${siteUrl}/jobs/${job.slug}`}
            />
            <ReportLinkButton jobId={job.id} />
          </div>
        </div>

        {relatedJobs.length > 0 && (
          <aside>
            <h2 className="text-sm font-semibold text-text">
              More {job.category} jobs
            </h2>
            <div className="mt-3 space-y-3">
              {relatedJobs.map((rj) => (
                <Link
                  key={rj.id}
                  href={`/jobs/${rj.slug}`}
                  className="block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-blue"
                >
                  <p className="text-sm font-medium text-text">{rj.title}</p>
                  <p className="mt-0.5 text-xs text-text-2">{rj.company}</p>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
