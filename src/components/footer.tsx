import Link from "next/link";
import { Logo } from "@/components/logo";
import { InstagramIcon, WhatsAppIcon, SendIcon } from "@/components/icons";
import { SITE_CONFIG } from "@/lib/site-config";

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  "WhatsApp channel": WhatsAppIcon,
  Telegram: SendIcon,
};

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
    <footer className="mt-10 bg-[#172B4D] text-[#B3BFD1]">
      <div className="mx-auto grid max-w-350 grid-cols-2 gap-6 px-5 pt-9 pb-5.5 sm:grid-cols-4">
        <div className="col-span-2">
          <Logo forceDark className="h-16 w-auto" />
          <p className="m-0 mt-3 max-w-sm text-[12.5px] leading-[1.7] text-[#9AA6BC]">
            Verified career and job-update listings, cross-checked from
            official sources. Followed by{" "}
            {SITE_CONFIG.instagramFollowers.toLocaleString("en-IN")}+ job
            seekers on Instagram.
          </p>

          {followLinks.length > 0 && (
            <div className="mt-5">
              <h5 className="m-0 mb-3 text-[13px] font-semibold text-white">
                Connect
              </h5>
              <div className="flex items-center gap-3">
                {followLinks.map((link) => {
                  const Icon = SOCIAL_ICONS[link.label as keyof typeof SOCIAL_ICONS];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
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
                  className="text-[12.5px] text-[#B3BFD1] hover:text-white"
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
                  className="text-[12.5px] text-[#B3BFD1] hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-[#2C3E5C] px-5 py-3.5 text-center text-[11.5px] text-[#7C8AA3]">
        © 2026 Careerwithkumar. All rights reserved. Careerwithkumar does not
        guarantee employment and charges no fee at any stage.
      </div>
    </footer>
  );
}
