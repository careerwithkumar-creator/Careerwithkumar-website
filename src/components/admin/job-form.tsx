"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import type { JobFormState } from "@/app/admin/(dashboard)/jobs/actions";
import type { JobPost } from "@/types/database";

function toDateInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function JobForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (state: JobFormState, formData: FormData) => Promise<JobFormState>;
  initialValues?: Partial<JobPost>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state.error && (
        <p className="rounded-md bg-red-soft px-3 py-2 text-sm text-red">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Job title" error={fieldError("title")}>
          <input
            name="title"
            defaultValue={initialValues?.title}
            required
            className="input"
          />
        </Field>
        <Field label="Company" error={fieldError("company")}>
          <input
            name="company"
            defaultValue={initialValues?.company}
            required
            className="input"
          />
        </Field>
        <Field label="Location">
          <input
            name="location"
            defaultValue={initialValues?.location ?? ""}
            className="input"
          />
        </Field>
        <Field label="Category" error={fieldError("category")}>
          <select
            name="category"
            defaultValue={initialValues?.category ?? "govt"}
            className="input"
          >
            {CATEGORY_ORDER.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_META[cat].label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Salary">
          <input
            name="salary"
            defaultValue={initialValues?.salary ?? ""}
            placeholder="₹25,000 – ₹35,000 / month"
            className="input"
          />
        </Field>
        <Field label="Application deadline">
          <input
            type="date"
            name="deadline_at"
            defaultValue={toDateInputValue(initialValues?.deadline_at)}
            className="input"
          />
        </Field>
        <Field label="Official apply URL" error={fieldError("apply_url")}>
          <input
            name="apply_url"
            defaultValue={initialValues?.apply_url ?? ""}
            placeholder="https://…"
            className="input"
          />
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={initialValues?.status ?? "draft"}
            className="input"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
      </div>

      <Field label="Description" error={fieldError("description")}>
        <textarea
          name="description"
          defaultValue={initialValues?.description}
          required
          rows={6}
          className="input"
        />
      </Field>

      <Field label="Eligibility">
        <textarea
          name="eligibility"
          defaultValue={initialValues?.eligibility ?? ""}
          rows={3}
          className="input"
        />
      </Field>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-2 disabled:opacity-60"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin"
          className="text-sm font-medium text-text-2 hover:text-text"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red">{error}</span>}
    </label>
  );
}
