"use client";
import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ArticleUpload } from '@/components/admin/ArticleUpload';
import ContentWorkflow from '@/components/ContentWorkflow';
import CrawlerMonitor from '@/components/CrawlerMonitor';
import AutomationPipeline from '@/components/AutomationPipeline';
import SEOTracker from '@/components/SEOTracker';
import ArticleOrganizer from '@/components/ArticleOrganizer';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  category: string;
  author: string;
  created_at: string;
  published_at?: string;
  read_time: number;
  word_count: number;
}

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'crawler' | 'upload' | 'manage' | 'topics' | 'automation' | 'seo' | 'organizer'>('workflow');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchArticles();
    }
  }, [activeTab]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/articles?limit=50');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleUpload = (article: any) => {
    // Refresh articles list if on manage tab
    if (activeTab === 'manage') {
      fetchArticles();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 lg:pl-64">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">✍️ Content Studio</h1>
                <p className="mt-2 text-gray-600">
                  Create, manage, and publish articles for your movie and TV content site.
                </p>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('workflow')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'workflow'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🔄 Content Workflow
                  </button>
                  <button
                    onClick={() => setActiveTab('crawler')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'crawler'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🕷️ Crawler Monitor
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'upload'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📝 Upload Article
                  </button>
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'manage'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📚 Manage Articles
                  </button>
                  <button
                    onClick={() => setActiveTab('topics')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'topics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    💡 Article Topics
                  </button>
                  <button
                    onClick={() => setActiveTab('automation')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'automation'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🤖 Automation Pipeline
                  </button>
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'seo'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🔗 SEO & URLs
                  </button>
                  <button
                    onClick={() => setActiveTab('organizer')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'organizer'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📊 Article Organizer
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'workflow' && (
                <ContentWorkflow />
              )}

              {activeTab === 'crawler' && (
                <CrawlerMonitor />
              )}

              {activeTab === 'upload' && (
                <ArticleUpload onUpload={handleArticleUpload} />
              )}

              {activeTab === 'manage' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Manage Articles</h2>
                    <p className="text-sm text-gray-600">View and manage all your articles</p>
                  </div>
                  
                  {loading ? (
                    <div className="p-6">
                      <div className="animate-pulse space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Article
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stats
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {article.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    /{article.slug}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                                  {article.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {article.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>{article.word_count.toLocaleString()} words</div>
                                <div>{article.read_time} min read</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(article.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                  Edit
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {articles.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No articles found. Upload your first article to get started!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'topics' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Article Topics</h2>
                    <p className="text-sm text-gray-600">
                      AI-generated article topics with SEO data, keywords, and content outlines.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mock topics - these would be populated from the API */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Top 10 Action Movies on Netflix 2024</h3>
                      <p className="text-sm text-gray-600 mb-3">Movie Lists</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">High Priority</span>
                        <span className="text-gray-500">2,500 words</span>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">How to Watch Popular Movies on All Platforms</h3>
                      <p className="text-sm text-gray-600 mb-3">Streaming Guides</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium Priority</span>
                        <span className="text-gray-500">2,000 words</span>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Netflix vs Disney+ vs Prime Video Comparison</h3>
                      <p className="text-sm text-gray-600 mb-3">Streaming Comparison</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Low Priority</span>
                        <span className="text-gray-500">2,800 words</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center space-x-4">
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/admin/generate-articles', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ generateNewTopics: true, topicCount: 3 })
                          });
                          const data = await response.json();
                          if (response.ok) {
                            alert(`Generated ${data.count} new topics and created article generation jobs!`);
                            // Refresh the page to show new topics
                            window.location.reload();
                          } else {
                            alert(`Error: ${data.message}`);
                          }
                        } catch (error) {
                          alert('Failed to generate topics and articles');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate New Topics & Articles
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/cron/process-jobs', { method: 'POST' });
                          const data = await response.json();
                          if (response.ok) {
                            alert(`Processed ${data.processed} jobs!`);
                          } else {
                            alert('Failed to process jobs');
                          }
                        } catch (error) {
                          alert('Failed to process jobs');
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Process Job Queue
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'automation' && (
                <AutomationPipeline />
              )}

              {activeTab === 'seo' && (
                <SEOTracker />
              )}

              {activeTab === 'organizer' && (
                <ArticleOrganizer />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
