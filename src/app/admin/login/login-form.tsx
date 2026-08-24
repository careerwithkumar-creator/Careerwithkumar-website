"use client";

import { useActionState } from "react";
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
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-border bg-surface p-2 text-sm text-text focus:border-blue focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-soft px-3 py-2 text-sm text-red">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-2 disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
