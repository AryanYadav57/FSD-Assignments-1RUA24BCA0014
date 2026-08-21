"use client";

import { useState, useMemo } from "react";

import { FilterBar } from "@/components/site/filter-bar";
import { WorkoutCard } from "@/components/site/workout-card";
import { workouts } from "@/lib/workouts-data";

const filterGroups = [
  {
    label: "Difficulty",
    options: ["Beginner", "Beginner+", "Intermediate", "Intermediate+", "Advanced"],
  },
  {
    label: "Duration",
    options: ["Under 20 min", "20–30 min", "30–45 min", "45+ min"],
  },
  {
    label: "Training Type",
    options: ["Strength Training", "HIIT", "Cardiovascular", "Pilates", "Yoga", "Low Impact", "Stretching/Flexibility", "Mobility"],
  },
  {
    label: "Body Focus",
    options: ["Total Body", "Upper Body", "Lower Body", "Core"],
  },
  {
    label: "Equipment",
    options: ["No Equipment", "Dumbbells", "Mat"],
  },
  {
    label: "Access",
    options: ["Free", "FB Plus"],
  },
];

const difficultyMap: Record<string, number[]> = {
  "Beginner": [1],
  "Beginner+": [2],
  "Intermediate": [3],
  "Intermediate+": [4],
  "Advanced": [5],
};

export default function VideosPage() {
  const [active, setActive] = useState<Record<string, string>>({});

  function handleChange(group: string, value: string) {
    setActive((prev) => ({ ...prev, [group]: value }));
  }

  const filtered = useMemo(() => {
    return workouts.filter((w) => {
      if (active["Difficulty"]) {
        const levels = difficultyMap[active["Difficulty"]] ?? [];
        if (!levels.includes(w.difficulty)) return false;
      }
      if (active["Duration"]) {
        const d = active["Duration"];
        if (d === "Under 20 min" && w.duration >= 20) return false;
        if (d === "20–30 min" && (w.duration < 20 || w.duration > 30)) return false;
        if (d === "30–45 min" && (w.duration < 30 || w.duration > 45)) return false;
        if (d === "45+ min" && w.duration < 45) return false;
      }
      if (active["Training Type"]) {
        if (!w.trainingType.includes(active["Training Type"])) return false;
      }
      if (active["Body Focus"]) {
        if (w.bodyFocus !== active["Body Focus"]) return false;
      }
      if (active["Equipment"]) {
        if (!w.equipment.includes(active["Equipment"])) return false;
      }
      if (active["Access"]) {
        if (active["Access"] === "Free" && !w.isFree) return false;
        if (active["Access"] === "FB Plus" && w.isFree) return false;
      }
      return true;
    });
  }, [active]);

  const hasFilters = Object.values(active).some(Boolean);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="border-b border-line bg-steel-grey py-20 sm:py-28">
        <div className="site-container">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Workout Videos
          </h1>
          <p className="max-w-2xl text-[1.0625rem] leading-7 text-white/90">
            Exercise with certified personal trainers whether you're at home or on the road.
            Browse by body focus, duration, training type, and more.
          </p>
        </div>
      </section>

      {/* ── Filters ─────────────────────────────── */}
      <section className="border-b border-line bg-white px-4 py-6">
        <div className="site-container">
          <FilterBar groups={filterGroups} active={active} onChange={handleChange} />
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────── */}
      <section className="site-container py-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-ink-soft">
            {filtered.length} workout{filtered.length !== 1 ? "s" : ""} found
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setActive({})}
              className="text-xs font-semibold text-brand-strong hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-12 text-center">
            <p className="text-lg font-semibold text-ink">No workouts match your filters.</p>
            <button
              type="button"
              onClick={() => setActive({})}
              className="mt-4 text-sm font-semibold text-brand-strong hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
