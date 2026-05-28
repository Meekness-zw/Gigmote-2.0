"use client";

import { useEffect } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error in dev. In production this gets shipped to whatever
    // telemetry sink is wired up at the app boundary.
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate grid min-h-[70svh] place-items-center overflow-hidden bg-grain bg-ink px-6 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,122,122,0.10), transparent 60%)",
        }}
      />
      <div className="relative max-w-2xl text-center">
        <div className="label-eyebrow mb-6">— Something went wrong</div>
        <h1 className="font-display text-4xl leading-tight tracking-tighter md:text-6xl">
          A piece of the system tripped.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream-dim md:text-lg">
          We've logged it. Try again, or head back to the home page and we'll
          investigate.
        </p>

        {error?.digest && (
          <div className="mx-auto mt-6 inline-block rounded-full border border-cream-line bg-ink-2 px-4 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cream-mute">
            ref · {error.digest}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            data-cursor="magnet"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-[#0F0F12] transition-transform hover:scale-[1.02]"
          >
            <RefreshCcw size={14} />
            Try again
          </button>
          <Link
            href="/"
            data-cursor="link"
            className="inline-flex items-center gap-2 rounded-full border border-cream-faint px-6 py-3 text-sm text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
