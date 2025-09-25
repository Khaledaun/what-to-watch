'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, RefreshCw, Plus, Edit, Trash2, Eye, Check, X } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published' | 'archived'
  category: string
  tags: string[]
  author: string
  published_at?: string
  created_at: string
  updated_at: string
  views: number
  featured: boolean
}

export function AdminNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/articles')
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      } else {
        console.error('Failed to fetch articles')
        setArticles(getMockArticles())
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setArticles(getMockArticles())
    } finally {
      setLoading(false)
    }
  }

  const getMockArticles = (): NewsArticle[] => [
    {
      id: '1',
      title: 'Top 10 Action Movies on Netflix This Month',
      content: 'Discover the best action movies currently streaming on Netflix...',
      excerpt: 'From explosive blockbusters to intense thrillers, here are the top action movies you can watch right now.',
      status: 'published',
      category: 'Movies',
      tags: ['action', 'netflix', 'streaming'],
      author: 'Admin',
      published_at: '2024-01-20T10:00:00Z',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      views: 1250,
      featured: true
    },
    {
      id: '2',
      title: 'How to Watch Fight Club: Streaming Guide',
      content: 'Find out where to watch the cult classic Fight Club...',
      excerpt: 'Complete guide to streaming Fight Club across different platforms.',
      status: 'published',
      category: 'Streaming',
      tags: ['fight-club', 'streaming', 'guide'],
      author: 'Admin',
      published_at: '2024-01-19T15:30:00Z',
      created_at: '2024-01-19T15:30:00Z',
      updated_at: '2024-01-19T15:30:00Z',
      views: 890,
      featured: false
    },
    {
      id: '3',
      title: 'Best Drama Movies on Prime Video',
      content: 'Explore the finest drama films available on Amazon Prime Video...',
      excerpt: 'Curated list of the best drama movies you can stream on Prime Video.',
      status: 'draft',
      category: 'Movies',
      tags: ['drama', 'prime-video', 'streaming'],
      author: 'Admin',
      created_at: '2024-01-21T09:15:00Z',
      updated_at: '2024-01-21T09:15:00Z',
      views: 0,
      featured: false
    }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <Check className="h-4 w-4" />
      case 'draft': return <Edit className="h-4 w-4" />
      case 'archived': return <X className="h-4 w-4" />
      default: return null
    }
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
        <h1 className="text-3xl font-bold text-gray-900">News Hub</h1>
        <p className="text-gray-600">Manage your news articles and content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <span className="text-2xl">📰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              {articles.filter(a => a.status === 'published').length} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.filter(a => a.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">Live articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.filter(a => a.status === 'draft').length}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <span className="text-2xl">👁️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.reduce((acc, a) => acc + a.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
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
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Movies">Movies</option>
                <option value="Streaming">Streaming</option>
                <option value="Reviews">Reviews</option>
                <option value="News">News</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchArticles}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold line-clamp-1">{article.title}</h3>
                    {article.featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    )}
                    <Badge className={getStatusColor(article.status)}>
                      {getStatusIcon(article.status)}
                      <span className="ml-1 capitalize">{article.status}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Category: {article.category}</span>
                    <span>•</span>
                    <span>Author: {article.author}</span>
                    <span>•</span>
                    <span>Views: {article.views.toLocaleString()}</span>
                    {article.published_at && (
                      <>
                        <span>•</span>
                        <span>Published: {new Date(article.published_at).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
