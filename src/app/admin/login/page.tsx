import type { Metadata } from "next";
import { ShieldCheckIcon } from "@/components/icons";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin Login — Careerwithkumar" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-soft text-blue">
            <ShieldCheckIcon className="h-5 w-5" />
          </span>
          <h1 className="mt-3 text-lg font-bold text-text">
            Careerwith<span className="text-blue">kumar</span> Admin
          </h1>
          <p className="mt-1 text-sm text-text-2">
            Sign in to manage postings.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <LoginForm next={next ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
