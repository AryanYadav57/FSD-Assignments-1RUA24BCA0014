import { DetailTemplate } from "@/components/site/detail-template";

type Params = {
  slug: string;
};

export default async function PlanDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  return (
    <DetailTemplate
      section="Program"
      title={slug.replaceAll("-", " ")}
      subtitle="This program detail template is prepared for full parity implementation, including schedule, trainer details, and membership-gated modules."
      meta={["Program", "FB Plus", "Calendar Guided"]}
      ctaLabel="Add To Bag"
    />
  );
}
