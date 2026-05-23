"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";

const CASES = [
  {
    no: "01",
    id: "accounting-financial-operations-optimization",
    industry: "Accounting & Financial Operations",
    title: "Month-end close cut from 21 days to 6.",
    body:
      "A US e-commerce brand was bleeding speed on month-end close. We deployed an offshore accounting pod (senior + junior), codified the procedures, and integrated reporting into their Shopify/Stripe stack.",
    metrics: [
      { v: "58%", l: "Cost reduction" },
      { v: "$92K", l: "Annual savings" },
      { v: "+8%", l: "Gross margin" },
    ],
    image: "/images/A product manager and software team planning a tech roadmap on digital whiteboard screens, agile sprint boards and UX wireframes visible, sleek tech office or remote work setup, clean modern business .jpg",
    accent: "from-gold/30 via-gold/10",
  },
  {
    no: "02",
    id: "b2b-sales-development-acceleration",
    industry: "B2B SaaS Sales Development",
    title: "$480K → $2.1M pipeline in under 6 months.",
    body:
      "A seed-stage SaaS founder team was running outbound themselves — fewer than 8 demos a month. We built a two-person SDR pod with KPIs, scripts, and a dashboard tied to demos.",
    metrics: [
      { v: "4×", l: "Outbound activity" },
      { v: "26", l: "Qualified demos/mo" },
      { v: "~$110K", l: "Annual saved" },
    ],
    image: "/images/Gigmote Asset 5.jpg",
    accent: "from-teal/20 via-teal/5",
  },
  {
    no: "03",
    id: "digital-marketing-performance-efficiency",
    industry: "Digital Marketing",
    title: "42% lower CPL. 3× the content output.",
    body:
      "A $10M ARR healthcare tech company was overspending on US contractors with inconsistent execution. We deployed a marketer + content + ops trio, centralized ad management, and automated reporting.",
    metrics: [
      { v: "42%", l: "CPL decrease" },
      { v: "3×", l: "Content output" },
      { v: "$180K", l: "Annual savings" },
    ],
    image: "/images/Gigmote Asset 4.jpg",
    accent: "from-orange/20 via-orange/5",
  },
  {
    no: "04",
    id: "revenue-cycle-management-optimization",
    industry: "Healthcare · RCM",
    title: "Denials from 18% to 7%. A/R from 52 to 31 days.",
    body:
      "A multi-location practice was facing rising claim denials and stretched A/R. We assembled an RCM pod focused on prior authorisations, claim scrubbing, and denial analytics.",
    metrics: [
      { v: "18% → 7%", l: "Denial rate" },
      { v: "31d", l: "Days in A/R" },
      { v: "+$220K", l: "Monthly cash flow" },
    ],
    image: "/images/Gigmote Asset 3.jpg",
    accent: "from-sage/20 via-sage/5",
  },
  {
    no: "05",
    id: "integrated-back-office-sales-support-real-estate",
    industry: "Real Estate · Back-office",
    title: "75 → 110 properties without local headcount.",
    body:
      "A US real estate investment firm was bottlenecked on property accounting, tenant comms, and investor reporting. We deployed a hybrid pod and standardized reporting for investors.",
    metrics: [
      { v: "52%", l: "Overhead cut" },
      { v: "60%", l: "Faster turnaround" },
      { v: "$210K", l: "Annual saved" },
    ],
    image: "/images/Gigmote Asset 1.jpg",
    accent: "from-gold/30 via-gold/10",
  },
];

export function CaseStudyReel() {
  return (
    <section className="relative bg-ink py-24 md:py-36 border-b border-cream-line">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-16 max-w-3xl md:mb-24">
          <div className="label-eyebrow mb-5">— Case studies</div>
          <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
            <SplitText text="Evidence over promises." stagger={0.05} />
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-dim md:text-lg">
            Five engagements across accounting, sales, marketing, RCM, and
            real-estate back-office — each one starting with a wedge and
            scaled with evidence.
          </p>
        </FadeIn>

        <div className="space-y-32 md:space-y-48">
          {CASES.map((c, i) => (
            <CaseCard key={c.no} {...c} index={i} />
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link
            href="/case-studies"
            data-cursor="magnet"
            className="group inline-flex items-center gap-3 rounded-full border border-cream-faint px-6 py-3 text-sm text-cream-dim transition-all hover:border-gold/40 hover:text-cream"
          >
            See all case studies
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface CaseCardProps {
  no: string;
  id: string;
  industry: string;
  title: string;
  body: string;
  metrics: Array<{ v: string; l: string }>;
  image: string;
  accent: string;
  index: number;
}

function CaseCard({
  no,
  id,
  industry,
  title,
  body,
  metrics,
  image,
  accent,
  index,
}: CaseCardProps) {
  const reverse = index % 2 === 1;

  return (
    <div
      className={`grid grid-cols-1 gap-10 items-center md:grid-cols-12 md:gap-16 ${
        reverse ? "md:[direction:rtl]" : ""
      }`}
    >
      {/* Image side — CSS hover scale beats scroll-driven parallax for perf.
          With 5 cards on this page, this swap drops 15 useTransforms / frame. */}
      <FadeIn className="md:col-span-7 md:[direction:ltr]">
        <Link
          href={`/case-studies/${id}`}
          data-cursor="link"
          className="group relative block aspect-[16/11] overflow-hidden rounded-3xl border border-cream-line bg-ink-2"
          aria-label={`Read case study: ${title}`}
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            <Image
              src={image}
              alt={industry}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>

          {/* Color wash */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${accent} to-transparent mix-blend-overlay`}
          />
          {/* Bottom darken */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent"
          />

          {/* Number overlay */}
          <div className="pointer-events-none absolute bottom-6 left-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-cream">
            <span className="text-gold">{no}</span>
            <span className="text-cream-mute">/</span>
            <span>{industry}</span>
          </div>

          {/* Magnetic peek arrow on hover */}
          <div className="pointer-events-none absolute top-6 right-6 grid h-12 w-12 place-items-center rounded-full border border-cream-faint bg-ink/40 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:border-gold/60 group-hover:bg-gold">
            <ArrowUpRight
              size={16}
              className="text-cream transition-colors group-hover:text-ink"
            />
          </div>
        </Link>
      </FadeIn>

      {/* Text side */}
      <FadeIn delay={0.1} className="md:col-span-5 md:[direction:ltr]">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-mute">
          {industry}
        </div>
        <h3 className="mt-3 font-display text-3xl leading-tight tracking-tighter md:text-4xl">
          {title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-cream-dim md:text-lg">
          {body}
        </p>

        {/* Metrics */}
        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-cream-line pt-6">
          {metrics.map((m) => (
            <div key={m.l}>
              <div className="font-display text-xl tracking-tight text-gold md:text-2xl">
                {m.v}
              </div>
              <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.16em] text-cream-mute">
                {m.l}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
