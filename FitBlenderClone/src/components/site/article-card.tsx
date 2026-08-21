import Link from "next/link";
import { type Article } from "@/lib/articles-data";

const categoryColors: Record<string, string> = {
  Fitness: "bg-blue-500 text-white",
  Nutrition: "bg-green-500 text-white",
  Health: "bg-teal-500 text-white",
  Recipes: "bg-orange-500 text-white",
  Wellness: "bg-purple-500 text-white",
};

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <article className="group overflow-hidden rounded-xl bg-white shadow-card">
        <div className="grid md:grid-cols-2">
          {/* Large image */}
          <Link href={article.href} className="block overflow-hidden bg-surface-muted">
            <div className="h-full min-h-[280px] w-full transition-transform duration-300 group-hover:scale-105 md:min-h-[360px]">
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[#d9ecf4]" />
              )}
            </div>
          </Link>

          {/* Text content */}
          <div className="flex flex-col justify-center p-6 md:p-10">
            {/* Category */}
            <span
              className={`mb-3 inline-block w-fit rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                categoryColors[article.category] ?? "bg-surface-muted text-ink-soft"
              }`}
            >
              {article.category}
            </span>

            {/* Title */}
            <Link href={article.href}>
              <h2 className="mb-3 text-xl font-bold leading-snug text-ink hover:text-brand-strong sm:text-2xl">
                {article.title}
              </h2>
            </Link>

            {/* Excerpt */}
            <p className="mb-6 text-sm leading-relaxed text-ink-soft line-clamp-3">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="mt-auto flex items-center gap-2 text-xs text-ink-soft">
              <span className="font-semibold text-ink">{article.author}</span>
              <span>·</span>
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readMinutes} min read</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-lg">
      {/* Thumbnail */}
      <Link
        href={article.href}
        className="block overflow-hidden bg-surface-muted"
        style={{ aspectRatio: "16/9" }}
      >
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#d9ecf4]" />
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <span
          className={`mb-2 inline-block w-fit rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            categoryColors[article.category] ?? "bg-surface-muted text-ink-soft"
          }`}
        >
          {article.category}
        </span>

        {/* Title */}
        <Link href={article.href}>
          <h3 className="mb-2 line-clamp-2 text-[0.9375rem] font-bold leading-snug text-ink hover:text-brand-strong">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-auto flex items-center gap-2 text-[11px] text-ink-soft">
          <span className="font-medium text-ink">{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}
