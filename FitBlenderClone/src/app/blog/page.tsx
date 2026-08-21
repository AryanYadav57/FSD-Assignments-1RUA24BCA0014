import { SectionLanding } from "@/components/site/section-landing";

export default function BlogPage() {
  return (
    <SectionLanding
      title="Blog"
      description="Read practical training advice, coach notes, and site updates designed to support long-term consistency and results."
      ctaLabel="Read Latest"
      ctaHref="/blog/latest"
      highlights={[
        "Blog listing template with categories and tags",
        "Rich article detail page with callouts",
        "Related content recommendations",
      ]}
    />
  );
}
