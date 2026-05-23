"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Check, AlertTriangle, FileText, X, Upload } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

type Status = "idle" | "uploading" | "sending" | "ok" | "error";

type ResumeState = { name: string; size: number; url: string };

const ROLES = [
  "AI Engineer",
  "Compliance / KYC Operations",
  "Data Scientist",
  "Customer Success / CX Lead",
  "SDR / Pipeline Operator",
  "Accounting / Finance Operator",
  "Other (specify in notes)",
];

const SENIORITY = ["Junior (0–2 yrs)", "Mid (2–5 yrs)", "Senior (5–10 yrs)", "Lead (10+ yrs)"];

export function ApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeState | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onResumePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/resume", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setResume({ name: json.name, size: json.size, url: json.url });
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Upload failed.");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function clearResume() {
    setResume(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErr(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload: Record<string, string | number> = {};
    data.forEach((v, k) => {
      // File input is handled separately via the resume state above.
      if (k === "resume-file") return;
      payload[k] = String(v);
    });
    if (resume) {
      payload.resumeUrl = resume.url;
      payload.resumeName = resume.name;
      payload.resumeSize = resume.size;
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      setStatus("ok");
      form.reset();
      setResume(null);
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Try again.");
    }
  }

  return (
    <section className="relative border-b border-cream-line bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <FadeIn className="mb-10">
          <div className="label-eyebrow mb-4">— Application</div>
          <h2 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
            Tell us how you operate.
          </h2>
        </FadeIn>

        <form
          onSubmit={onSubmit}
          className="relative overflow-hidden rounded-3xl border border-cream-line bg-ink-2 p-6 md:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 100% 0%, rgba(246,206,72,0.06), transparent 60%)",
            }}
          />

          {/* Section: basic info */}
          <FormSection title="01 · Basics">
            <Field label="Full name" name="name" required placeholder="Jane Doe" />
            <Field label="Email" name="email" type="email" required placeholder="jane@example.com" />
            <Field label="Phone (optional)" name="phone" placeholder="+1 555 0123" />
            <Field label="Location · time zone" name="location" placeholder="Lagos · GMT+1" />
          </FormSection>

          <Divider />

          {/* Section: role */}
          <FormSection title="02 · Role">
            <Select label="Desired role" name="role" options={ROLES} required />
            <Select label="Seniority" name="seniority" options={SENIORITY} required />
            <Field
              label="LinkedIn URL"
              name="linkedin"
              placeholder="https://linkedin.com/in/..."
              span={2}
            />
            <Field
              label="Portfolio / GitHub / case studies"
              name="portfolio"
              placeholder="https://..."
              span={2}
            />

            {/* Resume upload */}
            <div className="md:col-span-2">
              <span className="mb-2 block text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                Resume (PDF, DOC, DOCX — 5 MB max)
              </span>
              {!resume ? (
                <label
                  className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-cream-line bg-ink-3 px-4 py-4 text-sm text-cream-dim transition-colors hover:border-gold/50 hover:text-cream ${
                    status === "uploading" ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {status === "uploading" ? (
                      <Loader2 size={16} className="animate-spin text-gold" />
                    ) : (
                      <Upload size={16} className="text-gold" />
                    )}
                    <span>
                      {status === "uploading"
                        ? "Uploading…"
                        : "Click to attach (optional)"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-mute">
                    Vercel Blob
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    name="resume-file"
                    accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    className="hidden"
                    onChange={onResumePick}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText size={16} className="shrink-0 text-gold" />
                    <div className="min-w-0">
                      <div className="truncate text-sm text-cream">
                        {resume.name}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                        {(resume.size / 1024).toFixed(0)} KB · uploaded
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearResume}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-cream-faint text-cream-mute transition-colors hover:border-danger/40 hover:text-danger"
                    aria-label="Remove resume"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </FormSection>

          <Divider />

          {/* Section: depth */}
          <FormSection title="03 · The work">
            <Field
              label="What's the operation you've shipped that you're most proud of?"
              name="proudest"
              textarea
              required
              placeholder="Outcome, scope, your role, what made it hard."
              span={2}
            />
            <Field
              label="What's a metric you owned end-to-end?"
              name="metric"
              textarea
              placeholder="The number you were on the hook for, and what you did with it."
              span={2}
            />
            <Field
              label="Anything else we should know?"
              name="notes"
              textarea
              placeholder="Other roles you're open to, salary expectations, availability."
              span={2}
            />
          </FormSection>

          <div className="relative mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-cream-mute">
              We review every application. Response within 5 business days.
            </div>
            <button
              type="submit"
              data-cursor="magnet"
              disabled={status === "sending"}
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-ink transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  Submit application
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </div>

          {status === "ok" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-6 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm text-cream"
            >
              <Check size={16} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <div className="font-medium">Application received.</div>
                <div className="mt-1 text-cream-dim">
                  We'll come back within 5 business days.
                </div>
              </div>
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-6 flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/5 p-4 text-sm text-cream"
            >
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
              <div>
                <div className="font-medium">Couldn't submit.</div>
                <div className="mt-1 text-cream-dim">
                  {err ?? "Network issue."} Email us at{" "}
                  <a
                    href="mailto:info@gigmote.com"
                    className="text-gold hover:underline"
                  >
                    info@gigmote.com
                  </a>{" "}
                  directly.
                </div>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </section>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
        {title}
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="hairline my-10" />;
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  span?: 1 | 2;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
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
          required={required}
          placeholder={placeholder}
          rows={4}
          className={baseClasses}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </label>
  );
}

function Select({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full appearance-none rounded-xl border border-cream-line bg-ink-3 px-4 py-3 text-sm text-cream focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
      >
        <option value="" disabled className="bg-ink-3 text-cream-mute">
          Select
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-ink-3 text-cream">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
