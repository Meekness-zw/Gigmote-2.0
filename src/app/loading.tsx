export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-[60svh] place-items-center bg-ink"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative grid h-10 w-10 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-gold/40" />
          <span className="h-2 w-2 rounded-full bg-gold" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream-mute">
          Loading…
        </span>
      </div>
    </div>
  );
}
