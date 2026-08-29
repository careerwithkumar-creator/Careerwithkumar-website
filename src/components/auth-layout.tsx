import Link from "next/link";
import { Logo } from "@/components/logo";
import { CheckCircleIcon } from "@/components/icons";
import { SITE_CONFIG } from "@/lib/site-config";

const HIGHLIGHTS = [
  "Verified job, internship & walk-in alerts",
  `Trusted by ${SITE_CONFIG.instagramFollowers.toLocaleString("en-IN")}+ job seekers`,
  "No fee to apply, ever",
];

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1">
      <div className="relative hidden w-[42%] shrink-0 overflow-hidden bg-[#172B4D] lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#2F6FAD] opacity-20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-[#6D4AA6] opacity-20 blur-3xl"
        />

        <Link href="/" className="relative">
          <Logo forceDark className="h-16 w-auto" />
        </Link>

        <div className="relative">
          <p className="max-w-sm text-[26px] leading-tight font-bold text-white">
            Never miss the update that gets you hired.
          </p>
          <ul className="mt-7 flex flex-col gap-3.5">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[13.5px] text-[#B3BFD1]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#6FA0C9]">
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[11.5px] text-[#7C8AA3]">
          © 2026 {SITE_CONFIG.name}. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-bg px-4 py-14 sm:py-20">
        <div className="auth-card w-full max-w-sm">
          <div className="mb-7 flex flex-col items-center gap-1 text-center lg:hidden">
            <Link href="/">
              <Logo className="h-14 w-auto" />
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-[22px] font-bold text-text">{title}</h1>
            <p className="mt-1.5 text-sm text-text-2">{subtitle}</p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-xl shadow-black/[0.03]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
