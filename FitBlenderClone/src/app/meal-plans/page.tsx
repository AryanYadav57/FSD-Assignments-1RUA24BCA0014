import { SectionLanding } from "@/components/site/section-landing";

export default function MealPlansPage() {
  return (
    <SectionLanding
      title="Meal Plans"
      description="Meal plans combine structure and flexibility, with practical nutrition guidance to support your training goals."
      ctaLabel="Browse Meal Plans"
      ctaHref="/meal-plans"
      highlights={[
        "Plan catalog with dietary filters",
        "Daily meal schedule previews",
        "Recipe-linked shopping assistance",
      ]}
    />
  );
}
