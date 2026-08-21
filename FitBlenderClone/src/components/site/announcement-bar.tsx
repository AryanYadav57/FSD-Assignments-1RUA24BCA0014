import Link from "next/link";

import { topBanner } from "@/lib/site-data";

export function AnnouncementBar() {
  return (
    <div className="bg-brand px-4 py-2 text-center text-sm font-semibold text-white">
      <span className="mr-2">{topBanner.label}</span>
      <Link className="underline decoration-white/50 underline-offset-4" href={topBanner.href}>
        {topBanner.cta}
      </Link>
    </div>
  );
}
