"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Check, AlertTriangle, Mail, MapPin, Clock } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

type Status = "idle" | "sending" | "ok" | "error";

const SERVICE_OPTIONS = [
  "Global Staffing",
  "AI Business Solutions",
  "BPO Advisory",
  "Not sure yet",
];

const TEAM_SIZE_OPTIONS = ["1–10", "11–50", "51–200", "200+"];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrorMsg(null);

    const payload: Record<string, string> = {};
    data.forEach((v, k) => (payload[k] = String(v)));

    try {
      // Primary path: POST to our own API → persists to DB + best-effort
      // SMTP notification on the server.
      const res = await fetch("/api/contact", {
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
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    }
  }

  return (
    <section className="relative border-b border-cream-line bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Side info column */}
          <FadeIn className="md:col-span-4">
            <div className="label-eyebrow mb-5">— Get in touch</div>
            <h2 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
              30 minutes. <span className="text-gold">Real diagnostics.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cream-dim">
              No deck pitch. We'll diagnose the operating constraint, sketch
              the wedge, and tell you whether Gigmote is the right partner —
              even when the answer is no.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <span className="mt-1 grid h-9 w-9 place-items-center rounded-full border border-cream-line">
                  <Mail size={14} className="text-gold" />
                </span>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute">
                    Email
                  </div>
                  <a
                    href="mailto:info@gigmote.com"
                    className="mt-1 inline-block text-base text-cream transition-colors hover:text-gold"
                  >
                    info@gigmote.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 grid h-9 w-9 place-items-center rounded-full border border-cream-line">
                  <Clock size={14} className="text-gold" />
                </span>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute">
                    Response time
                  </div>
                  <div className="mt-1 text-base text-cream">
                    Within 48 hours · Mon–Fri
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 grid h-9 w-9 place-items-center rounded-full border border-cream-line">
                  <MapPin size={14} className="text-gold" />
                </span>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute">
                    Coverage
                  </div>
                  <div className="mt-1 text-base text-cream">
                    UK · North America · Global delivery
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn className="md:col-span-8" delay={0.1}>
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

              <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Your name" name="name" required placeholder="Jane Doe" />
                <Field
                  label="Work email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                />
                <Field label="Company" name="company" placeholder="Acme Corp" />
                <SelectField label="Team size" name="team" options={TEAM_SIZE_OPTIONS} />
                <SelectField
                  label="What are you exploring?"
                  name="service"
                  options={SERVICE_OPTIONS}
                  span={2}
                />
                <Field
                  label="Tell us about the operating problem"
                  name="message"
                  textarea
                  required
                  placeholder="What's the function you're trying to scale, automate, or fix?"
                  span={2}
                />
              </div>

              <div className="relative mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-cream-mute">
                  By submitting you agree to our privacy policy. We never share
                  contact details.
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
                      Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </div>

              {/* Status */}
              {status === "ok" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative mt-6 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm text-cream"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <div className="font-medium">Message received.</div>
                    <div className="mt-1 text-cream-dim">
                      We'll come back within 48 hours.
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
                    <div className="font-medium">Couldn't send.</div>
                    <div className="mt-1 text-cream-dim">
                      {errorMsg ?? "Network issue."} Email us at{" "}
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
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
          rows={5}
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

function SelectField({
  label,
  name,
  options,
  span = 1,
}: {
  label: string;
  name: string;
  options: string[];
  span?: 1 | 2;
}) {
  return (
    <label className={`flex flex-col gap-2 ${span === 2 ? "md:col-span-2" : ""}`}>
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="w-full appearance-none rounded-xl border border-cream-line bg-ink-3 px-4 py-3 text-sm text-cream focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
      >
        <option value="" disabled className="bg-ink-3 text-cream-mute">
          Select an option
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-ink-3 text-cream">
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
