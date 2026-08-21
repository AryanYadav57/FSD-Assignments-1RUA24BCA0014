"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  badge?: string;
  href: string;
  color: string; // tailwind bg class for placeholder
};

const products: Product[] = [
  {
    id: 1,
    name: "PowerBlock Elite 50",
    description: "Adjustable dumbbells that replace 16 sets of weights. Perfect for any home gym.",
    price: "$349.00",
    category: "Equipment",
    badge: "FBXPB20 — $20 Off $200+",
    href: "/store/powerblock-elite-50",
    color: "bg-steel-grey/20",
  },
  {
    id: 2,
    name: "FB Plus Membership — Monthly",
    description: "Full access to all programs, custom workout builder, tracking, and more.",
    price: "$9.99/mo",
    category: "Membership",
    href: "/store/fb-plus-monthly",
    color: "bg-teal-aqua/20",
  },
  {
    id: 3,
    name: "FB Plus Membership — Annual",
    description: "Save 58% with an annual FB Plus plan. Best value for committed members.",
    price: "$49.99/yr",
    category: "Membership",
    badge: "Best Value",
    href: "/store/fb-plus-annual",
    color: "bg-brand/15",
  },
  {
    id: 4,
    name: "Program Pass — 7 Days",
    description: "Unlock one FB Plus program for 7 days. Perfect for trying a challenge.",
    price: "$5.99",
    category: "Pass",
    href: "/store/program-pass-7",
    color: "bg-green-lime/20",
  },
  {
    id: 5,
    name: "Program Pass — 15 Days",
    description: "Unlock one FB Plus program for 15 days. Great for 2-week challenges.",
    price: "$11.99",
    category: "Pass",
    href: "/store/program-pass-15",
    color: "bg-lavender-teal/20",
  },
  {
    id: 6,
    name: "Pay It Forward — Gift a Membership",
    description: "Give someone the gift of fitness. Purchase a membership for a friend or family member.",
    price: "From $9.99",
    category: "Gift",
    badge: "Gift",
    href: "/store/pay-it-forward",
    color: "bg-sand/50",
  },
];

const categories = ["All", "Equipment", "Membership", "Pass", "Gift"];

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div>
      {/* ── Hero ─────────────────────────── */}
      <section className="border-b border-line bg-dusk py-20 sm:py-28">
        <div className="site-container">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Store
          </h1>
          <p className="max-w-2xl text-[1.0625rem] leading-7 text-white/90">
            Equipment picks for every space and training level, plus memberships and
            program passes to unlock everything Fitness Blender has to offer.
          </p>
        </div>
      </section>

      {/* ── Category tabs ─────────────────── */}
      <nav className="border-b border-line bg-white">
        <div className="site-container flex gap-0 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeCategory === cat
                  ? "border-brand text-brand"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Product Grid ─────────────────── */}
      <section className="site-container py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <article
              key={product.id}
              className="plan-card group"
            >
              {/* Image placeholder */}
              <div className={`relative aspect-[4/3] ${product.color} flex items-center justify-center overflow-hidden`}>
                <span className="text-4xl">🛒</span>
                {product.badge && (
                  <span className="absolute right-2 top-2 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-1 text-[11px] font-bold uppercase tracking-wide text-brand-strong">
                  {product.category}
                </span>
                <h3 className="mb-2 text-base font-extrabold text-ink">{product.name}</h3>
                <p className="mb-4 text-sm leading-6 text-ink-soft">{product.description}</p>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-ink">{product.price}</span>
                  <Link
                    href={product.href}
                    className="rounded-md bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-brand-strong transition-colors"
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
