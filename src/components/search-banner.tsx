"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, MapPinIcon, SearchIcon } from "@/components/icons";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import type { JobCategory } from "@/types/database";

type Crumb = { label: string; href?: string };

export function SearchBanner({
  totalJobCount,
  breadcrumb = [{ label: "Browse jobs" }],
  initialQuery = "",
  initialLocation = "",
  initialCategory,
}: {
  totalJobCount: number;
  breadcrumb?: Crumb[];
  initialQuery?: string;
  initialLocation?: string;
  initialCategory?: JobCategory;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState<JobCategory | "">(
    initialCategory ?? "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    if (category) params.set("category", category);
    router.push(`/jobs${params.toString() ? `?${params}` : ""}`);
  }

  const heading = initialCategory
    ? `${CATEGORY_META[initialCategory].label} jobs`
    : "Find your next opportunity";
  const subheading = initialCategory
    ? `Verified ${CATEGORY_META[initialCategory].label.toLowerCase()} openings, updated daily.`
    : "Verified job, internship & walk-in updates — govt, private, remote.";

  return (
    <div>
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-text-3">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRightIcon className="h-3 w-3" />}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-blue">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-text-2">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="text-xl font-bold text-text sm:text-2xl">{heading}</h1>
        <p className="mt-1 text-sm text-text-2">{subheading}</p>

        <form
          onSubmit={handleSubmit}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="mb-1.5 block text-xs font-medium text-text-2">
              Search for
            </span>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, company, or keyword"
                className="input pl-9"
              />
            </div>
          </label>

          <label className="flex-1">
            <span className="mb-1.5 block text-xs font-medium text-text-2">
              Where
            </span>
            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or state"
                className="input pl-9"
              />
            </div>
          </label>

          <label className="sm:w-48">
            <span className="mb-1.5 block text-xs font-medium text-text-2">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as JobCategory | "")}
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

          <button
            type="submit"
            className="rounded-md bg-blue px-5 py-2.75 text-[13.5px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90"
          >
            Search {totalJobCount.toLocaleString("en-IN")} jobs
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(() => {
              // No geocoding API configured — acknowledging the permission
              // grant is as far as this goes for now.
            });
          }}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue hover:text-text"
        >
          <MapPinIcon className="h-3.5 w-3.5" />
          Use my location
        </button>
      </div>
    </div>
  );
}
