"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import type { JobFormState } from "@/app/admin/(dashboard)/jobs/actions";
import type { JobPost } from "@/types/database";

import { JOB_FIELDS } from "@/lib/job-fields";
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

  const formRef = useRef<HTMLFormElement>(null);
  const [importError, setImportError] = useState("");
  const [preview, setPreview] = useState<Record<string, string> | null>(null);
  function importData(raw: string) {
    try {
      const data = JSON.parse(raw);
      if (!data || Array.isArray(data) || typeof data !== "object")
        throw Error();
      for (const [key, value] of Object.entries(data)) {
        const field = formRef.current?.elements.namedItem(key);
        if (
          (field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement ||
            field instanceof HTMLSelectElement) &&
          typeof value === "string"
        )
          field.value = value;
      }
      setImportError(
        "Imported. Verify every field against official sources before publishing.",
      );
    } catch {
      setImportError("Paste a JSON object with matching field names.");
    }
  }
  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form ref={formRef} action={formAction} className="max-w-2xl space-y-5">
      <details className="rounded-lg border border-border p-4">
        <summary>Paste structured job information (JSON)</summary>
        <textarea
          aria-label="Structured job JSON"
          className="input mt-3"
          rows={4}
          onBlur={(e) => {
            if (e.target.value.trim()) importData(e.target.value);
          }}
          placeholder={
            '{"title":"Job title","company":"Employer","description":"Original summary"}'
          }
        />
        <p role="status">{importError}</p>
      </details>
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

      <label className="block text-sm">
        Upload company logo (PNG, JPEG, WebP; max 2 MB)
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={async (ev) => {
            const file = ev.target.files?.[0];
            if (!file) return;
            const data = new FormData();
            data.set("logo", file);
            try {
              const response = await fetch("/api/admin/logo", {
                method: "POST",
                body: data,
              });
              const result = await response.json();
              if (!response.ok) throw Error(result.error);
              const input = formRef.current?.elements.namedItem("company_logo");
              if (input instanceof HTMLTextAreaElement)
                input.value = result.url;
              setImportError("Logo uploaded. Save the listing to attach it.");
            } catch {
              setImportError(
                "Logo upload failed. Verify the storage migration, admin access and file format.",
              );
            }
          }}
        />
      </label>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 font-semibold">
          Verified opportunity details
        </legend>
        {Object.entries(JOB_FIELDS).map(([key, label]) => (
          <Field key={key} label={label} error={fieldError(key)}>
            <textarea
              name={key}
              defaultValue={
                initialValues?.[key as keyof JobPost]?.toString() ?? ""
              }
              rows={2}
              className="input"
            />
          </Field>
        ))}
        <label>
          <input
            name="featured"
            type="checkbox"
            defaultChecked={initialValues?.featured}
          />{" "}
          Featured opportunity
        </label>
        <label>
          <input name="verified" type="checkbox" required /> I verified the
          information and official links.
        </label>
      </fieldset>
      <button
        type="button"
        className="input"
        onClick={() =>
          setPreview(
            Object.fromEntries(
              Array.from(new FormData(formRef.current!).entries()).map(
                ([k, v]) => [k, String(v)],
              ),
            ),
          )
        }
      >
        Preview before saving
      </button>
      {preview && (
        <section className="rounded-lg border border-border p-4">
          <h2>Preview</h2>
          {Object.entries(preview).map(([k, v]) => (
            <p key={k} className="whitespace-pre-line text-sm">
              <strong>{k}: </strong>
              {v}
            </p>
          ))}
        </section>
      )}
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
