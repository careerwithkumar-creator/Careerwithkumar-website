"use client";

import { useState } from "react";

export function DailyViewsChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-text">
        Views — last {data.length} days
      </h3>

      <div className="mt-5 flex h-36 items-end gap-1.25">
        {data.map((d, i) => {
          const heightPct = (d.count / max) * 100;
          const isHovered = hovered === i;
          return (
            <div
              key={d.date}
              className="group relative flex flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered && (
                <div className="absolute bottom-full mb-1.5 z-10 rounded-md border border-border bg-surface px-2 py-1 text-[11px] whitespace-nowrap text-text shadow-sm">
                  <span className="font-semibold">{d.count}</span> ·{" "}
                  {formatShortDate(d.date)}
                </div>
              )}
              <div
                className={`w-full rounded-t-[4px] transition-colors ${
                  isHovered ? "bg-navy-2" : "bg-blue"
                }`}
                style={{ height: `${Math.max(heightPct, 2)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-[10.5px] text-text-3">
        <span>{formatShortDate(data[0]?.date)}</span>
        <span>{formatShortDate(data[data.length - 1]?.date)}</span>
      </div>
    </div>
  );
}

function formatShortDate(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
