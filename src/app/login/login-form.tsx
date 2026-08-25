"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailIcon, InfoIcon } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { signIn } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(signIn, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="email">
          Email
        </label>
        <div className="relative mt-1">
          <MailIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-3" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-surface py-2 pr-3 pl-9 text-sm text-text transition-colors focus:border-blue focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="password">
          Password
        </label>
        <div className="mt-1">
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
      </div>

      {state.error && (
        <p className="flex items-center gap-1.5 rounded-md bg-red-soft px-3 py-2 text-sm text-red">
          <InfoIcon className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-blue px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-navy-2 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
      >
        {isPending && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {isPending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-text-2">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-blue hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
