"use client";
import { useState, useEffect } from 'react';
import { ArticleTopicGenerator } from '@/lib/article-generator';

interface ArticleTopic {
  id: string;
  title: string;
  slug: string;
  category: string;
  targetKeywords: string[];
  longTailKeywords: string[];
  authorityLinks: any[];
  contentOutline: string[];
  seoData: any;
  estimatedWordCount: number;
  difficulty: string;
  priority: string;
  generatedAt: string;
  status: string;
}

interface ArticleUploadProps {
  onUpload?: (article: any) => void;
}

export function ArticleUpload({ onUpload }: ArticleUploadProps) {
  const [topics, setTopics] = useState<ArticleTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ArticleTopic | null>(null);
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [] as string[],
    featuredImage: '',
    author: 'YallaCinema Team',
    readTime: 0,
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    publishDate: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    secondaryKeywords: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/article-topics');
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics || []);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectTopic = (topic: ArticleTopic) => {
    setSelectedTopic(topic);
    setArticle(prev => ({
      ...prev,
      title: topic.title,
      slug: topic.slug,
      category: topic.category,
      seoTitle: topic.seoData.metaTitle,
      seoDescription: topic.seoData.metaDescription,
      focusKeyword: topic.seoData.focusKeyword,
      secondaryKeywords: topic.seoData.secondaryKeywords,
      readTime: Math.ceil(topic.estimatedWordCount / 200) // Estimate reading time
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setArticle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !article.tags.includes(tag)) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleUpload = async () => {
    if (!article.title || !article.content) {
      setMessage('Please fill in the title and content');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Article uploaded successfully!');
        setArticle({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          category: '',
          tags: [],
          featuredImage: '',
          author: 'YallaCinema Team',
          readTime: 0,
          status: 'draft',
          publishDate: '',
          seoTitle: '',
          seoDescription: '',
          focusKeyword: '',
          secondaryKeywords: []
        });
        setSelectedTopic(null);
        onUpload?.(data.article);
      } else {
        const error = await response.json();
        setMessage(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Upload Article</h2>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Topic Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Article Topic (Optional)</h3>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.slice(0, 6).map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTopic?.id === topic.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => selectTopic(topic)}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{topic.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{topic.category}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      topic.priority === 'high' ? 'bg-red-100 text-red-800' :
                      topic.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {topic.priority}
                    </span>
                    <span className="text-gray-500">{topic.estimatedWordCount} words</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Article Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={article.title}
                onChange={(e) => {
                  handleInputChange('title', e.target.value);
                  handleInputChange('slug', generateSlug(e.target.value));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter article title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={article.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="article-url-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={article.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Movie Lists">Movie Lists</option>
                <option value="TV Lists">TV Lists</option>
                <option value="Streaming Guides">Streaming Guides</option>
                <option value="Movie Reviews">Movie Reviews</option>
                <option value="Movie Analysis">Movie Analysis</option>
                <option value="Streaming Comparison">Streaming Comparison</option>
                <option value="Seasonal Content">Seasonal Content</option>
                <option value="Trending Content">Trending Content</option>
                <option value="Educational Content">Educational Content</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={article.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Author name"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Content *
            </label>
            <textarea
              value={article.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your article content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={article.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the article..."
            />
          </div>

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">🔍 SEO Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={article.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO optimized title"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {article.seoTitle.length}/60 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={article.focusKeyword}
                  onChange={(e) => handleInputChange('focusKeyword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Primary keyword"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={article.seoDescription}
                onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO meta description"
              />
              <p className="text-xs text-gray-500 mt-1">
                {article.seoDescription.length}/160 characters
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTagAdd(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* Publishing Options */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">📅 Publishing Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={article.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              
              {article.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    value={article.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploading || !article.title || !article.content}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload Article'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
