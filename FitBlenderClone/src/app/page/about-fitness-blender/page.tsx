import { SectionLanding } from "@/components/site/section-landing";

export default function AboutPage() {
  return (
    <SectionLanding
      title="About Fitness Blender"
      description="Learn about the mission, coaching philosophy, and team behind the platform."
      ctaLabel="Meet the Team"
      ctaHref="/team-members"
      highlights={[
        "Brand story and mission timeline",
        "Trainer and team member profiles",
        "Press references and credibility indicators",
      ]}
    />
  );
}
