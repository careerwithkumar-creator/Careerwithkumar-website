import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = { title: "Terms of Use — Careerwithkumar" };

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Use">
      <p>
        Careerwithkumar aggregates and curates publicly available job,
        internship, and walk-in notifications. By using this site, you agree
        to the following.
      </p>

      <h2 className="pt-2 text-base font-semibold text-text">
        No fee, ever
      </h2>
      <p>
        We never charge a fee to apply for any posting listed here. If
        anyone contacts you claiming to represent Careerwithkumar and asks
        for payment, it is a scam — please report it immediately.
      </p>

      <h2 className="pt-2 text-base font-semibold text-text">
        Accuracy of postings
      </h2>
      <p>
        We do our best to verify each posting before publishing, but hiring
        details (deadlines, salary, eligibility) can change on the
        employer&apos;s end without notice. Always confirm details on the
        official apply link before proceeding, and use the &ldquo;Report
        broken link&rdquo; button if something looks wrong.
      </p>

      <h2 className="pt-2 text-base font-semibold text-text">
        No guarantee of outcome
      </h2>
      <p>
        Listing a posting does not imply endorsement or guarantee of
        selection. Hiring decisions are made solely by the respective
        employer or exam body.
      </p>
    </StaticPage>
  );
}
