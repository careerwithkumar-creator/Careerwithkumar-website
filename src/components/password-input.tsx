"use client";

import { useState, type InputHTMLAttributes } from "react";
import { LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

export function PasswordInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <LockIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-3" />
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full rounded-md border border-border bg-surface py-2 pr-10 pl-9 text-sm text-text transition-colors focus:border-blue focus:outline-none ${className ?? ""}`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-text-3 transition-colors hover:text-text-2"
      >
        {visible ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
