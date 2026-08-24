"use client";

import { useMemo, useState } from "react";
import { JobFeed } from "@/components/job-feed";
import { SaveSearchButton } from "@/components/save-search-button";
import { GridIcon, ListIcon, FilterIcon, ChevronDownIcon, XIcon } from "@/components/icons";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import type { JobCategory, JobPost } from "@/types/database";

type SortKey = "newest" | "deadline" | "views";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  deadline: "Deadline soonest",
  views: "Most viewed",
};

function sortJobs(jobs: JobPost[], sortBy: SortKey): JobPost[] {
  const copy = [...jobs];
  if (sortBy === "views") {
    return copy.sort((a, b) => b.view_count - a.view_count);
  }
  if (sortBy === "deadline") {
    return copy.sort((a, b) => {
      if (!a.deadline_at) return 1;
      if (!b.deadline_at) return -1;
      return (
        new Date(a.deadline_at).getTime() - new Date(b.deadline_at).getTime()
      );
    });
  }
  return copy.sort(
    (a, b) =>
      new Date(b.published_at ?? b.created_at).getTime() -
      new Date(a.published_at ?? a.created_at).getTime(),
  );
}

export function JobResults({ jobs }: { jobs: JobPost[] }) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<JobCategory | "">("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const locations = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter((l): l is string => !!l));
    return [...set].sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    let result = jobs;
    if (locationFilter) result = result.filter((j) => j.location === locationFilter);
    if (categoryFilter) result = result.filter((j) => j.category === categoryFilter);
    return sortJobs(result, sortBy);
  }, [jobs, locationFilter, categoryFilter, sortBy]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text">
          {filtered.length.toLocaleString("en-IN")} job
          {filtered.length === 1 ? "" : "s"} found for you
        </h2>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-md border border-border bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setLayout("grid")}
              aria-pressed={layout === "grid"}
              aria-label="Grid view"
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                layout === "grid" ? "bg-blue-soft text-blue" : "text-text-3 hover:text-text"
              }`}
            >
              <GridIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              aria-pressed={layout === "list"}
              aria-label="List view"
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                layout === "list" ? "bg-blue-soft text-blue" : "text-text-3 hover:text-text"
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>

          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="appearance-none rounded-md border border-border bg-surface py-2 pr-8 pl-3 text-[13px] font-medium text-text-2 focus:border-blue focus:outline-none"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  Sort: {SORT_LABELS[key]}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-text-3" />
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="hidden rounded-md border border-border bg-surface px-3 py-1.75 text-[13px] text-text-2 focus:border-blue focus:outline-none sm:block"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as JobCategory | "")}
            className="hidden rounded-md border border-border bg-surface px-3 py-1.75 text-[13px] text-text-2 focus:border-blue focus:outline-none sm:block"
          >
            <option value="">All categories</option>
            {CATEGORY_ORDER.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_META[cat].label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.75 text-[13px] font-medium text-text-2 hover:border-blue hover:text-blue"
          >
            <FilterIcon className="h-4 w-4" />
            All filters
          </button>
        </div>

        <SaveSearchButton />
      </div>

      <div className="mt-5">
        <JobFeed jobs={filtered} layout={layout} />
      </div>

      {filtersOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/30 sm:items-center"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-xl border border-border bg-surface p-5 sm:rounded-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-text">All filters</h3>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="text-text-3 hover:text-text"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-text-2">
                  Location
                </span>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-text-2">
                  Category
                </span>
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as JobCategory | "")
                  }
                  className="input"
                >
                  <option value="">All categories</option>
                  {CATEGORY_ORDER.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_META[cat].label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-5 w-full rounded-md bg-blue py-2.5 text-[13.5px] font-semibold text-white hover:bg-navy-2"
            >
              Show {filtered.length} jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
