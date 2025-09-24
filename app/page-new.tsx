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
import LatestArticles from "@/components/LatestArticles";
import Backlinks from "@/components/Backlinks";
import Image from "next/image";
import Link from "next/link";

const MOCK = [
  {
    id: "1",
    title: "Oppenheimer",
    year: 2023,
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    whyOneLiner: "Christopher Nolan's epic biopic about the father of the atomic bomb.",
    runtimeMinutes: 180,
    ratings: { imdb: 8.5, rtTomatometer: 93 },
    availability: { providers: ["netflix","prime"], urls: { netflix: "#", prime: "#" } },
    trailerUrl: "#"
  },
  {
    id: "2",
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    whyOneLiner: "Miles Morales returns in this stunning animated sequel.",
    runtimeMinutes: 140,
    ratings: { imdb: 8.6, rtTomatometer: 95 },
    availability: { providers: ["netflix"], urls: { netflix: "#" } },
    trailerUrl: "#"
  },
  {
    id: "3",
    title: "The Bear",
    year: 2022,
    posterUrl: "https://image.tmdb.org/t/p/w500/y8V0Xq2ni6j4uzku60Lo7UpF5zK.jpg",
    whyOneLiner: "Intense kitchen drama that's both stressful and heartwarming.",
    runtimeMinutes: 30,
    ratings: { imdb: 8.6, rtTomatometer: 100 },
    availability: { providers: ["hulu"], urls: { hulu: "#" } },
    trailerUrl: "#"
  },
];

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export default function HomePage() {
  const [items, setItems] = useState<any[]>(MOCK);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [announcement, setAnnouncement] = useState('');
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());
  const [backlinks, setBacklinks] = useState<any[]>([]);

  const handleShowPicks = async (filters: any) => {
    setLoadingState('loading');
    setItems([]);
    setHiddenItems(new Set());
    setAnnouncement("Loading recommendations...");

    try {
      const query = new URLSearchParams();
      if (filters.platforms) query.append('platforms', filters.platforms.join(','));
      if (filters.moods) query.append('moods', filters.moods.join(','));
      if (filters.timeBudget) query.append('timeBudget', filters.timeBudget);
      if (filters.audience) query.append('audience', filters.audience);
      if (filters.type) query.append('type', filters.type);
      if (filters.surpriseMe) query.append('surpriseMe', 'true');

      const response = await fetch(`/api/recommend?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data.primary || MOCK);
      setLoadingState('success');
      setAnnouncement("Recommendations loaded.");
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setItems(MOCK);
      setLoadingState('success');
      setAnnouncement("Using sample recommendations.");
    }
  };

  const handleRetry = () => {
    handleShowPicks({});
  };

  const handleResetFilters = () => {
    handleShowPicks({});
  };

  const handlePlayNow = (id: string) => {
    setAnnouncement(`Playing item ${id}.`);
  };

  const handleTrailer = (id: string) => {
    setAnnouncement(`Showing trailer for item ${id}.`);
  };

  const handleHide = (id: string) => {
    setHiddenItems(prev => new Set(prev).add(id));
    setAnnouncement(`Item ${id} hidden.`);
  };

  const visibleItems = items.filter(item => !hiddenItems.has(item.id));

  // Load backlinks on component mount
  useEffect(() => {
    const loadBacklinks = async () => {
      try {
        const response = await fetch('/api/seo/backlinks?pageType=home');
        if (response.ok) {
          const data = await response.json();
          setBacklinks(data.backlinks || []);
        }
      } catch (error) {
        console.error('Error loading backlinks:', error);
      }
    };
    loadBacklinks();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SkipLink />
      <Navigation />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                Find Your Next
                <span className="block text-blue-600">Perfect Watch</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                Stop endless scrolling. Get personalized movie and TV recommendations 
                based on your streaming platforms, mood, and available time.
              </p>
              
              <ErrorBoundary>
                <Hero onShowPicks={handleShowPicks} />
              </ErrorBoundary>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loadingState === 'idle' && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Discover?</h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Use the filters above to find your perfect watch. Our AI analyzes thousands 
                  of movies and shows to match your preferences.
                </p>
              </div>
            )}

            {loadingState === 'loading' ? (
              <LoadingSkeleton />
            ) : loadingState === 'error' ? (
              <ErrorState onRetry={handleRetry} />
            ) : visibleItems.length === 0 ? (
              <NoResultsState onResetFilters={handleResetFilters} />
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map((item, index) => (
                  <div key={index} className="group">
                    <ResultCard item={item as any} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Recommendations?</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We combine advanced AI with comprehensive streaming data to deliver 
                personalized recommendations that actually match your taste.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Powered Matching</h3>
                <p className="text-slate-600">
                  Our advanced algorithms consider your streaming subscriptions, 
                  available time, mood, and audience to suggest the perfect content.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Save Time</h3>
                <p className="text-slate-600">
                  Stop endless scrolling through streaming catalogs. Get 3 perfect 
                  picks you can start watching in under 60 seconds.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Trusted Sources</h3>
                <p className="text-slate-600">
                  We analyze data from Netflix, Prime Video, Disney+, Hulu, Max, 
                  and Apple TV+ to give you the best available options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LatestArticles />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQ />
          </div>
        </section>

        {/* Backlinks Section */}
        {backlinks.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Backlinks backlinks={backlinks} title="Explore More" />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Perfect Watch?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have discovered their new favorite movies and shows.
            </p>
            <button
              onClick={() => handleShowPicks({})}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
            >
              Get Started Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>
      </main>
      
      <MobileFilters onShowPicks={handleShowPicks} />
    </div>
  );
}

