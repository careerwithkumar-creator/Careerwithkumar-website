"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, MapPinIcon } from "@/components/icons";
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

  return (
    <section className="bg-[#132A4C] px-5 py-7 sm:py-8">
      <div className="mx-auto max-w-270">
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-[#8FA6D4]">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRightIcon className="h-3 w-3" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="mb-1.5 block text-xs font-medium text-[#B7C6E8]">
              Search for
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, company, or keyword"
              className="w-full rounded-md border border-transparent bg-white px-3.25 py-2.75 text-[13.5px] text-[#1A2333] placeholder:text-[#8992A0] focus:outline-none"
            />
          </label>

          <label className="flex-1">
            <span className="mb-1.5 block text-xs font-medium text-[#B7C6E8]">
              Where
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or state"
              className="w-full rounded-md border border-transparent bg-white px-3.25 py-2.75 text-[13.5px] text-[#1A2333] placeholder:text-[#8992A0] focus:outline-none"
            />
          </label>

          <label className="sm:w-48">
            <span className="mb-1.5 block text-xs font-medium text-[#B7C6E8]">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as JobCategory | "")}
              className="w-full rounded-md border border-transparent bg-white px-3.25 py-2.75 text-[13.5px] text-[#1A2333] focus:outline-none"
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
            className="rounded-md bg-[#0B1830] px-5 py-2.75 text-[13.5px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90"
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
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#8FA6D4] hover:text-white"
        >
          <MapPinIcon className="h-3.5 w-3.5" />
          Use my location
        </button>
      </div>
    </section>
  );
}
