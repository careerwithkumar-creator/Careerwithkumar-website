export function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "live" | "warn";
}) {
  const toneClass = {
    default: "text-text",
    live: "text-blue",
    warn: "text-red",
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3.5">
      <div className="text-xs text-text-3">{label}</div>
      <div className={`mt-1.25 text-[22px] font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
