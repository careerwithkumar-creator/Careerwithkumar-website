import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

const POPULAR_SEARCHES = [
  "SSC",
  "UPSC",
  "Bank",
  "Railway",
  "Defence",
  "Teaching",
  "PSU",
  "10th Pass",
];

export function PopularSearchesCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 mt-8">
      <h3 className="text-sm font-semibold text-text">Popular searches</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((term) => (
          <Link
            key={term}
            href={`/jobs?q=${encodeURIComponent(term)}`}
            className="rounded-full bg-blue-soft px-3 py-1.25 text-[12.5px] font-medium text-blue transition-colors hover:bg-blue hover:text-white"
          >
            {term}
          </Link>
        ))}
      </div>
      <Link
        href="/jobs"
        className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-blue hover:underline"
      >
        View all popular searches
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
