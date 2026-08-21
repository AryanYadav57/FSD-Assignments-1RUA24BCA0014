import { SectionLanding } from "@/components/site/section-landing";

type Params = {
  slug: string[];
};

export default async function CommunityChildPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const segment = slug.join(" / ");

  return (
    <SectionLanding
      title={`Community: ${segment}`}
      description="Community subpage scaffold. This route supports announcements, discussions, and updates templates."
      ctaLabel="Back to Community"
      ctaHref="/community"
      highlights={[
        "Discussion thread list",
        "Pinned updates and announcements",
        "Member interaction and moderation tools",
      ]}
    />
  );
}
