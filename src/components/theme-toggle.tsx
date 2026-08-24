"use client";

import { SunIcon, MoonIcon } from "@/components/icons";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

export function ThemeToggle() {
  function handleClick() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — theme just won't persist.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Toggle light/dark theme"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-text-2 transition-colors hover:border-blue hover:text-blue"
    >
      <span className="theme-only-light">
        <SunIcon className="h-4.5 w-4.5" />
      </span>
      <span className="theme-only-dark">
        <MoonIcon className="h-4.5 w-4.5" />
      </span>
    </button>
  );
}
