'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FilterInput } from '@/lib/types'
import { cn } from '@/lib/utils'

interface OccasionTab {
  id: string
  label: string
  filters: Partial<FilterInput>
}

interface TabsOccasionProps {
  onFiltersChange: (filters: FilterInput) => void
  className?: string
}

const OCCASION_TABS: OccasionTab[] = [
  {
    id: 'tonight',
    label: 'Tonight',
    filters: {
      platforms: ['netflix', 'prime', 'hulu'],
      timeBudget: '~90',
    },
  },
  {
    id: 'weekend',
    label: 'Weekend',
    filters: {
      platforms: ['netflix', 'prime', 'disney-plus', 'max'],
      timeBudget: '2h+',
    },
  },
  {
    id: 'family',
    label: 'Family Night',
    filters: {
      platforms: ['netflix', 'disney-plus'],
      audience: 'family-5-8',
      moods: ['family', 'funny'],
    },
  },
  {
    id: 'date',
    label: 'Date Night',
    filters: {
      platforms: ['netflix', 'prime', 'max'],
      moods: ['romantic', 'feel-good'],
      audience: 'couple',
    },
  },
  {
    id: 'binge',
    label: 'Binge Series',
    filters: {
      platforms: ['netflix', 'hulu', 'max'],
      type: 'series',
      timeBudget: '2h+',
    },
  },
]

export function TabsOccasion({ onFiltersChange, className }: TabsOccasionProps) {
  const [activeTab, setActiveTab] = useState('tonight')

  const handleTabClick = (tab: OccasionTab) => {
    setActiveTab(tab.id)
    onFiltersChange({
      countries: ['US'],
      platforms: tab.filters.platforms || ['netflix'],
      moods: tab.filters.moods,
      timeBudget: tab.filters.timeBudget,
      audience: tab.filters.audience,
      type: tab.filters.type || 'either',
      limit: 3,
    })
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {OCCASION_TABS.map(tab => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTabClick(tab)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}

