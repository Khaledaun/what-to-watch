'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, RefreshCw, Play, Pause, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Job {
  id: string
  type: string
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  payload: any
  attempts: number
  max_attempts: number
  scheduled_at: string
  started_at?: string
  completed_at?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    fetchJobs()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchJobs, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/workflow/status')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      } else {
        console.error('Failed to fetch jobs')
        setJobs(getMockJobs())
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs(getMockJobs())
    } finally {
      setLoading(false)
    }
  }

  const getMockJobs = (): Job[] => [
    {
      id: '1',
      type: 'hydrate_title',
      status: 'completed',
      priority: 'high',
      payload: { tmdbId: 155, title: 'The Dark Knight' },
      attempts: 1,
      max_attempts: 3,
      scheduled_at: '2024-01-20T10:00:00Z',
      started_at: '2024-01-20T10:00:05Z',
      completed_at: '2024-01-20T10:02:30Z',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:02:30Z'
    },
    {
      id: '2',
      type: 'generate_article_from_topic',
      status: 'running',
      priority: 'medium',
      payload: { topicId: 'action-movies-netflix', priority: 'medium' },
      attempts: 1,
      max_attempts: 3,
      scheduled_at: '2024-01-20T10:05:00Z',
      started_at: '2024-01-20T10:05:10Z',
      created_at: '2024-01-20T10:05:00Z',
      updated_at: '2024-01-20T10:05:10Z'
    },
    {
      id: '3',
      type: 'refresh_providers',
      status: 'failed',
      priority: 'low',
      payload: { country: 'US', provider: 'netflix' },
      attempts: 3,
      max_attempts: 3,
      scheduled_at: '2024-01-20T09:30:00Z',
      started_at: '2024-01-20T09:30:15Z',
      error_message: 'API rate limit exceeded',
      created_at: '2024-01-20T09:30:00Z',
      updated_at: '2024-01-20T09:35:00Z'
    },
    {
      id: '4',
      type: 'build_factsheet',
      status: 'queued',
      priority: 'medium',
      payload: { tmdbId: 299534, title: 'Avengers: Endgame' },
      attempts: 0,
      max_attempts: 3,
      scheduled_at: '2024-01-20T11:00:00Z',
      created_at: '2024-01-20T10:15:00Z',
      updated_at: '2024-01-20T10:15:00Z'
    }
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    const matchesType = typeFilter === 'all' || job.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'queued': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'running': return <Play className="h-4 w-4" />
      case 'queued': return <Clock className="h-4 w-4" />
      case 'failed': return <XCircle className="h-4 w-4" />
      case 'cancelled': return <Pause className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatJobType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Jobs & Scheduling</h1>
        <p className="text-gray-600">Monitor and manage background jobs and scheduled tasks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <span className="text-2xl">⚙️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queued</CardTitle>
            <span className="text-2xl">⏳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'queued').length}</div>
            <p className="text-xs text-muted-foreground">Waiting to run</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <span className="text-2xl">▶️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'running').length}</div>
            <p className="text-xs text-muted-foreground">Currently executing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'completed').length}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <span className="text-2xl">❌</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'failed').length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
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
                  placeholder="Search jobs..."
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
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hydrate_title">Hydrate Title</SelectItem>
                  <SelectItem value="generate_article_from_topic">Generate Article</SelectItem>
                  <SelectItem value="refresh_providers">Refresh Providers</SelectItem>
                  <SelectItem value="build_factsheet">Build Factsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchJobs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{formatJobType(job.type)}</h3>
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1 capitalize">{job.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority} priority
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Job ID:</span>
                      <p className="font-mono text-xs">{job.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Attempts:</span>
                      <p className="font-medium">{job.attempts}/{job.max_attempts}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Scheduled:</span>
                      <p className="font-medium">{new Date(job.scheduled_at).toLocaleString()}</p>
                    </div>
                    {job.completed_at && (
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <p className="font-medium">{new Date(job.completed_at).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  
                  {job.error_message && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                      <p className="text-sm text-red-800">
                        <strong>Error:</strong> {job.error_message}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    <span>Payload: {JSON.stringify(job.payload, null, 2)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {job.status === 'queued' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Run Now
                    </Button>
                  )}
                  {job.status === 'running' && (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  {job.status === 'failed' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
