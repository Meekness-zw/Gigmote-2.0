import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { CapabilitiesGrid } from "@/components/sections/CapabilitiesGrid";
import { PositionBlock } from "@/components/sections/PositionBlock";
import { ProcessJourney } from "@/components/sections/ProcessJourney";
import { ROICalculator } from "@/components/sections/ROICalculator";
import { ComparisonBlock } from "@/components/sections/ComparisonBlock";
import { CaseStudyReel } from "@/components/sections/CaseStudyReel";
import { ResultsBlock } from "@/components/sections/ResultsBlock";
import { CTABlock } from "@/components/sections/CTABlock";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <CapabilitiesGrid />
      <PositionBlock />
      <ProcessJourney />
      <ROICalculator />
      <ComparisonBlock />
      <CaseStudyReel />
      <ResultsBlock />
      <CTABlock />
    </>
  );
}
