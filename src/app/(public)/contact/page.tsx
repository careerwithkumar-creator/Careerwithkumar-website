import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { ContactForm } from "@/components/contact-form";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contact — Careerwithkumar" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;

  return (
    <StaticPage title="Contact us">
      <p>
        Have a question, spotted a broken link, or want to report someone
        impersonating Careerwithkumar and asking for money? Reach us at{" "}
        <a
          href={`mailto:${SITE_CONFIG.contactEmail}`}
          className="text-blue hover:underline"
        >
          {SITE_CONFIG.contactEmail}
        </a>{" "}
        or use the form below.
      </p>
      <div className="rounded-lg border border-border bg-surface p-5">
        <ContactForm initialTopic={topic} />
      </div>
    </StaticPage>
  );
}
