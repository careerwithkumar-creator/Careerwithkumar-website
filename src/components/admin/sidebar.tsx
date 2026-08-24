"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseIcon, PlusIcon, LogOutIcon } from "@/components/icons";
import { signOut } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: BriefcaseIcon },
  { href: "/admin/jobs/new", label: "New posting", icon: PlusIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-4">
        <Link href="/admin" className="text-base font-bold text-text">
          Careerwith<span className="text-blue">kumar</span>
        </Link>
        <p className="mt-0.5 text-xs text-text-3">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-soft text-blue"
                  : "text-text-2 hover:bg-border-soft hover:text-text"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="block rounded-md px-3 py-2 text-sm text-text-2 hover:bg-border-soft hover:text-text"
        >
          ← View public site
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-2 hover:bg-red-soft hover:text-red"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
