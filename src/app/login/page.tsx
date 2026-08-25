import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth-layout";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in — Careerwithkumar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue.">
      <LoginForm next={next ?? "/"} />
    </AuthLayout>
  );
}
