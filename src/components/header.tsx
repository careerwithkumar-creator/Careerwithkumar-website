import Link from "next/link";
import { Logo } from "@/components/logo";
import { VerifiedBadge } from "@/components/badges";
import { NavDropdown } from "@/components/nav-dropdown";
import { SavedJobsBadge } from "@/components/saved-jobs-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { GetAlertsButton } from "@/components/get-alerts-button";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";

const JOB_SEEKER_ITEMS = [
  { label: "About us", href: "/about" },
  { label: "How it works", href: "/about" },
  { label: "Report a scam", href: "/contact?topic=scam" },
];

// Placeholder destinations — point at /about until these have real pages.
const RESOURCE_ITEMS = [
  { label: "Exam calendar", href: "/about" },
  { label: "Resume tips", href: "/about" },
  { label: "Interview guide", href: "/about" },
];

export function Header() {
  const browseJobsItems = CATEGORY_ORDER.map((cat) => ({
    label: CATEGORY_META[cat].label,
    href: `/jobs?category=${cat}`,
  }));

  return (
    <header className="border-b border-border bg-surface">
      <div className="border-b border-border-soft">
        <div className="mx-auto flex max-w-270 justify-end px-5 py-1.5">
          <Link
            href="/contact"
            className="text-xs font-medium text-text-3 hover:text-blue"
          >
            Contact us
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-270 flex-wrap items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex flex-col gap-1">
          <Logo className="h-20 w-auto" />
          <span className="hidden sm:block">
            <VerifiedBadge />
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavDropdown label="Browse jobs" items={browseJobsItems} />
          <NavDropdown label="For job seekers" items={JOB_SEEKER_ITEMS} />
          <NavDropdown label="Resources" items={RESOURCE_ITEMS} />
          <Link
            href="/about"
            className="text-[13.5px] font-medium text-text-2 transition-colors hover:text-text"
          >
            About us
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <SavedJobsBadge />
          <ThemeToggle />
          <GetAlertsButton />
        </div>
      </div>
    </header>
  );
}
