"use client";

import { useState } from "react";
import Link from "next/link";

// ── Pricing comparison ──────────────────────────────
type FeatureRow = { label: string; free: boolean | string; plus: boolean | string };

const features: FeatureRow[] = [
  { label: "Workout Videos (500+)", free: true, plus: true },
  { label: "Search & Filters", free: true, plus: true },
  { label: "Workout Calendar", free: true, plus: true },
  { label: "Community Access", free: true, plus: true },
  { label: "Save Favorite Workouts", free: true, plus: true },
  { label: "Free Programs & Challenges", free: true, plus: true },
  { label: "FB Plus Exclusive Programs", free: false, plus: true },
  { label: "Custom Workout Builder", free: false, plus: true },
  { label: "Workout Tracking & History", free: false, plus: true },
  { label: "Meal Plans", free: false, plus: true },
  { label: "Wellness Videos", free: false, plus: true },
  { label: "Offline Workouts (App)", free: false, plus: true },
  { label: "Priority Support", free: false, plus: true },
  { label: "Ad-Free Experience", free: false, plus: true },
];

function CheckIcon() {
  return (
    <svg className="mx-auto h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg className="mx-auto h-5 w-5 text-line" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── FAQ accordion ───────────────────────────────────
const faqs = [
  {
    q: "What is FB Plus?",
    a: "FB Plus is our premium membership tier that unlocks exclusive programs, the custom workout builder, workout tracking, meal plans, wellness videos, and more. You can subscribe monthly or annually.",
  },
  {
    q: "Can I cancel my FB Plus membership at any time?",
    a: "Yes. You can cancel your FB Plus subscription at any time from your account settings. You'll retain access until the end of your current billing period.",
  },
  {
    q: "Is there a free trial for FB Plus?",
    a: "We offer a free 2-week challenge to help you experience the platform. Individual program passes are also available starting at $5.99 so you can try a specific program before committing to a full membership.",
  },
  {
    q: "What equipment do I need?",
    a: "Many of our workouts require no equipment at all. Others use dumbbells or a mat. You can filter all workout videos and programs by equipment needed.",
  },
  {
    q: "Do you offer group or B2B pricing?",
    a: "Yes! We offer group and corporate pricing for teams, studios, and organisations. Contact us via the B2B options page to learn more.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-ink hover:text-brand-strong"
      >
        {q}
        <span className="ml-4 text-xl leading-none text-ink-soft">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-7 text-ink-soft">{a}</p>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────
export default function MembershipPage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────── */}
      <section className="bg-teal-aqua py-16">
        <div className="site-container text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Unlock Everything with FB Plus
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/85">
            Join thousands of members getting fitter and healthier with expert-designed
            workout programs, personalised tools, and a supportive community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/fb-plus"
              className="rounded-md bg-white px-8 py-3 text-sm font-bold text-teal-aqua shadow hover:shadow-md transition-shadow"
            >
              Join FB Plus
            </Link>
            <Link
              href="/membership"
              className="rounded-md border-2 border-white px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              View Free Options
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ────────────────── */}
      <section className="site-container py-14">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-ink">Choose Your Plan</h2>
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-soft">Free</p>
            <p className="mb-6 text-4xl font-extrabold text-ink">$0</p>
            <p className="mb-8 text-sm text-ink-soft">
              Get started for free — no credit card required.
            </p>
            <Link
              href="/membership"
              className="block w-full rounded-md border-2 border-brand py-3 text-center text-sm font-semibold text-brand hover:bg-brand hover:text-white transition-colors"
            >
              Create Free Account
            </Link>
          </div>
          {/* FB Plus */}
          <div className="rounded-2xl bg-teal-aqua p-8 shadow-lg ring-2 ring-brand">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-white/80">FB Plus</p>
            <div className="mb-2 flex items-end gap-2">
              <span className="text-4xl font-extrabold text-white">$9.99</span>
              <span className="mb-1 text-sm text-white/80">/month</span>
            </div>
            <p className="mb-2 text-xs text-white/70">or $49.99/year — save 58%</p>
            <p className="mb-8 text-sm text-white/85">
              Full access to all programs, tools, and exclusive content.
            </p>
            <Link
              href="/fb-plus"
              className="block w-full rounded-md bg-white py-3 text-center text-sm font-bold text-teal-aqua hover:bg-white/90 transition-colors"
            >
              Start FB Plus
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature comparison table ──────── */}
      <section className="bg-surface-muted py-14">
        <div className="site-container">
          <h2 className="mb-8 text-center text-3xl font-extrabold text-ink">What's Included</h2>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-4 pl-6 text-left text-xs font-bold uppercase tracking-wide text-ink-soft">
                    Feature
                  </th>
                  <th className="py-4 text-center text-xs font-bold uppercase tracking-wide text-ink-soft">
                    Free
                  </th>
                  <th className="py-4 pr-6 text-center text-xs font-bold uppercase tracking-wide text-brand">
                    FB Plus
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-surface-muted/40"}>
                    <td className="py-3 pl-6 font-medium text-ink">{row.label}</td>
                    <td className="py-3 text-center">
                      {row.free === true ? <CheckIcon /> : row.free === false ? <XIcon /> : row.free}
                    </td>
                    <td className="py-3 pr-6 text-center">
                      {row.plus === true ? <CheckIcon /> : row.plus === false ? <XIcon /> : row.plus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────── */}
      <section className="site-container py-14">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-ink">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-white px-6 shadow-card">
          {faqs.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────── */}
      <section className="bg-teal-aqua py-14">
        <div className="site-container text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white">Ready to get started?</h2>
          <p className="mb-8 text-base text-white/85">
            Join thousands of members achieving their fitness goals every day.
          </p>
          <Link
            href="/fb-plus"
            className="inline-flex rounded-md bg-white px-8 py-3 text-sm font-bold text-teal-aqua shadow hover:shadow-md transition-shadow"
          >
            Join FB Plus Today
          </Link>
        </div>
      </section>
    </div>
  );
}
