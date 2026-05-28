"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";

type AppStatus = "new" | "reviewing" | "shortlisted" | "rejected" | "hired";

const OPTIONS: Array<{ key: AppStatus; label: string; cls: string }> = [
  { key: "new", label: "New", cls: "border-gold/40 bg-gold/10 text-gold" },
  { key: "reviewing", label: "Reviewing", cls: "border-cream/40 bg-ink/5 text-cream" },
  { key: "shortlisted", label: "Shortlist", cls: "border-teal/40 bg-teal/10 text-teal" },
  { key: "hired", label: "Hire", cls: "border-success/40 bg-success/10 text-success" },
  { key: "rejected", label: "Reject", cls: "border-cream-faint bg-cream-faint text-cream-mute" },
];

export function ApplicationActions({
  id,
  status,
}: {
  id: string;
  status: AppStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<AppStatus | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: AppStatus) {
    if (next === status) return;
    setPending(next);
    setError(null);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Update failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setPending(null);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    setPending("delete");
    setError(null);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Delete failed");
      router.push("/admin/applications");
      router.refresh();
    } catch (err) {
      setPending(null);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="label-eyebrow mb-4">— Move to</div>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => {
          const active = status === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setStatus(o.key)}
              disabled={pending !== null}
              data-cursor="link"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                active
                  ? o.cls
                  : "border-cream-faint text-cream-dim hover:border-cream/40 hover:text-cream"
              } disabled:opacity-60`}
            >
              {pending === o.key && <Loader2 size={11} className="animate-spin" />}
              {o.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 text-xs text-danger">
          <AlertTriangle size={12} className="mt-0.5" />
          {error}
        </div>
      )}

      <div className="hairline my-8" />

      <button
        onClick={onDelete}
        disabled={pending !== null}
        data-cursor="link"
        className="inline-flex items-center gap-2 rounded-full border border-danger/30 px-4 py-2 text-xs text-danger transition-colors hover:bg-danger/5 disabled:opacity-60"
      >
        {pending === "delete" ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        Delete application
      </button>
    </div>
  );
}
