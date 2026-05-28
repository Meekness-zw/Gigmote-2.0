"use client";

import { type ReactNode, type ComponentProps } from "react";
import { TransitionLink } from "@/components/chrome/TransitionLink";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-[#0F0F12] hover:bg-gold-soft shadow-[0_0_0_1px_rgba(246,206,72,0.4),0_8px_32px_-8px_rgba(246,206,72,0.4)] hover:shadow-[0_0_0_1px_rgba(246,206,72,0.6),0_12px_40px_-8px_rgba(246,206,72,0.5)] hover:scale-[1.02]",
  secondary:
    "bg-cream-faint text-cream border border-cream-line hover:bg-cream-line hover:border-cream-faint hover:text-cream",
  outline:
    "bg-transparent text-cream border border-cream-faint hover:border-cream/40 hover:bg-cream-faint",
  ghost:
    "bg-transparent text-cream-dim hover:text-cream hover:bg-cream-faint",
};

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  ...rest
}: ButtonProps & Omit<ComponentProps<"button">, "children">) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <TransitionLink href={href} className={cls} data-cursor="magnet">
        {children}
      </TransitionLink>
    );
  }
  return (
    <button className={cls} data-cursor="magnet" {...rest}>
      {children}
    </button>
  );
}
