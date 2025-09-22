"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold font-display mb-4">Something went wrong</h1>
          <p className="text-text-muted mb-8 text-lg">
            We encountered an unexpected error. Our team has been notified and is working to fix it.
          </p>
          
          {error.digest && (
            <p className="text-xs text-text-muted mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="rounded-2xl bg-[var(--gold)] px-8 py-4 text-black font-semibold hover:bg-[var(--gold-soft)] transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="rounded-2xl border border-[var(--surface-border)] px-8 py-4 text-text hover:bg-[var(--surface-soft)] transition-colors"
            >
              Go Home
            </Link>
          </div>
          
          <div className="mt-12 p-6 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)]">
            <h2 className="text-lg font-semibold text-[var(--gold)] mb-3">Need Help?</h2>
            <p className="text-sm text-text-muted mb-4">
              If this problem persists, please contact our support team with the error ID above.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <Link href="/blog" className="text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors">
                Read our blog
              </Link>
              <Link href="/what-to-watch/tonight" className="text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors">
                Browse recommendations
              </Link>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

