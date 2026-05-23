import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { CTABlock } from "@/components/sections/CTABlock";
import { siteContent } from "@/data/content";

export function generateStaticParams() {
  return siteContent.services.map((s) => ({ slug: s.slug }));
}

const ACCENT_MAP: Record<string, "gold" | "teal" | "sage" | "orange"> = {
  "bpo-matchmaking-advisory": "gold",
  "global-staffing": "teal",
  "ai-business-solutions": "orange",
};

const SCENE_MAP: Record<string, "lattice" | "network" | "flow"> = {
  "bpo-matchmaking-advisory": "lattice",
  "global-staffing": "network",
  "ai-business-solutions": "flow",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = siteContent.services.find((x) => x.slug === slug);
  if (!s) return { title: "Service" };
  return {
    title: s.title,
    description: s.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = siteContent.services.find((s) => s.slug === slug);
  if (!service) notFound();

  const accent = ACCENT_MAP[service.slug] ?? "gold";
  const sceneKind = SCENE_MAP[service.slug] ?? "ambient";
  const Icon = service.icon;
  const otherServices = siteContent.services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        eyebrow={service.slogan}
        title={service.title}
        subtitle={service.description}
        accent={accent}
        scene={sceneKind}
      />

      {/* Stats strip */}
      <section className="relative border-b border-cream-line bg-ink py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-4">
            <div className="flex items-center gap-4 bg-ink-2 p-6">
              <Icon size={20} className="text-gold" />
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                  Engagement
                </div>
                <div className="mt-1 font-display text-lg tracking-tight">
                  {service.title.split(" ")[0]}
                </div>
              </div>
            </div>
            <div className="bg-ink-2 p-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                Pricing
              </div>
              <div className="mt-1 font-display text-lg tracking-tight text-cream">
                {service.pricing}
              </div>
            </div>
            {service.stats.map((s) => (
              <div key={s.label} className="bg-ink-2 p-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                  {s.label}
                </div>
                <div className="mt-1 font-display text-lg tracking-tight text-gold">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <FadeIn>
                <div className="label-eyebrow mb-5">— What's included</div>
                <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-5xl">
                  The full delivery scope.
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-cream-dim md:text-lg">
                  Every engagement is scoped around outcomes, not deliverables.
                  Here's what shows up in this practice.
                </p>
              </FadeIn>
            </div>

            <div className="md:col-span-7">
              <ul className="divide-y divide-cream-line border-y border-cream-line">
                {service.features.map((feature, i) => (
                  <FadeIn key={feature} delay={i * 0.05}>
                    <li className="flex items-start gap-4 py-5">
                      <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/5">
                        <Check size={12} className="text-gold" />
                      </span>
                      <span className="text-base leading-relaxed md:text-lg">
                        {feature}
                      </span>
                    </li>
                  </FadeIn>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Best For */}
      <section className="relative border-b border-cream-line bg-ink py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-16 max-w-3xl">
            <div className="label-eyebrow mb-5">— Best fit</div>
            <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-5xl">
              Who this is built for.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-2 lg:grid-cols-4">
            {service.bestFor.map((b, i) => (
              <FadeIn key={b} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-3 bg-ink-2 p-6">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-gold">
                    0{i + 1}
                  </span>
                  <p className="text-base font-medium leading-snug text-cream">
                    {b}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn className="text-center">
            <div className="label-eyebrow mb-6">— What's different</div>
            <p className="font-display text-2xl leading-tight tracking-tight md:text-4xl">
              <span className="text-gold">"</span>
              {service.differentiator}
              <span className="text-gold">"</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative border-b border-cream-line bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn className="mb-12 max-w-2xl">
            <div className="label-eyebrow mb-5">— Common questions</div>
            <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-4xl">
              Things teams ask before we engage.
            </h2>
          </FadeIn>
          <FAQAccordion items={siteContent.faqs} />
        </div>
      </section>

      {/* Other services */}
      <section className="relative bg-ink py-20 border-b border-cream-line">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-10">
            <div className="label-eyebrow">— Continue exploring</div>
          </FadeIn>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-2">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-cursor="link"
                className="group flex h-full flex-col gap-4 bg-ink-2 p-8 transition-colors hover:bg-ink-3 md:p-10"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-mute">
                  Service
                </div>
                <h3 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream-dim">
                  {s.slogan}
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold">
                  Explore
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button href="/contact" variant="primary" size="lg">
              Talk to the operations team
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
