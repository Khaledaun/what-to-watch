'use client'

import { useEffect, useState } from 'react'

// Skip link component for keyboard navigation
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
  )
}

// Focus trap component for modals
export function FocusTrap({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  useEffect(() => {
    if (!active) return

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const firstFocusableElement = document.querySelector(focusableElements) as HTMLElement
    const focusableContent = document.querySelectorAll(focusableElements)
    const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [active])

  return <>{children}</>
}

// Screen reader only text
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

// High contrast mode support
export function HighContrastSupport() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
      }
    }

    // Check initial state
    if (mediaQuery.matches) {
      document.documentElement.classList.add('high-contrast')
    }

    mediaQuery.addEventListener('change', handleContrastChange)
    return () => mediaQuery.removeEventListener('change', handleContrastChange)
  }, [])

  return null
}

// Reduced motion support
export function ReducedMotionSupport() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion')
      } else {
        document.documentElement.classList.remove('reduce-motion')
      }
    }

    // Check initial state
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion')
    }

    mediaQuery.addEventListener('change', handleMotionChange)
    return () => mediaQuery.removeEventListener('change', handleMotionChange)
  }, [])

  return null
}

// Hook for focus ring management
export function useFocusRing() {
  const [isFocused, setIsFocused] = useState(false)
  
  const focusProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    className: isFocused ? 'focus-visible:ring-2 focus-visible:ring-blue-500' : ''
  }
  
  return { isFocused, focusProps }
}

// Live region component for screen readers
export function LiveRegion({ children, level = 'polite' }: { children: React.ReactNode; level?: 'polite' | 'assertive' }) {
  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  )
}

// Accessibility provider that combines all accessibility features
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <HighContrastSupport />
      <ReducedMotionSupport />
      {children}
    </>
  )
}