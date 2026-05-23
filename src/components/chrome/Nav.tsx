"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { TransitionLink } from "@/components/chrome/TransitionLink";
import { useNavigation } from "@/components/chrome/NavigationContext";

const PRIMARY_LINKS = [
  { href: "/solutions", label: "Solutions" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/company", label: "Company" },
  { href: "/jobs", label: "Jobs" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // RAF-coalesce the scrolled check — was firing 60+ times/sec and
    // triggering React re-renders. With RAF + a guard we hit React state
    // at most when the boolean actually flips.
    let raf = 0;
    let lastScrolled = window.scrollY > 16;
    setScrolled(lastScrolled);
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const next = window.scrollY > 16;
        if (next !== lastScrolled) {
          lastScrolled = next;
          setScrolled(next);
        }
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-ink/70 border-b border-cream-line"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Gigmote home"
            className="group flex items-center gap-2.5 font-display text-lg font-medium tracking-tight"
            data-cursor="link"
          >
            <span aria-hidden className="relative grid h-6 w-6 place-items-center">
              <span className="absolute inset-0 rounded-full border border-gold/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-gold transition-transform group-hover:scale-150" />
            </span>
            <span>Gigmote</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-8 lg:flex">
            {PRIMARY_LINKS.map((l) => (
              <MagneticLink key={l.href} href={l.href}>
                <span className="relative inline-block py-1 text-sm text-cream-dim transition-colors hover:text-cream">
                  {l.label}
                </span>
              </MagneticLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <MagneticLink href="/contact" strength={0.35} cursorLabel="Book →">
              <span className="group relative inline-flex items-center gap-2 rounded-full border border-cream-faint bg-cream-faint px-5 py-2.5 text-sm font-medium text-cream backdrop-blur-md transition-colors hover:border-gold/50 hover:bg-gold hover:text-ink">
                <span className="relative h-1.5 w-1.5 rounded-full bg-gold transition-colors group-hover:bg-ink">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold/50 group-hover:hidden" />
                </span>
                Book a Strategy Call
              </span>
            </MagneticLink>
          </div>

          {/* Mobile */}
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-cream-faint text-cream lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
            data-cursor="link"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="mt-24 flex flex-1 flex-col px-6">
              <ul className="flex flex-col gap-1">
                {PRIMARY_LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-cream-line"
                  >
                    <TransitionLink
                      href={l.href}
                      className="block py-5 font-display text-3xl tracking-tight"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </TransitionLink>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto mb-12 flex flex-col gap-4">
                <TransitionLink
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-gold px-6 py-4 text-center font-medium text-ink"
                >
                  Book a Strategy Call
                </TransitionLink>
                <TransitionLink
                  href="/join-gigmote"
                  onClick={() => setOpen(false)}
                  className="block rounded-full border border-cream-faint px-6 py-4 text-center text-cream"
                >
                  Join Gigmote
                </TransitionLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
