"use client";

import Link from "next/link";
import { useState } from "react";

import { menuColumns } from "@/lib/site-data";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-ink">
          Fitness Blender
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold uppercase tracking-wide text-ink-soft lg:flex">
          <Link href="/membership" className="hover:text-brand-strong transition-colors">
            Membership
          </Link>
          <Link href="/videos" className="hover:text-brand-strong transition-colors">
            Workouts
          </Link>
          <Link href="/plans" className="hover:text-brand-strong transition-colors">
            Programs
          </Link>
          <Link href="/healthy-living" className="hover:text-brand-strong transition-colors">
            Healthy Living
          </Link>
          <Link href="/community" className="hover:text-brand-strong transition-colors">
            Community
          </Link>
          <Link href="/store" className="hover:text-brand-strong transition-colors">
            Store
          </Link>
        </nav>

        <div className="hidden items-center gap-4 text-ink lg:flex">
          <button type="button" aria-label="Search" className="hover:text-brand-strong transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          <button type="button" aria-label="Cart" className="hover:text-brand-strong transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </button>
          <button type="button" aria-label="Profile" className="hover:text-brand-strong transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isOpen ? (
        <div id="mobile-menu" className="border-t border-line bg-white pb-6 lg:hidden">
          <div className="site-container grid gap-6 pt-6 sm:grid-cols-2">
            {menuColumns.map((column) => (
              <div key={column.title}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">{column.title}</p>
                <ul className="space-y-2 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="text-ink hover:text-brand-strong"
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
