import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import type { JobCategory } from "@/types/database";

// Fixed hue order from the validated categorical palette (blue, orange, aqua,
// yellow, magenta) — kept distinct from CATEGORY_META's badge colors, which
// weren't designed for side-by-side chart identity (govt/private share a hue
// there).
const SERIES_VAR: Record<JobCategory, string> = {
  govt: "--series-1",
  private: "--series-2",
  internship: "--series-3",
  remote: "--series-4",
  walkin: "--series-5",
};

export function CategoryBreakdownChart({
  counts,
}: {
  counts: Record<JobCategory, number>;
}) {
  const max = Math.max(1, ...Object.values(counts));

  return (
    <div className="cat-chart rounded-lg border border-border bg-surface p-5">
      <style>{`
        .cat-chart {
          --series-1: #2a78d6;
          --series-2: #eb6834;
          --series-3: #1baf7a;
          --series-4: #eda100;
          --series-5: #e87ba4;
        }
        :root[data-theme="dark"] .cat-chart {
          --series-1: #3987e5;
          --series-2: #d95926;
          --series-3: #199e70;
          --series-4: #c98500;
          --series-5: #d55181;
        }
      `}</style>

      <h3 className="text-sm font-semibold text-text">
        Published jobs by category
      </h3>

      <div className="mt-5 flex flex-col gap-3">
        {CATEGORY_ORDER.map((cat) => {
          const count = counts[cat] ?? 0;
          const widthPct = (count / max) * 100;
          return (
            <div key={cat} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-[12.5px] text-text-2">
                {CATEGORY_META[cat].label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-soft">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    width: `${Math.max(widthPct, count > 0 ? 3 : 0)}%`,
                    backgroundColor: `var(${SERIES_VAR[cat]})`,
                  }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-[12.5px] font-semibold text-text">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
