"use client";

import { env } from './env';

// Analytics event types
export type AnalyticsEvent = 
  | 'recommend_shown'
  | 'play_now_click'
  | 'filter_change'
  | 'hide_click'
  | 'trailer_click'
  | 'platform_select'
  | 'mood_select'
  | 'time_select'
  | 'audience_select'
  | 'type_select'
  | 'surprise_me_click'
  | 'blog_post_view'
  | 'search_performed';

export interface AnalyticsEventProps {
  country?: string;
  platforms?: string[];
  mood?: string;
  timeBudget?: string;
  audience?: string;
  type?: string;
  title?: string;
  year?: number;
  runtime?: number;
  rating?: number;
  providers?: string[];
  postSlug?: string;
  searchQuery?: string;
  error?: string;
}

// GA4 implementation
export function trackEvent(event: AnalyticsEvent, props: AnalyticsEventProps = {}) {
  if (typeof window === 'undefined') return;
  
  // GA4 tracking
  if (env.NEXT_PUBLIC_GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', event, {
      event_category: 'engagement',
      event_label: props.title || props.mood || props.platforms?.join(','),
      ...props,
    });
  }
  
  // Console logging for development
  if (env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', event, props);
  }
}

// React hook for analytics
export function useAnalytics() {
  const track = (event: AnalyticsEvent, props?: AnalyticsEventProps) => {
    trackEvent(event, props);
  };

  return { track };
}

// Pre-defined tracking functions
export const analytics = {
  recommendShown: (props: AnalyticsEventProps) => 
    trackEvent('recommend_shown', props),
    
  playNowClick: (props: AnalyticsEventProps) => 
    trackEvent('play_now_click', props),
    
  filterChange: (props: AnalyticsEventProps) => 
    trackEvent('filter_change', props),
    
  hideClick: (props: AnalyticsEventProps) => 
    trackEvent('hide_click', props),
    
  trailerClick: (props: AnalyticsEventProps) => 
    trackEvent('trailer_click', props),
    
  platformSelect: (platforms: string[]) => 
    trackEvent('platform_select', { platforms }),
    
  moodSelect: (mood: string) => 
    trackEvent('mood_select', { mood }),
    
  timeSelect: (timeBudget: string) => 
    trackEvent('time_select', { timeBudget }),
    
  audienceSelect: (audience: string) => 
    trackEvent('audience_select', { audience }),
    
  typeSelect: (type: string) => 
    trackEvent('type_select', { type }),
    
  surpriseMeClick: (props: AnalyticsEventProps) => 
    trackEvent('surprise_me_click', props),
    
  blogPostView: (postSlug: string) => 
    trackEvent('blog_post_view', { postSlug }),
    
  searchPerformed: (searchQuery: string) => 
    trackEvent('search_performed', { searchQuery }),
};

// Performance tracking
export function trackPerformance(metric: string, value: number, unit: string = 'ms') {
  if (typeof window === 'undefined') return;
  
  if (env.NEXT_PUBLIC_GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metric,
      value: value,
      event_category: 'performance',
    });
  }
  
  if (env.NODE_ENV === 'development') {
    console.log(`⚡ Performance: ${metric} = ${value}${unit}`);
  }
}

// Error tracking
export function trackError(error: Error, context?: string) {
  if (typeof window === 'undefined') return;
  
  if (env.NEXT_PUBLIC_GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      custom_map: {
        context: context || 'unknown',
      },
    });
  }
  
  console.error('🚨 Error tracked:', error.message, context);
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}