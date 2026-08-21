import Link from "next/link";

import { footerColumns } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface-muted">
      <div className="site-container py-12">
        <div className="mb-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-soft">{column.title}</h2>
              <ul className="space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-ink hover:text-brand-strong">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-line pt-6 text-sm text-ink-soft">
          <p>Copyright {new Date().getFullYear()} Fitness Blender Clone. All rights reserved.</p>
          <div className="mt-2 flex flex-wrap gap-4">
            <Link href="/page/terms-of-use-agreement" className="hover:text-brand-strong">
              Terms of Use
            </Link>
            <Link href="/page/privacy-policy" className="hover:text-brand-strong">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
