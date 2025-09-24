// import { motion } from "framer-motion";
// import { fadeInUp } from "@/lib/motion";

export function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[var(--surface-soft)] border border-[var(--surface-border)] overflow-hidden"
        >
          <div className="aspect-[2/3] bg-[var(--surface-border)] animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-[var(--surface-border)] rounded animate-pulse" />
            <div className="h-3 bg-[var(--surface-border)] rounded animate-pulse w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 bg-[var(--surface-border)] rounded-full animate-pulse w-16" />
              <div className="h-6 bg-[var(--surface-border)] rounded-full animate-pulse w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function NoResultsState({ 
  title = "No recommendations found", 
  description = "Try adjusting your filters or check back later for new content.",
  onResetFilters 
}: {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface-soft)] border border-[var(--surface-border)] flex items-center justify-center">
        <svg className="w-8 h-8 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
      <p className="text-text-muted mb-6 max-w-md mx-auto">{description}</p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="rounded-2xl bg-[var(--gold)] px-6 py-3 text-black font-medium hover:bg-[var(--gold-soft)] transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "We're having trouble loading recommendations. Please try again.",
  onRetry 
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
      <p className="text-text-muted mb-6 max-w-md mx-auto">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-2xl bg-[var(--gold)] px-6 py-3 text-black font-medium hover:bg-[var(--gold-soft)] transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function OfflineState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-text mb-2">You're offline</h3>
      <p className="text-text-muted mb-6 max-w-md mx-auto">
        Check your internet connection and try again when you're back online.
      </p>
    </div>
  );
}

