"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ResultCard from "@/components/ResultCard";
import AnswerBox from "@/components/AnswerBox";
import FAQ from "@/components/FAQ";
import MobileFilters from "@/components/MobileFilters";
import { LoadingSkeleton, NoResultsState, ErrorState } from "@/components/LoadingStates";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipLink } from "@/components/Accessibility";
import { motion } from "framer-motion";
import { staggerChildren, fadeInUp } from "@/lib/motion";

const MOCK = [
  {
    title: "The Grand Heist",
    year: 2023,
    posterUrl: "/mock/grand-heist.jpg",
    whyOneLiner: "Fast, stylish 98-min caper with great reviews.",
    runtimeMinutes: 98,
    ratings: { imdb: 7.9, rtTomatometer: 84 },
    availability: { providers: ["netflix","prime"], urls: { netflix: "#", prime: "#" } },
    trailerUrl: "#"
  },
  {
    title: "Golden Hour",
    year: 2024,
    posterUrl: "/mock/golden-hour.jpg",
    whyOneLiner: "Cozy, feel-good story under 90 minutes.",
    runtimeMinutes: 88,
    ratings: { imdb: 7.4, rtTomatometer: 80 },
    availability: { providers: ["disney-plus"], urls: { "disney-plus": "#" } },
    trailerUrl: "#"
  },
  {
    title: "Midnight Signals",
    year: 2022,
    posterUrl: "/mock/midnight-signals.jpg",
    whyOneLiner: "Moody sci-fi with a tight runtime and twists.",
    runtimeMinutes: 92,
    ratings: { imdb: 7.6 },
    availability: { providers: ["max","hulu"], urls: { max: "#", hulu: "#" } },
    trailerUrl: "#"
  },
];

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export default function HomePage() {
  const [items, setItems] = useState(MOCK);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [currentFilters, setCurrentFilters] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleShowPicks = async (filters: any) => {
    setCurrentFilters(filters);
    setLoadingState('loading');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/recommend', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(filters)
      // });
      // const data = await response.json();
      
      setItems(MOCK.sort(() => Math.random() - 0.5));
      setLoadingState('success');
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setLoadingState('error');
    }
  };

  const handleRetry = () => {
    if (currentFilters) {
      handleShowPicks(currentFilters);
    }
  };

  const handleResetFilters = () => {
    setItems(MOCK);
    setLoadingState('idle');
    setCurrentFilters(null);
  };

  return (
    <main className="pb-16" id="main-content">
      <SkipLink />
      <Navigation />
      
      <ErrorBoundary>
        <Hero onShowPicks={handleShowPicks} />
      </ErrorBoundary>

      {/* Answer Box */}
      <AnswerBox>
        Find the perfect movie or TV show for tonight with our AI-powered recommendations. 
        We consider your streaming subscriptions, available time, mood, and audience to suggest 
        the best content from Netflix, Prime Video, Disney+, Hulu, Max, and Apple TV+.
      </AnswerBox>

      <section className="container">
        {!isOnline ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">You're offline</h3>
            <p className="text-text-muted">Check your connection and try again.</p>
          </div>
        ) : loadingState === 'loading' ? (
          <LoadingSkeleton />
        ) : loadingState === 'error' ? (
          <ErrorState onRetry={handleRetry} />
        ) : items.length === 0 ? (
          <NoResultsState onResetFilters={handleResetFilters} />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerChildren}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((it, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <ResultCard item={it as any} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* FAQ Section */}
      <FAQ />
      
      {/* Mobile Filters */}
      <MobileFilters
        platforms={currentFilters?.platforms || ["netflix","prime","disney-plus"]}
        mood={currentFilters?.moods?.[0] || "feel-good"}
        time={currentFilters?.timeBudget || "~90"}
        audience={currentFilters?.audience || "couple"}
        type={currentFilters?.type || "either"}
        onPlatformsChange={(platforms) => setCurrentFilters((prev: any) => ({ ...prev, platforms }))}
        onMoodChange={(mood) => setCurrentFilters((prev: any) => ({ ...prev, moods: [mood] }))}
        onTimeChange={(time) => setCurrentFilters((prev: any) => ({ ...prev, timeBudget: time }))}
        onAudienceChange={(audience) => setCurrentFilters((prev: any) => ({ ...prev, audience }))}
        onTypeChange={(type) => setCurrentFilters((prev: any) => ({ ...prev, type }))}
        onSubmit={() => currentFilters && handleShowPicks(currentFilters)}
      />
    </main>
  );
}
