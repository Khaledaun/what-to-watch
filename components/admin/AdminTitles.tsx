'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, RefreshCw, Download, Upload } from 'lucide-react'

interface Title {
  id: string
  title: string
  year: number
  type: 'movie' | 'tv'
  tmdb_id: number
  poster_path?: string
  backdrop_path?: string
  vote_average?: number
  popularity?: number
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

export function AdminTitles() {
  const [titles, setTitles] = useState<Title[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchTitles()
  }, [])

  const fetchTitles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/titles')
      if (response.ok) {
        const data = await response.json()
        setTitles(data.titles || [])
      } else {
        console.error('Failed to fetch titles')
        // Use mock data for development
        setTitles(getMockTitles())
      }
    } catch (error) {
      console.error('Error fetching titles:', error)
      setTitles(getMockTitles())
    } finally {
      setLoading(false)
    }
  }

  const getMockTitles = (): Title[] => [
    {
      id: '1',
      title: 'The Dark Knight',
      year: 2008,
      type: 'movie',
      tmdb_id: 155,
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      vote_average: 9.0,
      popularity: 85.2,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Avengers: Endgame',
      year: 2019,
      type: 'movie',
      tmdb_id: 299534,
      poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      vote_average: 8.4,
      popularity: 92.1,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      title: 'Breaking Bad',
      year: 2008,
      type: 'tv',
      tmdb_id: 1396,
      poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      vote_average: 9.5,
      popularity: 78.9,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    }
  ]

  const filteredTitles = titles.filter(title => {
    const matchesSearch = title.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || title.type === typeFilter
    const matchesStatus = statusFilter === 'all' || title.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Titles & Factsheets</h1>
        <p className="text-gray-600">Manage your movie and TV show database</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Titles</CardTitle>
            <span className="text-2xl">🎬</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{titles.length}</div>
            <p className="text-xs text-muted-foreground">
              {titles.filter(t => t.type === 'movie').length} movies, {titles.filter(t => t.type === 'tv').length} TV shows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{titles.filter(t => t.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <span className="text-2xl">⏳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{titles.filter(t => t.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <span className="text-2xl">⭐</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {titles.length > 0 ? (titles.reduce((acc, t) => acc + (t.vote_average || 0), 0) / titles.length).toFixed(1) : '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">Across all titles</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="movie">Movies</SelectItem>
                  <SelectItem value="tv">TV Shows</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchTitles}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Titles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTitles.map((title) => (
          <Card key={title.id} className="overflow-hidden">
            <div className="aspect-[2/3] bg-gray-200 relative">
              {title.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${title.poster_path}`}
                  alt={title.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">🎬</span>
                </div>
              )}
              <Badge className={`absolute top-2 right-2 ${getStatusColor(title.status)}`}>
                {title.status}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">{title.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                <span>{title.year}</span>
                <Badge variant="secondary" className="capitalize">
                  {title.type}
                </Badge>
              </div>
              
              {title.vote_average && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600">Rating:</span>
                  <span className="font-medium">{title.vote_average.toFixed(1)}/10</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">TMDB ID:</span>
                <span className="font-mono text-sm">{title.tmdb_id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTitles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No titles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
