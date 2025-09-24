'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Play } from 'lucide-react'

interface PlatformButtonsProps {
  platforms?: string[]
  title?: string
  year?: number
}

const platformConfig = {
  netflix: {
    name: 'Netflix',
    color: 'bg-red-600 hover:bg-red-700',
    icon: 'N'
  },
  prime: {
    name: 'Prime Video',
    color: 'bg-blue-600 hover:bg-blue-700',
    icon: 'P'
  },
  disney: {
    name: 'Disney+',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: 'D'
  },
  hulu: {
    name: 'Hulu',
    color: 'bg-green-600 hover:bg-green-700',
    icon: 'H'
  },
  max: {
    name: 'Max',
    color: 'bg-purple-600 hover:bg-purple-700',
    icon: 'M'
  },
  apple: {
    name: 'Apple TV+',
    color: 'bg-gray-800 hover:bg-gray-900',
    icon: 'A'
  },
  paramount: {
    name: 'Paramount+',
    color: 'bg-blue-700 hover:bg-blue-800',
    icon: 'P'
  },
  peacock: {
    name: 'Peacock',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: 'P'
  }
}

export function PlatformButtons({ platforms = [], title, year }: PlatformButtonsProps) {
  // If no platforms provided, show all major ones as placeholders
  const displayPlatforms = platforms.length > 0 ? platforms : ['netflix', 'prime', 'disney', 'hulu', 'max', 'apple']
  
  const handlePlatformClick = (platform: string) => {
    // For now, just show a tooltip or placeholder action
    // In the future, this would link to actual streaming pages
    console.log(`Navigate to ${platform} for ${title}`)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Where to watch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {displayPlatforms.map((platform) => {
            const config = platformConfig[platform as keyof typeof platformConfig]
            if (!config) return null
            
            return (
              <Button
                key={platform}
                onClick={() => handlePlatformClick(platform)}
                className={`${config.color} text-white h-12 flex items-center justify-center gap-2`}
                disabled={platforms.length === 0} // Disable if no real platforms
              >
                <span className="font-bold text-sm">{config.icon}</span>
                <span className="text-sm font-medium">{config.name}</span>
                {platforms.length === 0 && (
                  <ExternalLink className="w-3 h-3 opacity-50" />
                )}
              </Button>
            )
          })}
        </div>
        
        {platforms.length === 0 && (
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Live streaming links coming soon
            </p>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Find Showtimes
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on TMDB
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
