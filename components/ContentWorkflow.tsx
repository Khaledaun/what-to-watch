"use client";
import { useState, useEffect } from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  timestamp?: string;
  duration?: number;
  details?: any;
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  scheduledAt?: string;
  publishedAt?: string;
  wordCount?: number;
  seoScore?: number;
}

export default function ContentWorkflow() {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowData();
    const interval = setInterval(fetchWorkflowData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchWorkflowData = async () => {
    try {
      // Fetch workflow steps
      const workflowResponse = await fetch('/api/admin/workflow/status');
      if (workflowResponse.ok) {
        const workflowData = await workflowResponse.json();
        setWorkflowSteps(workflowData.steps || []);
      }

      // Fetch content items
      const contentResponse = await fetch('/api/admin/content/items');
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        setContentItems(contentData.items || []);
      }
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-100';
      case 'running': return 'text-blue-500 bg-blue-100';
      case 'failed': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'running': return '⟳';
      case 'failed': return '✗';
      default: return '○';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getContentTypeColor = (type: string) => {
    const colors = {
      'list': 'bg-blue-100 text-blue-800',
      'guide': 'bg-green-100 text-green-800',
      'comparison': 'bg-purple-100 text-purple-800',
      'review': 'bg-orange-100 text-orange-800',
      'seasonal': 'bg-pink-100 text-pink-800',
      'trending': 'bg-red-100 text-red-800',
      'evergreen': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workflow Status */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Generation Workflow</h2>
        
        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getStatusColor(step.status)}`}>
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {step.timestamp && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(step.timestamp)}
                    {step.duration && ` • ${step.duration}ms`}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Actions */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/cron/generate-weekly-topics', { method: 'POST' });
                if (response.ok) {
                  alert('Weekly topics generation started!');
                  fetchWorkflowData();
                }
              } catch (error) {
                alert('Failed to start topic generation');
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Weekly Topics
          </button>
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/cron/process-jobs', { method: 'POST' });
                if (response.ok) {
                  alert('Job processing started!');
                  fetchWorkflowData();
                }
              } catch (error) {
                alert('Failed to start job processing');
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Process Job Queue
          </button>
        </div>
      </div>

      {/* Content Pipeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Pipeline</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Word Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SEO Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.wordCount || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.seoScore ? `${item.seoScore}/100` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.scheduledAt ? formatDate(item.scheduledAt) : 'Not scheduled'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-green-600 hover:text-green-900">Publish</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {contentItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No content items found. Generate some topics to get started!</p>
          </div>
        )}
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Content Schedule</h2>
        
        <div className="grid grid-cols-7 gap-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
            const dayContent = contentItems.filter(item => {
              const createdDay = new Date(item.createdAt).getDay();
              return createdDay === (index + 1) % 7;
            });
            
            return (
              <div key={day} className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{day}</h3>
                <div className="space-y-2">
                  {dayContent.map((item) => (
                    <div key={item.id} className="p-2 bg-gray-100 rounded text-xs">
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-gray-500">{item.type}</div>
                    </div>
                  ))}
                  {dayContent.length === 0 && (
                    <div className="p-2 bg-gray-50 rounded text-xs text-gray-500">
                      No content
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


