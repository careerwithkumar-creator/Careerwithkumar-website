// A pre-filled "add event" URL Google Calendar itself renders — no OAuth or
// API access needed, unlike creating the event via the Calendar API. Works
// for anyone with a Google account, admin or booker.
export function buildGoogleCalendarLink(opts: {
  title: string;
  startIso: string;
  endIso: string;
  details: string;
  location?: string;
}): string {
  const toGCalDate = (iso: string) =>
    iso.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${toGCalDate(opts.startIso)}/${toGCalDate(opts.endIso)}`,
    details: opts.details,
  });
  if (opts.location) params.set("location", opts.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
