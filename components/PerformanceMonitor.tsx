"use client";
import { useEffect } from 'react';
import { initPerformanceMonitoring, preloadCriticalResources } from '@/lib/performance';

export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    preloadCriticalResources();
  }, []);

  return null;
}

