import type { JobCategory } from "@/types/database";

export const CATEGORY_META: Record<
  JobCategory,
  { label: string; tagClass: string }
> = {
  govt: { label: "Government", tagClass: "bg-green-soft text-green" },
  private: { label: "Private", tagClass: "bg-blue-soft text-blue" },
  internship: { label: "Internship", tagClass: "bg-purple-soft text-purple" },
  remote: { label: "Remote", tagClass: "bg-amber-soft text-amber" },
  walkin: { label: "Walk-in", tagClass: "bg-navy-soft text-navy-text" },
};

export const CATEGORY_ORDER: JobCategory[] = [
  "govt",
  "private",
  "internship",
  "remote",
  "walkin",
];
