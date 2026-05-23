"use client";

import { useRef, type ReactNode } from "react";
import { TransitionLink } from "@/components/chrome/TransitionLink";

interface Props {
  href: string;
  children: ReactNode;
  strength?: number; // 0..1
  className?: string;
  cursorLabel?: string;
}

/**
 * Magnetic wrapper: child translates toward the pointer while it hovers.
 * Routes through TransitionLink so clicks coordinate with the page
 * transition curtain.
 */
export function MagneticLink({
  href,
  children,
  strength = 0.25,
  className,
  cursorLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    const node = inner.current;
    if (!el || !node) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onLeave = () => {
    if (inner.current) inner.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <TransitionLink
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      data-cursor="magnet"
      data-cursor-label={cursorLabel}
    >
      <span
        ref={inner}
        className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
      >
        {children}
      </span>
    </TransitionLink>
  );
}
