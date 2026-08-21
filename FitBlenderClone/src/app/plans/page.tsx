"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { programs, difficultyColor, difficultyLabel } from "@/lib/programs-data";

const ACCESS_TABS = ["All", "Free", "FB Plus"] as const;

function ProgramCard({ program }: { program: (typeof programs)[number] }) {
  return (
    <article className="plan-card group">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        <Image
          src={program.image}
          alt={program.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Badges */}
        <div className="absolute left-2 top-2 flex gap-1.5">
          {program.isFree ? (
            <span className="rounded-full bg-green-lime px-2.5 py-0.5 text-[11px] font-bold text-white">
              Free
            </span>
          ) : (
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white">
              FB+
            </span>
          )}
          {program.isChallenge && (
            <span className="rounded-full bg-dusk px-2.5 py-0.5 text-[11px] font-bold text-white">
              Challenge
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-extrabold leading-snug text-ink">
          {program.shortName}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs leading-5 text-ink-soft">{program.subtitle}</p>

        {/* Stats */}
        <dl className="mb-3 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          <dt className="text-ink-soft">Duration</dt>
          <dd className="font-semibold text-ink">
            {program.weeks} {program.weeks === 1 ? "Week" : "Weeks"}
          </dd>
          <dt className="text-ink-soft">Avg Daily</dt>
          <dd className="font-semibold text-ink">{program.minutesAvg} min</dd>
          <dt className="text-ink-soft">Difficulty</dt>
          <dd className="font-semibold" style={{ color: difficultyColor[program.difficulty] }}>
            {difficultyLabel[program.difficulty]}
          </dd>
        </dl>

        {/* Training types */}
        <div className="mb-4 flex flex-wrap gap-1">
          {program.trainingTypes.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-ink">{program.price}</span>
          <Link
            href={program.href}
            className="rounded-md bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-strong transition-colors"
          >
            View Program
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PlansPage() {
  const [accessTab, setAccessTab] = useState<string>("All");

  const filtered = useMemo(() => {
    if (accessTab === "Free") return programs.filter((p) => p.isFree);
    if (accessTab === "FB Plus") return programs.filter((p) => !p.isFree);
    return programs;
  }, [accessTab]);

  return (
    <div>
      {/* ── Hero ────────────────────────────── */}
      <section className="border-b border-line bg-lavender-teal py-20 sm:py-28">
        <div className="site-container">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Workout Programs
          </h1>
          <p className="max-w-2xl text-[1.0625rem] leading-7 text-white/90">
            Programs provide day-by-day guidance with smart progression, training variety,
            and a schedule that keeps you consistent.
          </p>
        </div>
      </section>

      {/* ── Access filter tabs ────────────────────── */}
      <section className="border-b border-line bg-white">
        <div className="site-container flex gap-0">
          {ACCESS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setAccessTab(tab)}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                accessTab === tab
                  ? "border-brand text-brand"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────── */}
      <section className="site-container py-10">
        <p className="mb-6 text-sm text-ink-soft">
          {filtered.length} program{filtered.length !== 1 ? "s" : ""} available
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>
    </div>
  );
}
