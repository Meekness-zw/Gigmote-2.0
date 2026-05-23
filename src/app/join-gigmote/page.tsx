import { PageHero } from "@/components/sections/PageHero";
import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { CTABlock } from "@/components/sections/CTABlock";

export const metadata = {
  title: "Join Gigmote",
  description:
    "Apply to join the Gigmote bench. Long-term placements with serious operators. We hire AI engineers, compliance ops, data scientists, CX leads, and senior technical operators.",
};

export default function JoinGigmotePage() {
  return (
    <>
      <PageHero
        eyebrow="Join Gigmote"
        title="Be the operator we trust."
        subtitle="Application flow for AI engineers, compliance ops, senior CX leads, and technical operators. Long-term placements only — no freelance gigs."
        scene="constellation"
      />
      <ApplicationForm />
      <CTABlock />
    </>
  );
}
