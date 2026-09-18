"use server";

import { sendEmail } from "@/lib/email/resend";
import { contactMessageSchema } from "@/lib/schemas/contact";

export type ContactFormState = {
  error: string | null;
  success: boolean;
};

const initialState: ContactFormState = { error: null, success: false };

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ...initialState, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { ...initialState, error: "Couldn't send your message. Please try again later." };
  }

  const { name, email, subject, message } = parsed.data;

  const sent = await sendEmail({
    to: adminEmail,
    replyTo: email,
    subject: `[Contact form] ${subject}`,
    html: `
      <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) sent a message via the contact form.</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });

  if (!sent) {
    return {
      ...initialState,
      error: "Couldn't send your message right now. Please try again in a moment.",
    };
  }

  return { error: null, success: true };
}
