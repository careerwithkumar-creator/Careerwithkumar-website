import Link from "next/link";
import { Logo } from "@/components/logo";
import { SITE_CONFIG } from "@/lib/site-config";

const COMPANY_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/contact", label: "Careers" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
  { href: "/contact?topic=scam", label: "Report a scam" },
];
//checking comment
export function Footer() {
  const { instagram, whatsapp, telegram } = SITE_CONFIG.social;
  const followLinks = [
    instagram && { href: instagram, label: "Instagram" },
    whatsapp && { href: whatsapp, label: "WhatsApp channel" },
    telegram && { href: telegram, label: "Telegram" },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <footer className="mt-10 bg-[#132A4C] text-[#B9C6DA]">
      <div className="mx-auto grid max-w-270 grid-cols-2 gap-6 px-5 pt-9 pb-5.5 sm:grid-cols-4">
        <div className="col-span-2">
          <Logo forceDark className="h-20 w-auto" />
          <p className="m-0 mt-3 max-w-sm text-[12.5px] leading-[1.7] text-[#9FB0C9]">
            Verified career and job-update listings, cross-checked from
            official sources. Followed by{" "}
            {SITE_CONFIG.instagramFollowers.toLocaleString("en-IN")}+ job
            seekers on Instagram.
          </p>
        </div>

        <div>
          <h5 className="m-0 mb-3 text-[13px] font-semibold text-white">
            Company
          </h5>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {COMPANY_LINKS.map((link, i) => (
              <li key={link.label + i}>
                <Link
                  href={link.href}
                  className="text-[12.5px] text-[#B9C6DA] hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="m-0 mb-3 text-[13px] font-semibold text-white">
            Legal
          </h5>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12.5px] text-[#B9C6DA] hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {followLinks.length > 0 && (
          <div>
            <h5 className="m-0 mb-3 text-[13px] font-semibold text-white">
              Follow
            </h5>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {followLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12.5px] text-[#B9C6DA] hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-[#2A4266] px-5 py-3.5 text-center text-[11.5px] text-[#7D90AC]">
        © 2026 Careerwithkumar. All rights reserved. Careerwithkumar does not
        guarantee employment and charges no fee at any stage.
      </div>
    </footer>
  );
}
