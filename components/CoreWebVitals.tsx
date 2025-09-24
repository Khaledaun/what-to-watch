'use client'

import { useEffect } from 'react'

export default function CoreWebVitals() {
  useEffect(() => {
    // Only run in production and if gtag is available
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.gtag) {
      // Import web-vitals dynamically
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB, getINP }) => {
        // Core Web Vitals
        getCLS((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          })
        })

        getFID((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          })
        })

        getLCP((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          })
        })

        // Additional metrics
        getFCP((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          })
        })

        getTTFB((metric) => {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          })
        })

        // Interaction to Next Paint (replaces FID)
        if (getINP) {
          getINP((metric) => {
            window.gtag('event', metric.name, {
              event_category: 'Web Vitals',
              event_label: metric.id,
              value: Math.round(metric.value),
              non_interaction: true,
            })
          })
        }
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
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}
