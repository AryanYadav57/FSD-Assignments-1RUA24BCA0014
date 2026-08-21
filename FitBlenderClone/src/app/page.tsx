import Link from "next/link";
import Image from "next/image";

import { PlanCardGroup } from "@/components/site/plan-card-group";
import { highlightedPrograms } from "@/lib/site-data";
import { WorkoutCard } from "@/components/site/workout-card";
import { workouts } from "@/lib/workouts-data";
import { ArticleCard } from "@/components/site/article-card";
import { articles } from "@/lib/articles-data";

// ─── Trainer headshots for hero ─────────────────────────────────────────────
const trainerAvatars = [
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200", alt: "Trainer 1" },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200", alt: "Trainer 2" },
  { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200", alt: "Trainer 3" },
  { src: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&q=80&w=200&h=200", alt: "Trainer 4" },
  { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200&h=200", alt: "Trainer 5" },
  { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200", alt: "Trainer 6" },
  { src: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200&h=200", alt: "Trainer 7" },
  { src: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&q=80&w=200&h=200", alt: "Trainer 8" },
];

// ─── Feature panels data ─────────────────────────────────────────────────────
type UnitBlock = {
  bg: string;
  textDark?: boolean;
  title: string;
  body: string;
  cta: { label: string; href: string };
  img: { src: string; alt: string };
};

const featureUnits: UnitBlock[] = [
  {
    bg: "#e8ddd0",
    textDark: true,
    title: "Trainer Series",
    body: "Exercise with your favorite trainer in our new Trainer Series programs.",
    cta: { label: "View Series", href: "/plans" },
    img: {
      src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=700",
      alt: "Trainer doing yoga pose",
    },
  },
  {
    bg: "#5b5fca",
    title: "Earn a Free Plus\nMembership",
    body: "Share your referral code and every sign up earns rewards to put toward your membership.",
    cta: { label: "Learn About Rewards", href: "/referrals-rewards" },
    img: {
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=700",
      alt: "Hand holding a phone with QR code",
    },
  },
  {
    bg: "#b0b5ba",
    textDark: true,
    title: "Small Footprint\nBig Gains",
    body: "Equipment picks for every space and every training level.",
    cta: { label: "Shop Equipment", href: "/store" },
    img: {
      src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=700",
      alt: "Powerblock adjustable dumbbells",
    },
  },
  {
    bg: "#7cba3c",
    title: "Specialty Content",
    body: "Pilot programs provide special content tailored to smaller audiences, conditions, or life events.",
    cta: { label: "Browse Pilot Programs", href: "/pilot-programs" },
    img: {
      src: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=700",
      alt: "Person jumping fitness workout",
    },
  },
  {
    bg: "#5c6f7c",
    title: "Workout Videos",
    body: "Exercise with certified personal trainers whether you're at home or on the road.",
    cta: { label: "Find a Workout", href: "/videos" },
    img: {
      src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=700",
      alt: "Tasha doing a workout",
    },
  },
  {
    bg: "#c8dce8",
    textDark: true,
    title: "Supportive\nCommunity",
    body: "Stay motivated and engaged with a little help from a supportive community of other members.",
    cta: { label: "Visit Community", href: "/community" },
    img: {
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=700",
      alt: "Group of friends outdoors",
    },
  },
];

function UnitBlockPanel({ unit }: { unit: UnitBlock }) {
  const textColor = unit.textDark ? "#1f2937" : "#ffffff";
  const btnBg = unit.textDark ? "#1f2937" : "#ffffff";
  const btnText = unit.textDark ? "#ffffff" : "#1f2937";

  return (
    <div style={{ background: unit.bg, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 500 }}>
      {/* Text at top */}
      <div style={{ padding: "3rem 2.5rem 1.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2, color: textColor, whiteSpace: "pre-line", margin: 0 }}>
          {unit.title}
        </h2>
        <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: textColor, opacity: 0.9, maxWidth: 280, margin: 0 }}>
          {unit.body}
        </p>
        <Link
          href={unit.cta.href}
          style={{
            display: "inline-block",
            background: btnBg,
            color: btnText,
            borderRadius: 9999,
            padding: "0.6rem 1.6rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {unit.cta.label}
        </Link>
      </div>
      {/* Image fills remaining space */}
      <div style={{ flex: 1, position: "relative", minHeight: 260 }}>
        <Image
          src={unit.img.src}
          alt={unit.img.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
    </div>
  );
}

// Circular avatar for hero
function Avatar({ src, alt, size, top, left }: { src: string; alt: string; size: number; top: number; left: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.85)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        flexShrink: 0,
      }}
    >
      <Image src={src} alt={alt} width={size} height={size} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #4fc3d9 0%, #2aafaf 40%, #1eb87e 100%)",
          minHeight: 460,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "min(1200px, 100% - 2rem)",
            marginInline: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            padding: "3.5rem 0",
            flexWrap: "wrap",
          }}
        >
          {/* Left text */}
          <div style={{ flex: "0 0 auto", maxWidth: 370 }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, color: "#fff", marginBottom: "1.25rem" }}>
              Feel Great.<br />Body and Mind.
            </h1>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "#fff", marginBottom: "1.75rem", opacity: 0.92 }}>
              Choose from hundreds of workouts, healthy recipes, relaxing
              meditations, and expert articles, for a whole body and mind
              approach to feeling great.
            </p>
            <Link
              href="/membership"
              style={{
                display: "inline-block",
                background: "#fff",
                color: "#1f2937",
                borderRadius: 6,
                padding: "0.65rem 1.75rem",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Join Now
            </Link>
          </div>

          {/* Right: scattered circular trainer portraits */}
          <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: 420, height: 340 }}>
              <Avatar src={trainerAvatars[0].src} alt={trainerAvatars[0].alt} size={100} top={10}  left={130} />
              <Avatar src={trainerAvatars[1].src} alt={trainerAvatars[1].alt} size={115} top={5}   left={265} />
              <Avatar src={trainerAvatars[2].src} alt={trainerAvatars[2].alt} size={78}  top={115} left={40}  />
              <Avatar src={trainerAvatars[3].src} alt={trainerAvatars[3].alt} size={130} top={100} left={148} />
              <Avatar src={trainerAvatars[4].src} alt={trainerAvatars[4].alt} size={100} top={110} left={315} />
              <Avatar src={trainerAvatars[5].src} alt={trainerAvatars[5].alt} size={105} top={218} left={55}  />
              <Avatar src={trainerAvatars[6].src} alt={trainerAvatars[6].alt} size={78}  top={228} left={210} />
              <Avatar src={trainerAvatars[7].src} alt={trainerAvatars[7].alt} size={110} top={215} left={295} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature panels (2-col grid) ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        {featureUnits.map((unit) => (
          <UnitBlockPanel key={unit.title} unit={unit} />
        ))}
      </div>

      {/* ── "Not sure where to start?" plan cards ──────────────────────── */}
      <section style={{ background: "#f6f8fa", padding: "3.5rem 0" }}>
        <div style={{ width: "min(1200px, 100% - 2rem)", marginInline: "auto" }}>
          <header style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 300, color: "#1f2937" }}>
              Not sure where to start?
            </h2>
            <p style={{ marginTop: "0.75rem", fontSize: "0.9375rem", color: "#4b5563" }}>
              Programs offer day-to-day guidance on an interactive calendar to keep you on track.
            </p>
          </header>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlightedPrograms.map((program) => (
              <PlanCardGroup key={program.title} program={program} />
            ))}
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/plans" style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#1e9fd1", textDecoration: "none" }}>
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newest Workout Videos ──────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "3.5rem 0" }}>
        <div style={{ width: "min(1200px, 100% - 2rem)", marginInline: "auto" }}>
          <header style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937" }}>Newest Workout Videos</h2>
            <Link href="/videos" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1f2937", textDecoration: "none" }}>
              View All Videos →
            </Link>
          </header>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workouts.slice(0, 4).map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Articles ──────────────────────────────────────────── */}
      <section style={{ background: "#edf2f7", padding: "3.5rem 0" }}>
        <div style={{ width: "min(1200px, 100% - 2rem)", marginInline: "auto" }}>
          <header style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937" }}>Healthy Living Articles</h2>
            <Link href="/healthy-living" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1f2937", textDecoration: "none" }}>
              View All Articles →
            </Link>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
