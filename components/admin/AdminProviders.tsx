'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, RefreshCw, Plus, Edit, Trash2, Globe, Check, X } from 'lucide-react'

interface Provider {
  id: string
  name: string
  display_name: string
  logo_url: string
  website_url: string
  country: string
  region: string
  status: 'active' | 'inactive' | 'pending'
  priority: number
  affiliate_enabled: boolean
  last_updated: string
  title_count: number
}

export function AdminProviders() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/providers')
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers || [])
      } else {
        console.error('Failed to fetch providers')
        setProviders(getMockProviders())
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
      setProviders(getMockProviders())
    } finally {
      setLoading(false)
    }
  }

  const getMockProviders = (): Provider[] => [
    {
      id: '1',
      name: 'netflix',
      display_name: 'Netflix',
      logo_url: '/logos/netflix.svg',
      website_url: 'https://netflix.com',
      country: 'US',
      region: 'North America',
      status: 'active',
      priority: 1,
      affiliate_enabled: false,
      last_updated: '2024-01-20T10:00:00Z',
      title_count: 1250
    },
    {
      id: '2',
      name: 'prime_video',
      display_name: 'Prime Video',
      logo_url: '/logos/prime_video.svg',
      website_url: 'https://primevideo.com',
      country: 'US',
      region: 'North America',
      status: 'active',
      priority: 2,
      affiliate_enabled: true,
      last_updated: '2024-01-20T09:30:00Z',
      title_count: 980
    },
    {
      id: '3',
      name: 'disney_plus',
      display_name: 'Disney+',
      logo_url: '/logos/disney_plus.svg',
      website_url: 'https://disneyplus.com',
      country: 'US',
      region: 'North America',
      status: 'active',
      priority: 3,
      affiliate_enabled: false,
      last_updated: '2024-01-20T08:45:00Z',
      title_count: 750
    },
    {
      id: '4',
      name: 'hulu',
      display_name: 'Hulu',
      logo_url: '/logos/hulu.svg',
      website_url: 'https://hulu.com',
      country: 'US',
      region: 'North America',
      status: 'active',
      priority: 4,
      affiliate_enabled: false,
      last_updated: '2024-01-20T07:15:00Z',
      title_count: 650
    },
    {
      id: '5',
      name: 'max',
      display_name: 'Max',
      logo_url: '/logos/max.svg',
      website_url: 'https://max.com',
      country: 'US',
      region: 'North America',
      status: 'active',
      priority: 5,
      affiliate_enabled: false,
      last_updated: '2024-01-20T06:30:00Z',
      title_count: 580
    },
    {
      id: '6',
      name: 'apple_tv_plus',
      display_name: 'Apple TV+',
      logo_url: '/logos/apple_tv_plus.svg',
      website_url: 'https://tv.apple.com',
      country: 'US',
      region: 'North America',
      status: 'active',
      priority: 6,
      affiliate_enabled: false,
      last_updated: '2024-01-20T05:20:00Z',
      title_count: 320
    }
  ]

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || provider.status === statusFilter
    const matchesCountry = countryFilter === 'all' || provider.country === countryFilter
    return matchesSearch && matchesStatus && matchesCountry
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="h-4 w-4" />
      case 'inactive': return <X className="h-4 w-4" />
      case 'pending': return <Globe className="h-4 w-4" />
      default: return null
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
        <h1 className="text-3xl font-bold text-gray-900">Watch Providers</h1>
        <p className="text-gray-600">Manage streaming service providers and their availability</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
            <span className="text-2xl">📺</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
            <p className="text-xs text-muted-foreground">
              {providers.filter(p => p.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.filter(p => p.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliate Enabled</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.filter(p => p.affiliate_enabled).length}</div>
            <p className="text-xs text-muted-foreground">With affiliate links</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Titles</CardTitle>
            <span className="text-2xl">🎬</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.reduce((acc, p) => acc + p.title_count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all providers</p>
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
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
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

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchProviders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {provider.logo_url ? (
                      <img
                        src={provider.logo_url}
                        alt={provider.display_name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">📺</span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{provider.display_name}</CardTitle>
                    <p className="text-sm text-gray-500">{provider.region}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(provider.status)}>
                  {getStatusIcon(provider.status)}
                  <span className="ml-1 capitalize">{provider.status}</span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Country:</span>
                  <p className="font-medium">{provider.country}</p>
                </div>
                <div>
                  <span className="text-gray-500">Priority:</span>
                  <p className="font-medium">#{provider.priority}</p>
                </div>
                <div>
                  <span className="text-gray-500">Titles:</span>
                  <p className="font-medium">{provider.title_count.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Affiliate:</span>
                  <p className="font-medium">
                    {provider.affiliate_enabled ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        Disabled
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <span>Last updated: {new Date(provider.last_updated).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No providers found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
