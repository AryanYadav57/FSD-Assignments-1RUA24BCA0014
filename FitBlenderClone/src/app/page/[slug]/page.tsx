import { SectionLanding } from "@/components/site/section-landing";

type Params = {
  slug: string;
};

export default async function StaticPageTemplate({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const title = slug.replaceAll("-", " ");

  return (
    <SectionLanding
      title={title}
      description="This static information page is scaffolded and ready for content parity implementation."
      ctaLabel="Return Home"
      ctaHref="/"
      highlights={[
        "Long-form informational layout",
        "Internal support and legal links",
        "Contact and FAQ oriented modules",
      ]}
    />
  );
}
