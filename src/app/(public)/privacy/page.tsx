import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy Policy — Careerwithkumar" };

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <p>
        Careerwithkumar does not require an account to browse job postings.
        This page explains what little data we do collect and why.
      </p>

      <h2 className="pt-2 text-base font-semibold text-text">
        Anonymous session identifier
      </h2>
      <p>
        We set a random, non-identifying session id in a cookie (and mirror
        it to your browser&apos;s local storage) the first time you visit.
        It&apos;s used only to avoid inflating view counts on repeat visits
        and to remember that you&apos;ve already tapped &ldquo;Applied&rdquo;
        on a posting, so you can&apos;t double count it. It is never linked
        to your name, email, or any other personal detail.
      </p>

      <h2 className="pt-2 text-base font-semibold text-text">
        Push notifications
      </h2>
      <p>
        If you opt in to job alerts, your browser creates a push
        subscription endpoint that we store to deliver notifications about
        new postings. You can revoke this at any time from your browser
        notification settings.
      </p>

      <h2 className="pt-2 text-base font-semibold text-text">
        Admin account
      </h2>
      <p>
        The admin dashboard is protected by a single login and is not open
        for public signup. Visitor data is never sold or shared with third
        parties.
      </p>

      <h2 className="pt-2 text-base font-semibold text-text">Contact</h2>
      <p>
        Questions about this policy? Reach us at{" "}
        <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-blue hover:underline">
          {SITE_CONFIG.contactEmail}
        </a>
        .
      </p>
    </StaticPage>
  );
}
