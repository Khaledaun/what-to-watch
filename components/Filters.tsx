'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PLATFORMS, PLATFORM_NAMES, MOODS, MOOD_NAMES, TIME_BUDGETS, AUDIENCES, AUDIENCE_NAMES, CONTENT_TYPES } from '@/lib/constants'
import { FilterInput, Platform, Mood, TimeBudget, Audience, ContentType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FiltersProps {
  onFiltersChange: (filters: FilterInput) => void
  initialFilters?: Partial<FilterInput>
  className?: string
}

export function Filters({ onFiltersChange, initialFilters, className }: FiltersProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(initialFilters?.platforms || ['netflix'])
  const [moods, setMoods] = useState<Mood[]>(initialFilters?.moods || [])
  const [timeBudget, setTimeBudget] = useState<TimeBudget | undefined>(initialFilters?.timeBudget)
  const [audience, setAudience] = useState<Audience | undefined>(initialFilters?.audience)
  const [type, setType] = useState<ContentType>(initialFilters?.type || 'either')

  useEffect(() => {
    onFiltersChange({
      countries: ['US'],
      platforms,
      moods: moods.length > 0 ? moods : undefined,
      timeBudget,
      audience,
      type,
      limit: 3,
    })
  }, [platforms, moods, timeBudget, audience, type, onFiltersChange])

  const togglePlatform = (platform: Platform) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const toggleMood = (mood: Mood) => {
    setMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>What to Watch Tonight</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platforms */}
        <div>
          <h3 className="text-sm font-medium mb-3">Available on</h3>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(platform => (
              <Badge
                key={platform}
                variant={platforms.includes(platform) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => togglePlatform(platform)}
              >
                {PLATFORM_NAMES[platform]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div>
          <h3 className="text-sm font-medium mb-3">Mood</h3>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(mood => (
              <Badge
                key={mood}
                variant={moods.includes(mood) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => toggleMood(mood)}
              >
                {MOOD_NAMES[mood]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Time Budget */}
        <div>
          <h3 className="text-sm font-medium mb-3">Time Available</h3>
          <div className="flex gap-2">
            {TIME_BUDGETS.map(budget => (
              <Button
                key={budget}
                variant={timeBudget === budget ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeBudget(timeBudget === budget ? undefined : budget)}
              >
                {budget === '<45' ? '< 45 min' : budget === '~90' ? '~ 90 min' : '2+ hours'}
              </Button>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div>
          <h3 className="text-sm font-medium mb-3">Audience</h3>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map(aud => (
              <Button
                key={aud}
                variant={audience === aud ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAudience(audience === aud ? undefined : aud)}
              >
                {AUDIENCE_NAMES[aud]}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Type */}
        <div>
          <h3 className="text-sm font-medium mb-3">Type</h3>
          <div className="flex gap-2">
            {CONTENT_TYPES.map(contentType => (
              <Button
                key={contentType}
                variant={type === contentType ? 'default' : 'outline'}
                size="sm"
                onClick={() => setType(contentType as ContentType)}
              >
                {contentType === 'either' ? 'Either' : contentType === 'movie' ? 'Movies' : 'Series'}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
