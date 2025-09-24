"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SEOUrl {
  id: string;
  type: 'movie' | 'article' | 'page';
  title: string;
  url: string;
  slug: string;
  popularity?: number;
  rating?: number;
  kind?: string;
  publishedAt?: string;
  lastUpdated: string;
  backlinks: number;
  seoScore: number;
  status: string;
}

interface SEOSummary {
  movies: number;
  articles: number;
  pages: number;
  averageSeoScore: number;
  totalBacklinks: number;
}

export default function SEOTracker() {
  const [urls, setUrls] = useState<SEOUrl[]>([]);
  const [summary, setSummary] = useState<SEOSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'movies' | 'articles' | 'pages'>('all');
  const [sortBy, setSortBy] = useState<'seo' | 'popularity' | 'backlinks' | 'date'>('seo');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(`/api/admin/seo/urls?type=${filter}&limit=100`);
        if (response.ok) {
          const data = await response.json();
          setUrls(data.urls);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error('Error fetching SEO URLs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [filter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'article': return '📝';
      case 'page': return '📄';
      default: return '🔗';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-green-100 text-green-800';
      case 'page': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const sortedUrls = [...urls].sort((a, b) => {
    switch (sortBy) {
      case 'seo':
        return b.seoScore - a.seoScore;
      case 'popularity':
        return (b.popularity || 0) - (a.popularity || 0);
      case 'backlinks':
        return b.backlinks - a.backlinks;
      case 'date':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">🎬</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Movies</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.movies}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">📝</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Articles</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.articles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">📄</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pages</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.pages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg SEO Score</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.averageSeoScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({urls.length})
            </button>
            <button
              onClick={() => setFilter('movies')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'movies' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Movies ({summary?.movies || 0})
            </button>
            <button
              onClick={() => setFilter('articles')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'articles' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Articles ({summary?.articles || 0})
            </button>
            <button
              onClick={() => setFilter('pages')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'pages' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pages ({summary?.pages || 0})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="seo">SEO Score</option>
              <option value="popularity">Popularity</option>
              <option value="backlinks">Backlinks</option>
              <option value="date">Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* URLs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">SEO URLs & Backlinks</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SEO Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Backlinks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUrls.map((url) => (
                <tr key={url.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getTypeIcon(url.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {url.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {url.url}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(url.type)}`}>
                      {url.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSEOScoreColor(url.seoScore)}`}>
                      {url.seoScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {url.backlinks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(url.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={url.url}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button className="text-green-600 hover:text-green-900">
                        Analyze
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

