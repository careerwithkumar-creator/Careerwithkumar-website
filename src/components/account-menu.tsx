"use client";

import { useEffect, useRef, useState } from "react";
import { LogOutIcon } from "@/components/icons";
import { signOut } from "@/app/(public)/actions";

export function AccountMenu({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (name || email).charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 min-w-52 rounded-lg border border-border bg-surface py-1.5 shadow-none">
          <div className="border-b border-border-soft px-3.5 py-2.5">
            <p className="truncate text-[13.5px] font-medium text-text">
              {name || "Your account"}
            </p>
            <p className="truncate text-[12px] text-text-3">{email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13.5px] text-text-2 hover:bg-bg hover:text-text"
            >
              <LogOutIcon className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
