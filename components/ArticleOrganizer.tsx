"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface AffiliateLink {
  url: string;
  text: string;
  type: string;
}

interface OrganizedArticle {
  id: string;
  slug: string;
  kind: string;
  title: string;
  topic: string;
  keywords: string[];
  longtails: string[];
  wordCount: number;
  readingTime: number;
  publishedAt: string;
  createdAt: string;
  status: string;
  affiliateLinks: AffiliateLink[];
  seoScore: number;
  url: string;
  excerpt: string;
}

interface ArticleSummary {
  total: number;
  byKind: Record<string, number>;
  totalWords: number;
  averageReadingTime: number;
  totalAffiliateLinks: number;
  averageSEOScore: number;
}

export default function ArticleOrganizer() {
  const [articles, setArticles] = useState<OrganizedArticle[]>([]);
  const [summary, setSummary] = useState<ArticleSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'published_at' | 'created_at' | 'wordCount' | 'seoScore'>('published_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'article' | 'howto'>('all');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`/api/admin/articles/organized?sortBy=${sortBy}&order=${order}&limit=100`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error('Error fetching organized articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [sortBy, order]);

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'article': return '📝';
      case 'howto': return '📖';
      case 'review': return '⭐';
      default: return '📄';
    }
  };

  const getKindColor = (kind: string) => {
    switch (kind) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'howto': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getAffiliateTypeIcon = (type: string) => {
    switch (type) {
      case 'netflix': return '🔴';
      case 'amazon': return '📦';
      case 'disney': return '🏰';
      case 'hulu': return '🟢';
      case 'hbo': return '🟣';
      case 'apple': return '🍎';
      default: return '🔗';
    }
  };

  const filteredArticles = articles.filter(article => 
    filter === 'all' || article.kind === filter
  );

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
                  <span className="text-blue-600 font-semibold">📝</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Articles</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Words</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalWords.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">🔗</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Affiliate Links</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalAffiliateLinks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg SEO Score</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.averageSEOScore}</p>
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
              All ({articles.length})
            </button>
            <button
              onClick={() => setFilter('article')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'article' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Articles ({summary?.byKind.article || 0})
            </button>
            <button
              onClick={() => setFilter('howto')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'howto' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              How-To ({summary?.byKind.howto || 0})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="published_at">Published Date</option>
              <option value="created_at">Created Date</option>
              <option value="wordCount">Word Count</option>
              <option value="seoScore">SEO Score</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Organized Articles</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SEO Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliate Links
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <span className="text-lg mr-3 mt-1">{getKindIcon(article.kind)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {article.excerpt}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {article.keywords.slice(0, 3).map((keyword, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {keyword}
                            </span>
                          ))}
                          {article.keywords.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{article.keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKindColor(article.kind)}`}>
                      {article.kind}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSEOScoreColor(article.seoScore)}`}>
                      {article.seoScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div>{article.wordCount.toLocaleString()} words</div>
                      <div>{article.readingTime} min read</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {article.affiliateLinks.slice(0, 3).map((link, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {getAffiliateTypeIcon(link.type)}
                        </span>
                      ))}
                      {article.affiliateLinks.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{article.affiliateLinks.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={article.url}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button className="text-green-600 hover:text-green-900">
                        Edit
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        SEO
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


