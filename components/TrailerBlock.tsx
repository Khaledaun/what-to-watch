'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, X } from 'lucide-react'

interface TrailerBlockProps {
  trailerUrl?: string
  title?: string
  posterUrl?: string
}

export function TrailerBlock({ trailerUrl, title, posterUrl }: TrailerBlockProps) {
  const [showTrailer, setShowTrailer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // For demo purposes, use a sample YouTube trailer
  const demoTrailerUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  const finalTrailerUrl = trailerUrl || demoTrailerUrl

  if (!finalTrailerUrl) {
    return null
  }

  const handlePlayTrailer = () => {
    setShowTrailer(true)
  }

  const handleCloseTrailer = () => {
    setShowTrailer(false)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Trailer</CardTitle>
      </CardHeader>
      <CardContent>
        {!showTrailer ? (
          // Trailer Poster/Thumbnail
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${title} trailer thumbnail`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-12 h-12 mx-auto mb-2 opacity-80" />
                  <p className="text-sm opacity-80">Trailer Available</p>
                </div>
              </div>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                onClick={handlePlayTrailer}
                size="lg"
                className="bg-white/90 text-black hover:bg-white shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Play Trailer
              </Button>
            </div>
          </div>
        ) : (
          // Embedded Trailer
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`${finalTrailerUrl}?autoplay=1&mute=1&rel=0`}
              title={`${title} trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Close Button */}
            <Button
              onClick={handleCloseTrailer}
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {/* Trailer Info */}
        <div className="mt-3 text-center">
          <p className="text-sm text-muted-foreground">
            {title && `Watch the official trailer for ${title}`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
