import { createClient } from "@/lib/supabase/server";
import { DailyViewsChart } from "./daily-views-chart";
function currentTime() {
  return Date.now();
}
export async function CampaignAnalytics({
  days,
  source,
}: {
  days: number;
  source: string;
}) {
  if (process.env.PORTAL_SCHEMA_READY !== "true")
    return (
      <p className="mt-6 text-sm">
        Campaign reporting becomes available after portal migrations and
        PORTAL_SCHEMA_READY=true.
      </p>
    );
  const now = currentTime();
  const db = await createClient();
  let query = db
    .from("job_traffic_daily")
    .select("*")
    .gte("day", new Date(now - days * 86400000).toISOString().slice(0, 10))
    .order("day", { ascending: false })
    .limit(5000);
  if (source) query = query.eq("source", source);
  const { data, error } = await query;
  if (error)
    return (
      <p role="alert">
        Campaign analytics unavailable. Check migration and admin permissions.
      </p>
    );
  const totals = new Map<string, number>();
  for (const row of data || [])
    totals.set(row.day, (totals.get(row.day) || 0) + row.views);
  const points = Array.from({ length: days }, (_, i) => {
    const date = new Date(now - (days - 1 - i) * 86400000)
      .toISOString()
      .slice(0, 10);
    return { date, count: totals.get(date) || 0 };
  });
  return (
    <section className="mt-6 space-y-4">
      <h2 className="font-semibold">Campaign traffic</h2>
      <p className="text-xs">
        Consented pageviews and clicks, not unique visitors. Latest 5,000 daily
        campaign rows. Dates use UTC.
      </p>
      <form className="flex gap-3">
        <label>
          Period
          <select name="days" defaultValue={days} className="input">
            <option value="30">30 days</option>
            <option value="90">90 days</option>
          </select>
        </label>
        <label>
          Source
          <select name="source" defaultValue={source} className="input">
            <option value="">All</option>
            {["instagram", "whatsapp", "google", "direct", "other"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button>Filter</button>
      </form>
      <DailyViewsChart data={points} title="Campaign pageviews" />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {[
                "Day",
                "Job ID",
                "Source",
                "Campaign",
                "Medium",
                "Views",
                "Apply clicks",
              ].map((v) => (
                <th key={v} className="p-2">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row) => (
              <tr
                key={[
                  row.day,
                  row.job_post_id,
                  row.source,
                  row.campaign,
                  row.medium,
                ].join(":")}
              >
                {[
                  row.day,
                  row.job_post_id,
                  row.source,
                  row.campaign,
                  row.medium,
                  row.views,
                  row.apply_clicks,
                ].map((v, i) => (
                  <td key={i} className="p-2">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data?.length && <p>No consented campaign events yet.</p>}
    </section>
  );
}
