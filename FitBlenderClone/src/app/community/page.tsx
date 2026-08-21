import Link from "next/link";

const communityPosts = [
  {
    id: 1,
    user: "FitFan_Mia",
    time: "2 hours ago",
    content: "Just finished Week 2 of the Free 2-Week Challenge and I already feel stronger. The progression is really well thought out!",
    likes: 24,
    replies: 8,
  },
  {
    id: 2,
    user: "ActiveDad_Josh",
    time: "5 hours ago",
    content: "Anyone else doing FB30 right now? Day 18 complete — I had to modify a few moves but pushed through. Feeling great!",
    likes: 17,
    replies: 12,
  },
  {
    id: 3,
    user: "YogaMama_Priya",
    time: "Yesterday",
    content: "Nicole's yoga for flexibility video is absolutely wonderful. My hamstrings have never felt this good after years of sitting at a desk.",
    likes: 41,
    replies: 6,
  },
];

const challenges = [
  {
    title: "FB30 — Week 3",
    description: "Jump in anytime. Add the program to your calendar and start moving today!",
    href: "/plans/fb30-30-day-team-program",
    badge: "Active Now",
  },
  {
    title: "Free 2-Week Challenge",
    description: "Strength, Cardio, and Mobility for a Strong Body and Mind.",
    href: "/plans/fitness-blender-s-free-2-week-challenge",
    badge: "Always Free",
  },
];

const spotlights = [
  {
    name: "Sarah M.",
    achievement: "Completed 100 workouts",
    quote: "Fitness Blender changed my relationship with exercise. I used to dread the gym — now I look forward to my workout every day.",
  },
  {
    name: "Carlos R.",
    achievement: "Lost 30 lbs in 6 months",
    quote: "The programs gave me the structure I needed. No gym required — I did it all from my living room with a pair of dumbbells.",
  },
];

export default function CommunityPage() {
  return (
    <div>
      {/* ── Hero ────────────────────────────── */}
      <section className="border-b border-line bg-community py-20 sm:py-28">
        <div className="site-container">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Community
          </h1>
          <p className="max-w-2xl text-base leading-7 text-ink-soft">
            Stay motivated and engaged with a little help from a supportive community of
            members who are all working toward healthier lives.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-md border-2 border-ink px-6 py-2.5 text-sm font-semibold text-ink hover:bg-ink hover:text-white transition-colors"
            >
              Read the Blog
            </Link>
            <Link
              href="/referrals-rewards"
              className="rounded-md bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-ink/80 transition-colors"
            >
              Referral Program
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3-column grid ──────────────────── */}
      <section className="site-container py-12">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Recent Posts */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-ink">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="rounded-xl border border-line bg-white p-4 shadow-card">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">{post.user}</span>
                    <span className="text-xs text-ink-soft">{post.time}</span>
                  </div>
                  <p className="text-sm leading-6 text-ink-soft">{post.content}</p>
                  <div className="mt-3 flex gap-4 text-xs text-ink-soft">
                    <span>❤ {post.likes}</span>
                    <span>💬 {post.replies}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Challenges */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-ink">
              <span className="h-2 w-2 rounded-full bg-green-lime" />
              Active Challenges
            </h2>
            <div className="space-y-4">
              {challenges.map((c) => (
                <div key={c.title} className="rounded-xl border border-line bg-white p-5 shadow-card">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-ink">{c.title}</h3>
                    <span className="shrink-0 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {c.badge}
                    </span>
                  </div>
                  <p className="mb-3 text-xs leading-5 text-ink-soft">{c.description}</p>
                  <Link
                    href={c.href}
                    className="text-xs font-semibold text-brand-strong hover:underline"
                  >
                    Join Challenge →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Member Spotlights */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-ink">
              <span className="h-2 w-2 rounded-full bg-dusk" />
              Member Spotlights
            </h2>
            <div className="space-y-4">
              {spotlights.map((s) => (
                <div key={s.name} className="rounded-xl border border-line bg-white p-5 shadow-card">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-surface-muted text-center text-sm leading-8 font-bold text-ink-soft">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{s.name}</p>
                      <p className="text-[10px] text-brand-strong">{s.achievement}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 italic text-ink-soft">"{s.quote}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Blog CTA ─────────────────────────── */}
      <section className="bg-surface-muted py-12">
        <div className="site-container text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-ink">Read the Blog</h2>
          <p className="mb-6 text-sm text-ink-soft">
            Tips, updates, and behind-the-scenes stories from the Fitness Blender team.
          </p>
          <Link
            href="/blog"
            className="inline-flex rounded-md bg-brand px-7 py-3 text-sm font-semibold text-white hover:bg-brand-strong transition-colors"
          >
            Visit Blog
          </Link>
        </div>
      </section>
    </div>
  );
}
