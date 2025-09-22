"use client";

import { trackPerformance } from './analytics';

// Performance budget constants
export const PERFORMANCE_BUDGETS = {
  JS_SIZE_KB: 150,
  LCP_MS: 2500,
  INP_MS: 200,
  CLS_SCORE: 0.1,
  FID_MS: 100,
} as const;

// Core Web Vitals monitoring
export function measureCoreWebVitals() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      trackPerformance('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        trackPerformance('FID', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      trackPerformance('CLS', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

// Bundle size monitoring
export function measureBundleSize() {
  if (typeof window === 'undefined') return;

  // Estimate JS bundle size from performance entries
  const jsEntries = performance.getEntriesByType('resource')
    .filter((entry: any) => entry.name.includes('.js') || entry.name.includes('.mjs'));
  
  const totalSize = jsEntries.reduce((total, entry: any) => {
    return total + (entry.transferSize || 0);
  }, 0);

  const sizeKB = Math.round(totalSize / 1024);
  trackPerformance('JS_Bundle_Size', sizeKB, 'KB');

  // Warn if over budget
  if (sizeKB > PERFORMANCE_BUDGETS.JS_SIZE_KB) {
    console.warn(`⚠️ JS bundle size (${sizeKB}KB) exceeds budget (${PERFORMANCE_BUDGETS.JS_SIZE_KB}KB)`);
  }
}

// Image loading performance
export function measureImagePerformance() {
  if (typeof window === 'undefined') return;

  const imageObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (entry.name.includes('image') || entry.name.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        trackPerformance('Image_Load_Time', entry.duration);
      }
    });
  });
  
  imageObserver.observe({ entryTypes: ['resource'] });
}

// API response time monitoring
export function measureAPIPerformance(url: string, startTime: number) {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  trackPerformance('API_Response_Time', duration);
  
  // Warn if API is slow
  if (duration > 2000) {
    console.warn(`⚠️ Slow API response: ${url} took ${duration}ms`);
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Wait for page load
  if (document.readyState === 'complete') {
    measureCoreWebVitals();
    measureBundleSize();
    measureImagePerformance();
  } else {
    window.addEventListener('load', () => {
      measureCoreWebVitals();
      measureBundleSize();
      measureImagePerformance();
    });
  }
}

// Performance optimization utilities
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@600;700;800&display=swap';
  fontLink.as = 'style';
  document.head.appendChild(fontLink);

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://image.tmdb.org',
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// Lazy loading utility
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  if (typeof window === 'undefined') return null;

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

