"use client";
import { useState, useEffect } from "react";

interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  nextRun?: string;
  lastRun?: string;
  duration?: string;
  progress?: number;
}

interface AutomationStatus {
  overall: 'active' | 'paused' | 'error';
  nextAction: string;
  nextActionTime: string;
  steps: PipelineStep[];
}

export default function AutomationPipeline() {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/admin/automation/status');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        } else {
          // Fallback to mock data
          setStatus({
            overall: 'active',
            nextAction: 'Topic Generation',
            nextActionTime: '2025-09-23T09:30:00Z',
            steps: [
              {
                id: 'data-ingestion',
                name: 'Data Ingestion',
                description: 'Pull latest movie data from TMDB API',
                status: 'completed',
                lastRun: '2025-09-23T08:00:00Z',
                duration: '15m'
              },
              {
                id: 'normalization',
                name: 'Data Normalization',
                description: 'Clean and standardize movie data',
                status: 'completed',
                lastRun: '2025-09-23T08:15:00Z',
                duration: '5m'
              },
              {
                id: 'factsheet-curation',
                name: 'Factsheet Curation',
                description: 'Generate movie factsheets and metadata',
                status: 'completed',
                lastRun: '2025-09-23T08:20:00Z',
                duration: '10m'
              },
              {
                id: 'topic-generation',
                name: 'Topic Generation',
                description: 'Generate 10 weekly article topics',
                status: 'pending',
                nextRun: '2025-09-23T09:30:00Z'
              },
              {
                id: 'content-generation',
                name: 'Content Generation',
                description: 'Generate articles using Grok AI',
                status: 'pending',
                nextRun: '2025-09-23T10:00:00Z'
              },
              {
                id: 'approval',
                name: 'Content Approval',
                description: 'Review and approve generated content',
                status: 'pending'
              },
              {
                id: 'publishing',
                name: 'Publishing',
                description: 'Publish approved content to website',
                status: 'pending'
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching automation status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'running': return '⟳';
      case 'failed': return '✗';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load automation status</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Automation Pipeline Status</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            status.overall === 'active' ? 'bg-green-100 text-green-800' :
            status.overall === 'paused' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status.overall === 'active' ? '🟢 Active' :
             status.overall === 'paused' ? '🟡 Paused' :
             '🔴 Error'}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Next Action</h3>
            <p className="text-lg font-semibold text-gray-900">{status.nextAction}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Scheduled Time</h3>
            <p className="text-lg font-semibold text-gray-900">
              {formatDateTime(status.nextActionTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pipeline Steps</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {status.steps.map((step, index) => (
            <div key={step.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">{step.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                      {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  
                  <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                    {step.lastRun && (
                      <div>
                        <span className="font-medium">Last Run:</span> {formatDateTime(step.lastRun)}
                      </div>
                    )}
                    {step.nextRun && (
                      <div>
                        <span className="font-medium">Next Run:</span> {formatDateTime(step.nextRun)}
                      </div>
                    )}
                    {step.duration && (
                      <div>
                        <span className="font-medium">Duration:</span> {step.duration}
                      </div>
                    )}
                  </div>
                  
                  {step.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${step.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Run Topic Generation Now
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Generate Content
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            Pause Pipeline
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            View Logs
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Data ingestion completed successfully</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">21 movies processed and added to database</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Content generation pipeline started</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

