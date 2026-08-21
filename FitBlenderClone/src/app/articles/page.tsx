import { SectionLanding } from "@/components/site/section-landing";

export default function ArticlesPage() {
  return (
    <SectionLanding
      title="Articles"
      description="Explore expert-written content across fitness, health, nutrition, and lifestyle."
      ctaLabel="Browse Categories"
      ctaHref="/articles?category=fitness"
      highlights={[
        "Category filters with pagination",
        "Article cards with metadata",
        "Editorial detail pages",
      ]}
    />
  );
}
