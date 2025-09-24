"use client";
import { useState, useEffect } from 'react';

interface CTAVariation {
  id: string;
  name: string;
  component: React.ReactNode;
  weight: number; // 0-100, determines how often this variation is shown
}

interface CTAOptimizerProps {
  variations: CTAVariation[];
  testName: string;
  movieId: string;
  movieTitle: string;
}

export default function CTAOptimizer({ variations, testName, movieId, movieTitle }: CTAOptimizerProps) {
  const [selectedVariation, setSelectedVariation] = useState<CTAVariation | null>(null);

  useEffect(() => {
    // Select variation based on weights
    const totalWeight = variations.reduce((sum, variation) => sum + variation.weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (const variation of variations) {
      currentWeight += variation.weight;
      if (random <= currentWeight) {
        setSelectedVariation(variation);
        break;
      }
    }

    // Track A/B test assignment
    console.log('A/B Test Assignment:', {
      testName,
      variationId: selectedVariation?.id,
      variationName: selectedVariation?.name,
      movieId,
      movieTitle,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send to analytics service
    // Example: gtag('event', 'ab_test_assignment', { test_name: testName, variation_id: selectedVariation?.id });
  }, [variations, testName, movieId, movieTitle, selectedVariation]);

  if (!selectedVariation) {
    return null;
  }

  return (
    <div data-test-name={testName} data-variation-id={selectedVariation.id}>
      {selectedVariation.component}
    </div>
  );
}

// Predefined CTA variations for different platforms
export const createNetflixCTA = (movieTitle: string, movieId: string) => ({
  id: 'netflix-primary',
  name: 'Netflix Primary CTA',
  weight: 40,
  component: (
    <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">Watch on Netflix</h3>
          <p className="text-white/80 text-sm">Start your free trial today</p>
        </div>
        <button 
          className="bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          data-affiliate="netflix"
          data-movie-id={movieId}
          data-cta-type="primary"
          data-variation="netflix-primary"
        >
          Watch Now →
        </button>
      </div>
    </div>
  ),
});

export const createPrimeCTA = (movieTitle: string, movieId: string) => ({
  id: 'prime-primary',
  name: 'Prime Video Primary CTA',
  weight: 30,
  component: (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">Watch on Prime Video</h3>
          <p className="text-white/80 text-sm">Included with Prime membership</p>
        </div>
        <button 
          className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          data-affiliate="prime"
          data-movie-id={movieId}
          data-cta-type="primary"
          data-variation="prime-primary"
        >
          Watch Now →
        </button>
      </div>
    </div>
  ),
});

export const createGenericCTA = (movieTitle: string, movieId: string) => ({
  id: 'generic-primary',
  name: 'Generic Primary CTA',
  weight: 30,
  component: (
    <div className="bg-gradient-to-r from-[#E0B15C] to-[#F2C879] p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#0A1220] font-bold text-lg">Watch {movieTitle}</h3>
          <p className="text-[#0A1220]/80 text-sm">Available on multiple platforms</p>
        </div>
        <button 
          className="bg-[#0A1220] hover:bg-[#0A1220]/90 text-[#E0B15C] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          data-affiliate="multiple"
          data-movie-id={movieId}
          data-cta-type="primary"
          data-variation="generic-primary"
        >
          Find Where to Watch →
        </button>
      </div>
    </div>
  ),
});

// Utility function to track CTA performance
export function trackCTAPerformance(
  testName: string,
  variationId: string,
  action: 'view' | 'click' | 'conversion',
  movieId: string,
  movieTitle: string,
  additionalData?: Record<string, any>
) {
  const eventData = {
    testName,
    variationId,
    action,
    movieId,
    movieTitle,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...additionalData,
  };

  console.log('CTA Performance Event:', eventData);

  // TODO: Send to analytics service
  // Example: gtag('event', 'cta_performance', eventData);
}

