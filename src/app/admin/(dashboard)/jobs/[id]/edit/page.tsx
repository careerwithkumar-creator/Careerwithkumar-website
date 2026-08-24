import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/job-form";
import { getJobById } from "@/lib/queries/jobs";
import { updateJobPost } from "../../actions";

export const metadata: Metadata = { title: "Edit Posting — Careerwithkumar Admin" };

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const boundAction = updateJobPost.bind(null, id);

  return (
    <div>
      <h1 className="text-xl font-bold text-text">Edit posting</h1>
      <p className="mt-1 text-sm text-text-2">{job.title}</p>

      <div className="mt-6">
        <JobForm
          action={boundAction}
          initialValues={job}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
