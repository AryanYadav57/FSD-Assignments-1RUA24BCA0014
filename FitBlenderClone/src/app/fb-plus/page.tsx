import { SectionLanding } from "@/components/site/section-landing";

export default function FbPlusPage() {
  return (
    <SectionLanding
      title="FB Plus"
      description="Upgrade to access premium programs, advanced planning tools, and member-exclusive content."
      ctaLabel="Upgrade"
      ctaHref="/membership"
      highlights={[
        "Membership feature comparison",
        "Exclusive program and content modules",
        "Billing and renewal controls",
      ]}
    />
  );
}
