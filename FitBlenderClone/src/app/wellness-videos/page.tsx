import { SectionLanding } from "@/components/site/section-landing";

export default function WellnessVideosPage() {
  return (
    <SectionLanding
      title="Wellness Videos"
      description="Discover breathing, mindfulness, and recovery sessions to support a sustainable body and mind routine."
      ctaLabel="Watch Wellness Videos"
      ctaHref="/wellness-videos"
      highlights={[
        "Mindfulness and breathwork sessions",
        "Recovery and mobility support videos",
        "Beginner-friendly guidance",
      ]}
    />
  );
}
