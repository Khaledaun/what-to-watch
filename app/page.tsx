"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { ActionBar } from "@/components/ActionBar";
import { TrendingGrid } from "@/components/TrendingGrid";
import { ShareStrip } from "@/components/ShareStrip";
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
  const [selectedService, setSelectedService] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

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
        {/* Action Bar - Top of Home */}
        <ActionBar 
          onGetPicks={() => handleShowPicks({ 
            service: selectedService, 
            mood: selectedMood, 
            time: selectedTime 
          })}
          onSurpriseMe={() => handleShowPicks({ surpriseMe: true })}
          isLoading={loadingState === 'loading'}
        />
        
        {/* Trending Grid - Always Visible */}
        <TrendingGrid limit={10} />

        {/* Results Section */}
        {loadingState !== 'idle' && (
          <section id="results" className="py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-6 md:space-y-8">
                {loadingState === 'loading' ? (
                  <LoadingSkeleton />
                ) : loadingState === 'error' ? (
                  <ErrorState onRetry={handleRetry} />
                ) : visibleItems.length === 0 ? (
                  <NoResultsState onResetFilters={handleResetFilters} />
                ) : (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Your Perfect Picks
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        Handpicked just for you based on your preferences
                      </p>
                    </div>
                    
                    <div className="grid gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Recommended Movies">
                      {visibleItems.map((item, index) => (
                        <article key={index} className="transform transition-all duration-300 hover:scale-[1.02]" role="listitem">
                          <ResultCard item={item as any} />
                        </article>
                      ))}
                    </div>
                    
                    {/* Share Strip */}
                    <div className="border-t my-8 md:my-10 pt-8">
                      <ShareStrip 
                        url={`${typeof window !== 'undefined' ? window.location.origin : ''}?service=${selectedService}&mood=${selectedMood}&time=${selectedTime}`}
                        title="Check out these movie recommendations"
                        description="I found some great movie recommendations using What to Watch!"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

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