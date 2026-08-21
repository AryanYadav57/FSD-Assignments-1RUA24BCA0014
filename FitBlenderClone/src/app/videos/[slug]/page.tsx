import { DetailTemplate } from "@/components/site/detail-template";

type Params = {
  slug: string;
};

export default async function VideoDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  return (
    <DetailTemplate
      section="Workout Video"
      title={slug.replaceAll("-", " ")}
      subtitle="Workout detail scaffold with placeholders for trainer info, intensity, equipment, and save-to-calendar interactions."
      meta={["Workout", "Trainer Led", "At Home"]}
      ctaLabel="Start Workout"
    />
  );
}
