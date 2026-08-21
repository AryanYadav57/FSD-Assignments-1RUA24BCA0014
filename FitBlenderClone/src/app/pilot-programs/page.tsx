import { SectionLanding } from "@/components/site/section-landing";

export default function PilotProgramsPage() {
  return (
    <SectionLanding
      title="Pilot Programs"
      description="Explore specialized pilot programs built for specific conditions, interests, and life stages."
      ctaLabel="Explore Pilots"
      ctaHref="/pilot-programs"
      highlights={[
        "Niche program experiences",
        "Eligibility and suitability notes",
        "Feedback and improvement loops",
      ]}
    />
  );
}
