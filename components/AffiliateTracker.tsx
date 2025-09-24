"use client";
import { useEffect } from 'react';

interface AffiliateTrackerProps {
  movieId: string;
  movieTitle: string;
}

export default function AffiliateTracker({ movieId, movieTitle }: AffiliateTrackerProps) {
  useEffect(() => {
    // Initialize affiliate tracking
    const handleAffiliateClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('[data-affiliate]') as HTMLElement;
      
      if (!button) return;

      const affiliate = button.dataset.affiliate;
      const ctaType = button.dataset.ctaType;
      const movieId = button.dataset.movieId;

      // Track affiliate click
      console.log('Affiliate Click:', {
        affiliate,
        ctaType,
        movieId,
        movieTitle,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });

      // TODO: Replace with actual affiliate tracking
      // This is where you would:
      // 1. Send data to your analytics service
      // 2. Redirect to affiliate URL
      // 3. Track conversion events
      
      // Example affiliate URLs (replace with actual affiliate links)
      const affiliateUrls: Record<string, string> = {
        'netflix': 'https://netflix.com/signup',
        'prime': 'https://amazon.com/prime',
        'hulu': 'https://hulu.com/start',
        'disney-plus': 'https://disneyplus.com/start',
        'max': 'https://max.com/start',
        'apple-tv-plus': 'https://apple.com/tv/',
      };

      const affiliateUrl = affiliateUrls[affiliate || ''];
      if (affiliateUrl) {
        // For now, just log the intended action
        console.log(`Would redirect to: ${affiliateUrl}`);
        
        // In production, you would do:
        // window.open(affiliateUrl, '_blank');
      }
    };

    // Add event listeners to all affiliate buttons
    const affiliateButtons = document.querySelectorAll('[data-affiliate]');
    affiliateButtons.forEach(button => {
      button.addEventListener('click', handleAffiliateClick);
    });

    // Cleanup
    return () => {
      affiliateButtons.forEach(button => {
        button.removeEventListener('click', handleAffiliateClick);
      });
    };
  }, [movieId, movieTitle]);

  // Track page view
  useEffect(() => {
    console.log('Movie Page View:', {
      movieId,
      movieTitle,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    });

    // TODO: Send page view to analytics
    // Example: gtag('event', 'page_view', { movie_id: movieId, movie_title: movieTitle });
  }, [movieId, movieTitle]);

  return null; // This component doesn't render anything
}

// Utility function to generate affiliate URLs
export function generateAffiliateUrl(platform: string, movieTitle: string, movieId: string): string {
  // This is where you would generate actual affiliate URLs
  // based on your affiliate agreements with each platform
  
  const baseUrls: Record<string, string> = {
    'netflix': 'https://netflix.com/signup',
    'prime': 'https://amazon.com/prime',
    'hulu': 'https://hulu.com/start',
    'disney-plus': 'https://disneyplus.com/start',
    'max': 'https://max.com/start',
    'apple-tv-plus': 'https://apple.com/tv/',
  };

  const baseUrl = baseUrls[platform];
  if (!baseUrl) return '#';

  // Add tracking parameters
  const params = new URLSearchParams({
    utm_source: 'whattowatch',
    utm_medium: 'affiliate',
    utm_campaign: 'movie_recommendation',
    movie_id: movieId,
    movie_title: movieTitle,
  });

  return `${baseUrl}?${params.toString()}`;
}

// Utility function to track conversion events
export function trackConversion(platform: string, movieId: string, movieTitle: string, ctaType: string) {
  const conversionData = {
    platform,
    movieId,
    movieTitle,
    ctaType,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  console.log('Conversion Event:', conversionData);

  // TODO: Send to your analytics service
  // Example: gtag('event', 'conversion', conversionData);
}

