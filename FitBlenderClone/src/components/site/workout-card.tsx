"use client";

import Image from "next/image";
import Link from "next/link";

import type { Workout } from "@/lib/workouts-data";
import { difficultyColor, difficultyLabel } from "@/lib/workouts-data";

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-lg">
      {/* Thumbnail */}
      <Link href={workout.href} className="workout-card-thumb block" tabIndex={-1} aria-hidden>
        <Image
          src={workout.image}
          alt={workout.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Duration badge */}
        <span className="absolute bottom-3 right-3 rounded-md bg-ink/75 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
          {workout.duration} min
        </span>
        {/* FB Plus badge */}
        {!workout.isFree && (
          <span className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
            FB+
          </span>
        )}
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <svg className="ml-0.5 h-5 w-5 text-ink" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {/* Training type tags */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {workout.trainingType.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded border border-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link href={workout.href}>
          <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-ink hover:text-brand-strong">
            {workout.title}
          </h3>
        </Link>

        {/* Meta row */}
        <div className="mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-ink-soft">
          <span className="font-semibold text-ink">{workout.trainer}</span>
          <span>·</span>
          <span>{workout.bodyFocus}</span>
          <span>·</span>
          <span
            className="font-bold tracking-wide"
            style={{ color: difficultyColor[workout.difficulty] ?? "#888" }}
          >
            {difficultyLabel[workout.difficulty] ?? ""}
          </span>
        </div>

        {/* Equipment */}
        {workout.equipment.length > 0 && (
          <div className="mt-1 text-[11px] text-ink-soft/70">
            {workout.equipment.join(", ")}
          </div>
        )}
      </div>
    </article>
  );
}
