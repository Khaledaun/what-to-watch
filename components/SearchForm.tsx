'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SearchFormProps {
  initialQuery?: string
  initialType?: string
  initialYear?: string
}

export default function SearchForm({ initialQuery = '', initialType = '', initialYear = '' }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType)
  const [year, setYear] = useState(initialYear)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (type) params.set('type', type)
    if (year) params.set('year', year)
    
    router.push(`/search?${params.toString()}`)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for movies, TV shows, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-gray-400 focus:border-purple-500"
          />
        </div>

        {/* Type Filter */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full md:w-40 bg-slate-800/50 border-slate-700 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="movie">Movies</SelectItem>
            <SelectItem value="tv">TV Shows</SelectItem>
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-full md:w-32 bg-slate-800/50 border-slate-700 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Any Year" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
            <SelectItem value="">Any Year</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          Search
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-gray-400 text-sm">Quick filters:</span>
        {[
          { label: '2024', value: '2024' },
          { label: 'Netflix', value: 'netflix' },
          { label: 'Action', value: 'action' },
          { label: 'Comedy', value: 'comedy' },
          { label: 'Horror', value: 'horror' },
        ].map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => {
              if (filter.value === '2024') {
                setYear('2024')
              } else {
                setQuery(filter.label)
              }
            }}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full transition-colors"
          >
            {filter.label}
          </button>
        ))}
      </div>
    </form>
  )
}