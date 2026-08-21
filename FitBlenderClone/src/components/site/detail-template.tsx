import Link from "next/link";

type DetailTemplateProps = {
  section: string;
  title: string;
  subtitle: string;
  meta: string[];
  ctaLabel: string;
};

export function DetailTemplate({ section, title, subtitle, meta, ctaLabel }: DetailTemplateProps) {
  return (
    <div className="site-container py-12">
      <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="h-60 bg-gradient-to-r from-[#d9edf9] via-[#f5fbfe] to-[#edf8e7]" />
        <div className="p-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft">{section}</p>
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-ink">{title}</h1>
          <p className="mb-4 max-w-3xl text-base leading-7 text-ink-soft">{subtitle}</p>
          <ul className="mb-8 flex flex-wrap gap-3 text-sm">
            {meta.map((item) => (
              <li key={item} className="rounded-full border border-line bg-surface-muted px-3 py-1 text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-strong">
              {ctaLabel}
            </button>
            <Link
              href="/membership"
              className="rounded-md border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              Learn About Membership
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
