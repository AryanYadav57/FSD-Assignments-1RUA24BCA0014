"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { articles, articleCategories } from "@/lib/articles-data";
import { ArticleCard } from "@/components/site/article-card";

export default function HealthyLivingPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      {/* ── Hero ─────────────────────────────── */}
      <section className="border-b border-line bg-green-lime py-20 sm:py-28">
        <div className="site-container">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Healthy Living
          </h1>
          <p className="max-w-2xl text-[1.0625rem] leading-7 text-white/90">
            Science-backed articles, healthy recipes, and wellness guides from certified
            trainers and health experts — because fitness is a whole-life practice.
          </p>
        </div>
      </section>

      {/* ── Category tabs ────────────────────── */}
      <nav className="border-b border-line bg-white">
        <div className="site-container flex gap-1 overflow-x-auto">
          {articleCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-4 text-sm font-semibold transition-colors border-b-[3px] ${
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

      {/* ── Content ──────────────────────────── */}
      <section className="site-container py-12">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-ink-soft">No articles in this category yet.</p>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <div className="mb-10">
                <ArticleCard article={featured} featured />
              </div>
            )}
            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
