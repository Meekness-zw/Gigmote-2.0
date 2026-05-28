"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const LINK_GROUPS = [
  {
    label: "Capabilities",
    links: [
      { href: "/services", label: "Services overview" },
      { href: "/services/global-staffing", label: "Global staffing" },
      { href: "/services/ai-business-solutions", label: "AI business solutions" },
      { href: "/services/bpo-advisory", label: "BPO advisory" },
    ],
  },
  {
    label: "Industries",
    links: [
      { href: "/industries/saas", label: "SaaS" },
      { href: "/industries/healthcare", label: "Healthcare" },
      { href: "/industries/fintech", label: "FinTech" },
      { href: "/industries/it-web3", label: "IT & Web3" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "/company", label: "Company" },
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/case-studies", label: "Case studies" },
      { href: "/solutions", label: "Solutions overview" },
    ],
  },
  {
    label: "Talent",
    links: [
      { href: "/jobs", label: "Open roles" },
      { href: "/join-gigmote", label: "Join the bench" },
      { href: "/careers", label: "Careers" },
      { href: "/hire-a-dev", label: "Hire a dev" },
      { href: "/resources", label: "Resources" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink border-t border-cream-line">
      {/* Massive type — Lusion-style closer */}
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 md:pt-40">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          {/* Left — brand block */}
          <div className="md:col-span-5 lg:col-span-6">
            <div className="label-eyebrow mb-5">— Let's build</div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl leading-[0.92] tracking-tighter md:text-7xl lg:text-[88px]"
            >
              Scale<br />
              <span className="text-gold">smarter.</span>
            </motion.h2>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                data-cursor="magnet"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-[#0F0F12] transition-transform hover:scale-[1.02]"
              >
                Book a Strategy Call
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/join-gigmote"
                data-cursor="link"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-cream-faint px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:border-cream/40"
              >
                Join the talent pool
              </Link>
            </div>
          </div>

          {/* Right — link grid */}
          <div className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3 lg:col-span-6">
            {LINK_GROUPS.map((g) => (
              <div key={g.label}>
                <div className="label-eyebrow mb-5">{g.label}</div>
                <ul className="space-y-3">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        data-cursor="link"
                        className="group inline-flex items-center gap-1.5 text-sm text-cream-dim transition-colors hover:text-cream"
                      >
                        <span>{l.label}</span>
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Wordmark divider */}
        <div className="relative mt-24 overflow-hidden">
          <div className="hairline mb-6" />
          <div
            aria-hidden
            className="select-none whitespace-nowrap font-display text-[18vw] font-medium leading-none tracking-tightest text-cream-line"
          >
            GIGMOTE · GIGMOTE · GIGMOTE
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-start gap-4 text-xs font-mono uppercase tracking-[0.18em] text-cream-mute md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Gigmote · All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-cream">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-cream">
              Terms
            </Link>
            <Link href="/contact" className="transition-colors hover:text-cream">
              info@gigmote.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
