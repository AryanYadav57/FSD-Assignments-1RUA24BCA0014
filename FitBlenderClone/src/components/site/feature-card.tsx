import Link from "next/link";

import type { FeatureCard as FeatureCardType } from "@/lib/site-data";

export function FeatureCard({ feature }: { feature: FeatureCardType }) {
  return (
    <article className="shadow-card overflow-hidden rounded-2xl border border-line bg-white">
      <div className="h-36 bg-gradient-to-r from-[#d8eff9] via-[#f0f9ff] to-[#e8f6ef]" />
      <div className="p-6">
        <h3 className="mb-3 text-xl font-bold text-ink">{feature.title}</h3>
        <p className="mb-4 text-sm leading-6 text-ink-soft">{feature.description}</p>
        <Link href={feature.href} className="text-sm font-semibold text-brand-strong hover:underline">
          {feature.cta}
        </Link>
      </div>
    </article>
  );
}
