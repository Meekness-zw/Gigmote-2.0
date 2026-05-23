"use client";

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import Link, { type LinkProps } from "next/link";
import { useNavigation } from "@/components/chrome/NavigationContext";

/**
 * <TransitionLink> — drop-in replacement for next/link that routes through
 * the NavigationContext so the page-transition curtain plays *before* the
 * actual route push.
 *
 * Falls back to default next/link behavior when:
 *   - the href is external (different origin) or a hash-only link
 *   - the click was modified (cmd/ctrl/middle/shift) — let the browser
 *     open in a new tab
 *   - the user prefers reduced motion (NavigationContext handles this)
 */

type Props = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(
  function TransitionLink({ href, onClick, children, ...rest }, ref) {
    const { navigate } = useNavigation();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        (e.button !== undefined && e.button !== 0)
      ) {
        return; // modifier — let the browser handle it
      }
      const h = typeof href === "string" ? href : "";
      if (!h || h.startsWith("http") || h.startsWith("mailto:") || h.startsWith("tel:") || h.startsWith("#")) {
        return;
      }
      e.preventDefault();
      navigate(h);
    };

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  }
);
