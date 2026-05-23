import { PageHero } from "@/components/sections/PageHero";
import { CaseStudyReel } from "@/components/sections/CaseStudyReel";
import { ResultsBlock } from "@/components/sections/ResultsBlock";
import { CTABlock } from "@/components/sections/CTABlock";

export const metadata = {
  title: "Case studies",
  description:
    "Five engagements across accounting, sales, marketing, RCM, and real-estate back-office. Each started with a wedge and scaled with evidence.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Five engagements. Five operating systems."
        subtitle="Every Gigmote engagement starts with a wedge — a measurable, high-leverage function — and expands once the model proves itself in production. These are five of those wedges."
        scene="constellation"
      />
      <CaseStudyReel />
      <ResultsBlock />
      <CTABlock />
    </>
  );
}
