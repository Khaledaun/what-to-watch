'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MediaPosterProps {
  src?: string
  alt: string
  ratio?: '2/3' | '16/9'
  sizes?: string
  priority?: boolean
  className?: string
  title?: string
}

export function MediaPoster({ 
  src, 
  alt, 
  ratio = '2/3', 
  sizes, 
  priority = false, 
  className,
  title 
}: MediaPosterProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)
  
  const aspect = ratio === '16/9' ? 'aspect-video' : 'aspect-[2/3]'
  
  // Debug logging
  React.useEffect(() => {
    if (src) {
      console.log('MediaPoster rendering with src:', src)
    }
  }, [src])
  
  // Generate initials from title for placeholder
  const getInitials = (title: string) => {
    return title
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const handleError = () => {
    console.log('Next.js Image failed to load:', src)
    setError(true)
    setLoading(false)
    setUseFallback(true)
  }
  
  const handleLoad = () => {
    console.log('Next.js Image loaded successfully:', src)
    setLoading(false)
  }
  
  const handleFallbackError = () => {
    console.log('Fallback img also failed to load:', src)
  }
  
  const handleFallbackLoad = () => {
    console.log('Fallback img loaded successfully:', src)
    setLoading(false)
  }
  
  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg bg-muted',
      aspect,
      className
    )}>
      {/* Skeleton loading state */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
      )}
      
      {/* Regular img tag - bypass Next.js Image optimization */}
      {!useFallback && (
        <img
          src={src || '/images/fallback/poster.svg'}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            loading ? 'opacity-0' : 'opacity-100'
          )}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={handleError}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      
      {/* Fallback regular img tag */}
      {useFallback && src && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            loading ? 'opacity-0' : 'opacity-100'
          )}
          onError={handleFallbackError}
          onLoad={handleFallbackLoad}
        />
      )}
      
      {/* Final fallback SVG */}
      {useFallback && !src && (
        <img
          src="/images/fallback/poster.svg"
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Fallback placeholder with initials - only show if all images fail */}
      {error && !useFallback && title && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 text-white">
          <span className="text-2xl font-bold">
            {getInitials(title)}
          </span>
        </div>
      )}
      
      {/* Final fallback if no title */}
      {error && !useFallback && !title && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
    </div>
  )
}
