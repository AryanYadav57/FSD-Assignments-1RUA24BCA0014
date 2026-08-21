import Link from "next/link";

type SectionLandingProps = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  highlights: string[];
};

export function SectionLanding({ title, description, ctaLabel, ctaHref, highlights }: SectionLandingProps) {
  return (
    <div className="site-container py-12">
      <section className="mb-10 rounded-2xl border border-line bg-white p-8 shadow-card">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-ink">{title}</h1>
        <p className="mb-6 max-w-3xl text-base leading-7 text-ink-soft">{description}</p>
        <Link
          href={ctaHref}
          className="inline-flex rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
        >
          {ctaLabel}
        </Link>
      </section>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <article key={item} className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="text-lg font-bold text-ink">{item}</h2>
            <p className="mt-2 text-sm text-ink-soft">
              This section is scaffolded and ready for detailed parity components from the source site.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
