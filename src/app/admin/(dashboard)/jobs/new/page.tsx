import type { Metadata } from "next";
import { JobForm } from "@/components/admin/job-form";
import { createJobPost } from "../actions";

export const metadata: Metadata = { title: "New Posting — Careerwithkumar Admin" };

export default function NewJobPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-text">New posting</h1>
      <p className="mt-1 text-sm text-text-2">
        Fill in the details below. Set status to &ldquo;Published&rdquo; to
        make it live immediately, or save as a draft to finish later.
      </p>

      <div className="mt-6">
        <JobForm action={createJobPost} submitLabel="Create posting" />
      </div>
    </div>
  );
}
