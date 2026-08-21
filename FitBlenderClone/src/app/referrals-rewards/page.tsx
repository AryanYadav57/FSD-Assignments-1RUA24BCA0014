import { SectionLanding } from "@/components/site/section-landing";

export default function ReferralsRewardsPage() {
  return (
    <SectionLanding
      title="Referral Program"
      description="Share your referral code and earn rewards whenever someone joins through your link."
      ctaLabel="View Rewards"
      ctaHref="/membership"
      highlights={[
        "Referral code and sharing module",
        "Reward progress visualization",
        "Terms and qualification details",
      ]}
    />
  );
}
