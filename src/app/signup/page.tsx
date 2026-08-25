import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth-layout";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = { title: "Sign up — Careerwithkumar" };

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join to save jobs, get alerts, and track applications."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
