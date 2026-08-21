import Image from "next/image";
import Link from "next/link";

import type { ProgramCard } from "@/lib/site-data";

const CDN = "https://cloudfront.fitnessblender.com/assets/img/plan";

// Difficulty dot colours (1-5 scale)
const difficultyLabel = ["", "Beginner", "Beginner+", "Intermediate", "Intermediate+", "Advanced"];
const difficultyColor = ["", "#7bc67e", "#a8c97a", "#f4c842", "#f4984e", "#e85d5d"];

export function PlanCardGroup({ program }: { program: ProgramCard }) {
  return (
    <div className="flex flex-col h-full">
      {/* Top Label (above image) */}
      {program.topLabel && (
        <h3 className="mb-2 text-sm font-bold text-ink leading-tight">
          {program.topLabel}
        </h3>
      )}
      <div className="plan-card group flex-1 bg-white relative flex flex-col border border-line/50">
        {/* Thumbnail */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
            {program.image ? (
              <Image
                src={program.image.startsWith("http") ? program.image : `${CDN}/${program.image}`}
                alt={program.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand/20 to-teal-aqua/30" />
            )}
          </div>
          {/* Free badge */}
          {program.isFree && (
            <span className="absolute -bottom-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full border-2 border-white bg-green-lime px-3 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wide text-white shadow-sm">
              Free
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4 pt-6">
          <h4 className="mb-1 text-[0.9375rem] font-semibold leading-snug text-ink">
            {program.title}
          </h4>
          <p className="mb-3 text-[0.8125rem] leading-5 text-ink-soft">
            {program.subtitle}
          </p>

          {/* Meta row */}
          <div className="mt-auto mb-4 text-xs font-semibold text-brand">
            {program.duration}
          </div>

          <hr className="border-t border-line mb-4" />

          {/* Price */}
          <div className="mb-4 flex items-center justify-between text-[0.8125rem]">
            <span className="text-ink-soft">{program.price}</span>
            {program.originalPrice ? (
              <div className="flex flex-col items-end leading-tight">
                <span className="text-ink-soft line-through font-medium text-[0.65rem]">{program.originalPrice}</span>
                <span className="font-bold text-[#e85d5d]">{program.salePrice}</span>
              </div>
            ) : program.salePrice ? (
              <span className="font-bold text-ink">{program.salePrice}</span>
            ) : null}
          </div>

          {/* Add to bag button (if not free) */}
          {!program.isFree && (
            <button className="flex w-full items-center justify-center gap-2 rounded bg-[#4994c6] py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-strong">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add To Bag
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
