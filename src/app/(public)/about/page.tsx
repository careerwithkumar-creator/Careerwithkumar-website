import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = { title: "About — Careerwithkumar" };

export default function AboutPage() {
  return (
    <StaticPage title="About Careerwithkumar">
      <p>
        Careerwithkumar started as an Instagram page sharing government exam
        results, private off-campus drives, internships, and walk-in
        interviews — and has since grown to{" "}
        {SITE_CONFIG.instagramFollowers.toLocaleString("en-IN")}+ followers.
        This site is the web home for those same updates: easier to search,
        filter, and share than a feed of posts.
      </p>
      <p>
        Every posting is reviewed before it goes live. We link straight to
        the official source or application page wherever one exists, and we
        never charge a fee to apply for any job listed here.
      </p>
      <h2 className="pt-2 text-base font-semibold text-text">
        What we cover
      </h2>
      <p>
        Government recruitment (SSC, banking, railways, state boards),
        private-sector off-campus and on-campus drives, internships, remote
        roles, and walk-in interviews across India.
      </p>
    </StaticPage>
  );
}
