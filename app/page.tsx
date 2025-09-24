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
import ContentDiscovery from "@/components/ContentDiscovery";
import { generateWebSiteLD, generateSoftwareApplicationLD, generateFAQPageLD } from "@/lib/structured-data";

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
  const [items, setItems] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [announcement, setAnnouncement] = useState('');
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());
  const [backlinks, setBacklinks] = useState<any[]>([]);

  // Load featured movies on component mount
  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const response = await fetch('/api/movies/featured?limit=3');
        if (response.ok) {
          const data = await response.json();
          setItems(data.movies || []);
        } else {
          // Fallback to mock data if API fails
          setItems(MOCK);
        }
      } catch (error) {
        console.error('Error loading featured movies:', error);
        // Fallback to mock data
        setItems(MOCK);
      }
    };
    loadFeaturedMovies();
  }, []);

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
      setItems(data.primary || MOCK); // Fallback to MOCK if API returns empty
      setLoadingState('success');
      setAnnouncement("Recommendations loaded.");
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      // Fallback to mock data if API fails
      setItems(MOCK);
      setLoadingState('success');
      setAnnouncement("Using sample recommendations.");
    }
  };

  const handleRetry = () => {
    handleShowPicks({}); // Retry with default filters
  };

  const handleResetFilters = () => {
    handleShowPicks({}); // Reset filters and fetch again
  };

  const handlePlayNow = (id: string) => {
    setAnnouncement(`Playing item ${id}.`);
    // Logic to play the item
  };

  const handleTrailer = (id: string) => {
    setAnnouncement(`Showing trailer for item ${id}.`);
    // Logic to show trailer
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

  // Generate structured data for SEO
  const websiteLD = generateWebSiteLD();
  const softwareLD = generateSoftwareApplicationLD();
  const faqLD = generateFAQPageLD([
    {
      question: "How do you choose my perfect picks?",
      answer: "We use advanced AI to analyze your streaming services, mood, available time, and audience to find the perfect match. Our algorithm considers ratings, runtime, genre preferences, and current availability across all major platforms."
    },
    {
      question: "Is this available in my country?",
      answer: "We currently show availability for US and Canada. We're working on expanding to more regions soon. The recommendations are still valuable for discovering great content you can find on your local platforms."
    },
    {
      question: "Why only 3 picks?",
      answer: "We believe in quality over quantity. Three carefully curated picks save you time and decision fatigue. Each recommendation is tailored to your specific preferences and situation."
    },
    {
      question: "How often do you update the recommendations?",
      answer: "Our database is updated daily with the latest releases and availability changes. Every time you use our service, you get the most current recommendations based on what's available right now."
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0A1220] text-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteLD)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareLD)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLD)
        }}
      />
      
      <SkipLink />
      <Navigation />
      
      <main className="relative">
        {/* Hero Section with Clear User Journey */}
        <header className="relative overflow-hidden" role="banner">
          {/* Subtle grain and spotlight gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1220] via-[#0F1B2E] to-[#0A1220]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E0B15C]/5 via-transparent to-transparent"></div>
          
          <div className="relative container mx-auto px-4 py-16">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6" style={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 700 }}>
                What to Watch
                <span className="block text-[#E0B15C]">Tonight</span>
              </h1>
              
              {/* Clear Value Proposition */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
                <p className="text-2xl text-white font-semibold mb-4">
                  Stop endless scrolling. Get 3 perfect picks in under 60 seconds.
                </p>
                <p className="text-lg text-gray-300 mb-6">
                  Tell us your mood, time, and streaming services. We'll find your perfect watch.
                </p>
                
                {/* Simple 3-Step Process */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#E0B15C] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#0A1220] font-bold text-lg">1</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Choose Your Filters</h3>
                    <p className="text-gray-400 text-sm">Select streaming services, mood, and time</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#E0B15C] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#0A1220] font-bold text-lg">2</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Get 3 Perfect Picks</h3>
                    <p className="text-gray-400 text-sm">AI finds movies that match your preferences</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#E0B15C] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#0A1220] font-bold text-lg">3</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Start Watching</h3>
                    <p className="text-gray-400 text-sm">Click "Play now" and enjoy your movie</p>
                  </div>
                </div>
              </div>
              
              <ErrorBoundary>
                <Hero onShowPicks={handleShowPicks} />
              </ErrorBoundary>
            </div>
          </div>
        </header>

        {/* Results Section */}
        <section id="results" className="container mx-auto px-4 py-12" aria-label="Movie Recommendations">
          <div className="max-w-6xl mx-auto">
            {loadingState === 'idle' && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E0B15C]/10 rounded-full mb-6" aria-hidden="true">
                  <svg className="w-8 h-8 text-[#E0B15C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                  Your Perfect Movies Are Waiting
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                  Click "Show Me Picks" above to get 3 personalized movie recommendations. 
                  Each pick is carefully selected based on your preferences and available on your streaming services.
                </p>
                
                {/* Call to Action */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 max-w-md mx-auto">
                  <p className="text-white font-semibold mb-4">Ready to find your perfect watch?</p>
                  <button
                    onClick={() => handleShowPicks({})}
                    className="inline-flex items-center px-8 py-4 bg-[#E0B15C] hover:bg-[#F2C879] text-[#0A1220] font-semibold text-lg rounded-xl shadow-lg transition-all duration-200"
                  >
                    Show Me Picks Now
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {loadingState === 'loading' ? (
              <LoadingSkeleton />
            ) : loadingState === 'error' ? (
              <ErrorState onRetry={handleRetry} />
            ) : visibleItems.length === 0 ? (
              <NoResultsState onResetFilters={handleResetFilters} />
                    ) : (
                      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Recommended Movies">
                        {visibleItems.map((item, index) => (
                          <article key={index} className="transform transition-all duration-300 hover:scale-105" role="listitem">
                            <ResultCard item={item as any} />
                          </article>
                        ))}
                      </div>
                    )}
          </div>
        </section>

        {/* Answer Box Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <AnswerBox>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                  Why Choose Our Recommendations?
                </h2>
                <p className="text-gray-300 text-lg">
                  We combine advanced AI with comprehensive streaming data to deliver personalized recommendations that actually match your taste. Stop endless scrolling and start watching what you'll love.
                </p>
              </div>
            </AnswerBox>
          </div>
        </section>

        {/* Content Discovery Section */}
        <section className="py-16">
          <ContentDiscovery />
        </section>

        {/* Latest Articles Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <LatestArticles />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-[#0F1B2E]/50 py-16">
          <div className="container mx-auto px-4">
            <FAQ />
          </div>
        </section>

        {/* Backlinks Section */}
        {backlinks.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <Backlinks backlinks={backlinks} title="Explore More" />
            </div>
          </section>
        )}
      </main>
      
      <MobileFilters onShowPicks={handleShowPicks} />
    </div>
  );
}