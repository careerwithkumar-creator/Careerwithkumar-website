"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { MailIcon, UserIcon, InfoIcon, CheckCircleIcon } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { signUp, type SignUpState } from "./actions";

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["bg-red", "bg-amber", "bg-blue", "bg-green"];

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const initialState: SignUpState = { error: null, success: false };

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-soft text-green">
          <CheckCircleIcon className="h-5.5 w-5.5" />
        </span>
        <h2 className="text-base font-semibold text-text">Check your inbox</h2>
        <p className="text-sm text-text-2">
          We&apos;ve sent a confirmation link to your email. Click it to
          activate your account, then come back and sign in.
        </p>
        <Link
          href="/login"
          className="mt-2 text-sm font-medium text-blue hover:underline"
        >
          Back to log in
        </Link>
      </div>
    );
  }

  const score = passwordScore(password);
  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch = confirmTouched && password === confirmPassword;

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="fullName">
          Full name
        </label>
        <div className="relative mt-1">
          <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-3" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full rounded-md border border-border bg-surface py-2 pr-3 pl-9 text-sm text-text transition-colors focus:border-blue focus:outline-none"
          />
        </div>
      </div>

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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {password.length > 0 && (
          <div className="mt-1.5">
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < score ? STRENGTH_COLORS[score - 1] : "bg-border-soft"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-[11.5px] text-text-3">
              {STRENGTH_LABELS[Math.max(score - 1, 0)]}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-text-2" htmlFor="confirmPassword">
          Confirm password
        </label>
        <div className="mt-1">
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {confirmTouched && (
          <p
            className={`mt-1.5 flex items-center gap-1 text-[11.5px] ${
              passwordsMatch ? "text-green" : "text-red"
            }`}
          >
            {passwordsMatch ? (
              <>
                <CheckCircleIcon className="h-3.5 w-3.5" /> Passwords match
              </>
            ) : (
              "Passwords don't match"
            )}
          </p>
        )}
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
        {isPending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-text-2">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
