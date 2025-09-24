'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
          <input
            type="text"
            placeholder="Search for movies, TV shows, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Type Filter */}
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="w-full md:w-40 h-10 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>

        {/* Year Filter */}
        <select 
          value={year} 
          onChange={(e) => setYear(e.target.value)}
          className="w-full md:w-32 h-10 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="">Any Year</option>
          {years.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>

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