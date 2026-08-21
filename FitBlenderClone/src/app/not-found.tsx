import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-container py-24 text-center">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-ink">Page Not Found</h1>
      <p className="mb-8 text-ink-soft">The page you are looking for is not available in this build yet.</p>
      <Link href="/" className="inline-flex rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white">
        Return Home
      </Link>
    </div>
  );
}
