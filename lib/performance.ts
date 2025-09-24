// Performance monitoring and optimization utilities

interface PerformanceMetric {
  name: string
  value: number
  delta: number
  id: string
  navigationType: string
}

interface PerformanceConfig {
  sampleRate: number
  reportUrl?: string
  enableWebVitals: boolean
  enableResourceTiming: boolean
}

const defaultConfig: PerformanceConfig = {
  sampleRate: 1.0,
  enableWebVitals: true,
  enableResourceTiming: true
}

let config: PerformanceConfig = defaultConfig

// Initialize performance monitoring
export function initPerformanceMonitoring(userConfig?: Partial<PerformanceConfig>) {
  config = { ...defaultConfig, ...userConfig }

  if (typeof window === 'undefined') return

  // Web Vitals monitoring
  if (config.enableWebVitals) {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(sendMetric)
      onFCP(sendMetric)
      onLCP(sendMetric)
      onTTFB(sendMetric)
      onINP(sendMetric)
    }).catch(() => {
      console.warn('web-vitals not available')
    })
  }

  // Resource timing monitoring
  if (config.enableResourceTiming) {
    monitorResourceTiming()
  }

  // Long task monitoring
  monitorLongTasks()
}

// Send performance metric
function sendMetric(metric: PerformanceMetric) {
  if (Math.random() > config.sampleRate) return

  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true
    })
  }

  // Send to custom endpoint
  if (config.reportUrl) {
    fetch(config.reportUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    }).catch(() => {
      // Silently fail
    })
  }
}

// Monitor resource timing
function monitorResourceTiming() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    setTimeout(() => {
      const resources = performance.getEntriesByType('resource')
      
      resources.forEach((resource: any) => {
        if (resource.duration > 1000) { // Resources taking more than 1 second
          sendMetric({
            name: 'slow_resource',
            value: resource.duration,
            delta: resource.duration,
            id: resource.name,
            navigationType: 'reload'
          })
        }
      })
    }, 0)
  })
}

// Monitor long tasks
function monitorLongTasks() {
  if (typeof window === 'undefined') return

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          sendMetric({
            name: 'long_task',
            value: entry.duration,
            delta: entry.duration,
            id: entry.name || 'unknown',
            navigationType: 'reload'
          })
        })
      })
      observer.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // Long task API not supported
    }
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  const criticalResources = [
    '/images/fallback/poster.webp',
    '/logos/netflix.svg',
    '/logos/prime_video.svg',
    '/logos/disney_plus.svg'
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource
    link.as = resource.endsWith('.svg') ? 'image' : 'image'
    document.head.appendChild(link)
  })
}

// Image optimization utilities
export function optimizeImageUrl(url: string, width?: number, quality?: number): string {
  if (!url) return ''
  
  // If it's a TMDB image, optimize it
  if (url.includes('image.tmdb.org')) {
    const size = width ? `w${width}` : 'w500'
    return url.replace('/t/p/', `/t/p/${size}/`)
  }
  
  return url
}

// Lazy loading utility
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  })
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memory usage monitoring
export function getMemoryUsage(): any {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null
  }

  return (performance as any).memory
}

// Performance budget checker
export function checkPerformanceBudget(): boolean {
  if (typeof window === 'undefined') return true

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  const budgets = {
    fcp: 1800, // First Contentful Paint
    lcp: 2500, // Largest Contentful Paint
    fid: 100,  // First Input Delay
    cls: 0.1,  // Cumulative Layout Shift
    ttfb: 600  // Time to First Byte
  }

  // This is a simplified check - in reality you'd get these from web-vitals
  return navigation.loadEventEnd - navigation.fetchStart < budgets.ttfb
}

// Bundle size monitoring
export function getBundleSize(): number {
  if (typeof window === 'undefined') return 0

  const scripts = document.querySelectorAll('script[src]')
  let totalSize = 0

  scripts.forEach(script => {
    const src = script.getAttribute('src')
    if (src && src.includes('_next/static')) {
      // This is a simplified approach - in reality you'd need to fetch and measure
      totalSize += 100000 // Estimated size
    }
  })

  return totalSize
}