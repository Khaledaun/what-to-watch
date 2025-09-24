'use client'

import { useEffect } from 'react'

export default function CoreWebVitals() {
  useEffect(() => {
    // Only run in production and if gtag is available
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.gtag) {
      // Import web-vitals dynamically
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        // Core Web Vitals
        onCLS((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          })
        })

        onLCP((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          })
        })

        // Interaction to Next Paint (replaces FID)
        onINP((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          })
        })

        // Additional metrics
        onFCP((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          })
        })

        onTTFB((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          })
        })
      }).catch((error) => {
        console.warn('Failed to load web-vitals:', error)
      })
    }
  }, [])

  return null
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
