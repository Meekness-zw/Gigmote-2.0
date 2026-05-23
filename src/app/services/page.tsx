import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABlock } from "@/components/sections/CTABlock";
import { siteContent } from "@/data/content";

export const metadata = {
  title: "Services",
  description:
    "Three integrated capabilities — global staffing, AI business solutions, and BPO advisory — engineered around your operating model.",
};

const SLUG_ACCENT: Record<string, "gold" | "teal" | "sage" | "orange"> = {
  "bpo-matchmaking-advisory": "gold",
  "global-staffing": "teal",
  "ai-business-solutions": "orange",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Three capabilities. One integrated operating model."
        subtitle="Sourcing the technical and operational talent that defines competitive advantage, then deploying the AI infrastructure that compounds it — and advising the BPO strategy that holds it all together."
        scene="lattice"
      />

      {/* Capability cards */}
      <section className="relative bg-ink py-24 border-b border-cream-line">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-3">
            {siteContent.services.map((s, i) => {
              const accent = SLUG_ACCENT[s.slug] ?? "gold";
              return (
                <FadeIn key={s.slug} delay={i * 0.06}>
                  <Link
                    href={`/services/${s.slug}`}
                    data-cursor="link"
                    className="group relative flex h-full flex-col gap-6 bg-ink-2 p-8 transition-colors hover:bg-ink-3 md:p-10"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          accent === "teal"
                            ? "radial-gradient(circle at 30% 0%, rgba(154,210,210,0.08), transparent 60%)"
                            : accent === "orange"
                            ? "radial-gradient(circle at 30% 0%, rgba(232,166,126,0.08), transparent 60%)"
                            : "radial-gradient(circle at 30% 0%, rgba(246,206,72,0.08), transparent 60%)",
                      }}
                    />

                    <div className="relative flex items-center justify-between">
                      <span className="font-mono text-xs tracking-[0.18em] text-gold">
                        0{i + 1}
                      </span>
                      <s.icon size={18} className="text-cream-mute group-hover:text-cream transition-colors" />
                    </div>

                    <div className="relative">
                      <h3 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
                        {s.title}
                      </h3>
                      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-mute">
                        {s.slogan}
                      </div>
                    </div>

                    <p className="relative text-sm leading-relaxed text-cream-dim md:text-[15px]">
                      {s.description}
                    </p>

                    <div className="relative mt-auto flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-cream-mute">
                        {s.pricing}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold">
                        Read more
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          {/* Value rail */}
          <FadeIn className="mt-24">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {siteContent.valueProps.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="border-t border-cream-line pt-6">
                    <Icon size={18} className="text-gold" />
                    <h4 className="mt-3 font-display text-lg leading-tight tracking-tight">
                      {v.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                      {v.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
