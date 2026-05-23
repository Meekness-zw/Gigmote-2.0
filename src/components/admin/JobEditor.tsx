"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Trash2, Check, AlertTriangle } from "lucide-react";

/**
 * Shared job create / edit form. Posts to the admin API.
 */

export interface JobInitial {
  id?: string;
  slug?: string;
  title?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  salaryRange?: string;
  shortDescription?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  niceToHave?: string;
  status?: string;
}

interface Props {
  mode: "create" | "edit";
  initial?: JobInitial;
}

export function JobEditor({ mode, initial = {} }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "deleting">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => (payload[k] = String(v)));

    const method = mode === "edit" ? "PATCH" : "POST";
    if (mode === "edit" && initial.id) payload.id = initial.id;

    try {
      const res = await fetch("/api/admin/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Save failed");
      router.push("/admin/jobs");
      router.refresh();
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function onDelete() {
    if (!initial.id) return;
    if (!confirm(`Delete job "${initial.title}"? This cannot be undone.`)) return;
    setStatus("deleting");
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initial.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Delete failed");
      router.push("/admin/jobs");
      router.refresh();
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/jobs"
            data-cursor="link"
            className="group mb-3 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute hover:text-cream"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            All jobs
          </Link>
          <div className="label-eyebrow mb-2">
            — {mode === "create" ? "New job" : "Edit job"}
          </div>
          <h1 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
            {mode === "create" ? "Post a new role" : initial.title}
          </h1>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-3xl border border-cream-line bg-ink-2 p-6 md:p-10"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Title" name="title" defaultValue={initial.title} required />
          <Field label="Department" name="department" defaultValue={initial.department} placeholder="AI & Engineering" />
          <Field label="Location" name="location" defaultValue={initial.location} required placeholder="Remote · Global" />
          <Field
            label="Employment type"
            name="employmentType"
            defaultValue={initial.employmentType ?? "Full-time"}
            required
          />
          <Field label="Salary range" name="salaryRange" defaultValue={initial.salaryRange} placeholder="$70k – $110k" span={2} />
          <Field
            label="Slug (optional — auto-generated)"
            name="slug"
            defaultValue={initial.slug}
            placeholder="senior-ai-engineer"
            span={2}
          />
        </div>

        <div className="hairline" />

        <Field
          label="Short description (used in listings, ~200 chars)"
          name="shortDescription"
          defaultValue={initial.shortDescription}
          textarea
          rows={2}
          required
        />
        <Field
          label="Description (full role overview)"
          name="description"
          defaultValue={initial.description}
          textarea
          rows={4}
          required
        />
        <Field
          label="Responsibilities (one per line)"
          name="responsibilities"
          defaultValue={initial.responsibilities}
          textarea
          rows={6}
          required
        />
        <Field
          label="Requirements (one per line)"
          name="requirements"
          defaultValue={initial.requirements}
          textarea
          rows={6}
          required
        />
        <Field
          label="Nice to have (one per line, optional)"
          name="niceToHave"
          defaultValue={initial.niceToHave}
          textarea
          rows={4}
        />

        <div className="hairline" />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="status"
            value="published"
            defaultChecked={(initial.status ?? "published") === "published"}
            className="h-4 w-4 accent-gold"
          />
          <span className="text-sm text-cream">Publish this job (uncheck for draft)</span>
        </label>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/5 p-4 text-sm text-cream">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status !== "idle"}
            data-cursor="magnet"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
          >
            {status === "saving" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Check size={14} />
                {mode === "create" ? "Create job" : "Save changes"}
              </>
            )}
          </button>

          {mode === "edit" && (
            <button
              type="button"
              onClick={onDelete}
              disabled={status !== "idle"}
              data-cursor="link"
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-danger/30 px-5 py-3 text-sm text-danger transition-colors hover:bg-danger/5 disabled:opacity-60"
            >
              {status === "deleting" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  span?: 1 | 2;
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  textarea,
  rows = 3,
  span = 1,
}: FieldProps) {
  const baseClasses =
    "w-full rounded-xl border border-cream-line bg-ink-3 px-4 py-3 text-sm text-cream placeholder:text-cream-mute focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors";
  return (
    <label className={`flex flex-col gap-2 ${span === 2 ? "md:col-span-2" : ""}`}>
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={baseClasses}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={baseClasses}
        />
      )}
    </label>
  );
}
