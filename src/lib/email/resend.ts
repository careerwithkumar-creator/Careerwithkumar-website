import "server-only";

const FROM = "Careerwithkumar Bookings <bookings@careerwithkumar.in>";

// Best-effort — a failed notification email should never fail the booking
// itself, so this only ever logs on error, never throws.
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — skipping email send.");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      }),
    });

    if (!res.ok) {
      console.error("Resend send failed:", res.status, await res.text());
    }
  } catch (error) {
    console.error("Resend send threw:", error);
  }
}
