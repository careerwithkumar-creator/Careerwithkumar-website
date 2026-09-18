import "server-only";

const DEFAULT_FROM = "Careerwithkumar <bookings@careerwithkumar.in>";

// Returns whether the send actually succeeded — most callers (booking
// notifications) treat this as best-effort and only log on failure, but a
// caller whose entire purpose IS the email (the contact form) needs to know
// so it doesn't tell the visitor "Message sent!" when it wasn't.
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — skipping email send.");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: opts.from ?? DEFAULT_FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("Resend send failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend send threw:", error);
    return false;
  }
}
