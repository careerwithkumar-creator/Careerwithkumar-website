"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BriefcaseIcon,
  PlusIcon,
  LogOutIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  SunIcon,
  MoonIcon,
} from "@/components/icons";
import { signOut } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: BriefcaseIcon },
  { href: "/admin/jobs/new", label: "New posting", icon: PlusIcon },
];

const COLLAPSE_KEY = "cwk_admin_sidebar_collapsed";

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Collapsed state and the resolved theme both depend on client-only state
  // (localStorage / next-themes) that isn't known during SSR — deferring
  // them to after mount keeps the first client render matching server markup.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-4.5 -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-text-3 shadow-sm transition-colors hover:text-text"
      >
        <ChevronRightIcon
          className={`h-3.5 w-3.5 transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}
        />
      </button>

      <div className="overflow-hidden border-b border-border px-4 py-4">
        <Link
          href="/admin"
          className="whitespace-nowrap text-base font-bold text-text"
        >
          {collapsed ? (
            <span className="text-blue">CK</span>
          ) : (
            <>
              Careerwith<span className="text-blue">kumar</span>
            </>
          )}
        </Link>
        {!collapsed && <p className="mt-0.5 text-xs text-text-3">Admin</p>}
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
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-blue-soft text-blue"
                  : "text-text-2 hover:bg-border-soft hover:text-text"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title={collapsed ? (isDark ? "Light mode" : "Dark mode") : undefined}
          className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm whitespace-nowrap text-text-2 hover:bg-border-soft hover:text-text ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {isDark ? (
            <SunIcon className="h-4 w-4 shrink-0" />
          ) : (
            <MoonIcon className="h-4 w-4 shrink-0" />
          )}
          {!collapsed && (isDark ? "Light mode" : "Dark mode")}
        </button>
        <Link
          href="/"
          title={collapsed ? "View public site" : undefined}
          className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm whitespace-nowrap text-text-2 hover:bg-border-soft hover:text-text ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <ArrowRightIcon className="h-4 w-4 shrink-0 rotate-180" />
          {!collapsed && "View public site"}
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm whitespace-nowrap text-text-2 hover:bg-red-soft hover:text-red ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOutIcon className="h-4 w-4 shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </form>
      </div>
    </aside>
  );
}
