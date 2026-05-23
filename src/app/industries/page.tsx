import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABlock } from "@/components/sections/CTABlock";
import { siteContent } from "@/data/content";

export const metadata = {
  title: "Industries",
  description:
    "Six verticals — healthcare, SaaS, FinTech, IT & Web3, digital marketing, sales enablement — each with operating models tuned to its compliance, talent, and tooling reality.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Six verticals. One operating playbook."
        subtitle="From regulated healthcare to crypto-native Web3 — our engagement models adapt to each industry's compliance, talent, and tooling reality."
        scene="grid"
      />

      <section className="relative bg-ink py-24 border-b border-cream-line">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-2 lg:grid-cols-3">
            {siteContent.industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <FadeIn key={ind.slug} delay={(i % 3) * 0.06}>
                  <Link
                    href={`/industries/${ind.slug}`}
                    data-cursor="link"
                    className="group relative flex h-full flex-col gap-5 bg-ink-2 p-8 transition-colors hover:bg-ink-3 md:p-10"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 0%, rgba(246,206,72,0.08), transparent 60%)",
                      }}
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="font-mono text-xs tracking-[0.18em] text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon size={20} className="text-cream-mute transition-colors group-hover:text-gold" />
                    </div>
                    <h3 className="relative font-display text-2xl leading-tight tracking-tight md:text-3xl">
                      {ind.title}
                    </h3>
                    <p className="relative text-sm leading-relaxed text-cream-dim">
                      {ind.description}
                    </p>
                    <div className="relative mt-auto flex items-center gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold">
                      Industry detail
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
