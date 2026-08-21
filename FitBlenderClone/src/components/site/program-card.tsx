import Link from "next/link";

import type { ProgramCard as ProgramCardType } from "@/lib/site-data";

export function ProgramCard({ program }: { program: ProgramCardType }) {
  return (
    <article className="shadow-card rounded-2xl border border-line bg-white p-5">
      <div className="mb-4 rounded-xl bg-surface-muted px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
        Featured Program
      </div>
      <h3 className="mb-2 text-lg font-bold text-ink">{program.title}</h3>
      <p className="mb-3 text-sm text-ink-soft">{program.subtitle}</p>
      <p className="mb-1 text-sm text-ink-soft">{program.duration}</p>
      <p className="mb-4 text-sm font-semibold text-brand-strong">{program.price}</p>
      <Link href={program.href} className="text-sm font-semibold text-ink hover:text-brand-strong">
        View Program
      </Link>
    </article>
  );
}
