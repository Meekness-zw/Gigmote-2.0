import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { CTABlock } from "@/components/sections/CTABlock";

export const metadata = {
  title: "Contact",
  description:
    "Book a 30-minute strategy call. Share the operating context and we'll come back with a wedge proposal within 48 hours.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk operations."
        subtitle="Share the operating context — team size, current pain, target outcome — and we'll come back with a wedge proposal within 48 hours."
        scene="pulse"
      />
      <ContactForm />
      <CTABlock />
    </>
  );
}
