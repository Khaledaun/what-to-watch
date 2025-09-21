import Link from "next/link";
import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Page Not Found | What to Watch Tonight",
  description: "The page you're looking for doesn't exist. Find great movie and TV recommendations instead.",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <motion.main
        initial="hidden"
        animate="show"
        variants={fadeInUp}
        className="container py-20 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-8xl font-bold text-[var(--gold)] mb-4">404</div>
          <h1 className="text-3xl font-bold font-display mb-4">Page Not Found</h1>
          <p className="text-text-muted mb-8 text-lg">
            The page you're looking for doesn't exist. But don't worry - we have plenty of great 
            movie and TV recommendations waiting for you!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="rounded-2xl bg-[var(--gold)] px-8 py-4 text-black font-semibold hover:bg-[var(--gold-soft)] transition-colors"
            >
              Find What to Watch
            </Link>
            <Link
              href="/what-to-watch/tonight"
              className="rounded-2xl border border-[var(--surface-border)] px-8 py-4 text-text hover:bg-[var(--surface-soft)] transition-colors"
            >
              Tonight's Picks
            </Link>
            <Link
              href="/blog"
              className="rounded-2xl border border-[var(--surface-border)] px-8 py-4 text-text hover:bg-[var(--surface-soft)] transition-colors"
            >
              Read Articles
            </Link>
          </div>
          
          <div className="mt-12 p-6 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)]">
            <h2 className="text-lg font-semibold text-[var(--gold)] mb-3">Popular Pages</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <Link href="/what-to-watch/on-netflix" className="text-text hover:text-[var(--gold)] transition-colors">
                Netflix Picks
              </Link>
              <Link href="/what-to-watch/on-prime" className="text-text hover:text-[var(--gold)] transition-colors">
                Prime Video
              </Link>
              <Link href="/what-to-watch/under-90-minutes" className="text-text hover:text-[var(--gold)] transition-colors">
                Under 90 Min
              </Link>
              <Link href="/what-to-watch/family-night" className="text-text hover:text-[var(--gold)] transition-colors">
                Family Night
              </Link>
              <Link href="/what-to-watch/by-mood/feel-good" className="text-text hover:text-[var(--gold)] transition-colors">
                Feel Good
              </Link>
              <Link href="/blog" className="text-text hover:text-[var(--gold)] transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
