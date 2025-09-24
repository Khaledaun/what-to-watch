"use client";
import { useState, useEffect } from 'react';

interface CrawlReport {
  totalUrls: number;
  successCount: number;
  errorCount: number;
  fourOhFourCount: number;
  averageResponseTime: number;
  errors: any[];
  fourOhFours: any[];
  timestamp: string;
}

export default function CrawlerMonitor() {
  const [report, setReport] = useState<CrawlReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastCrawl, setLastCrawl] = useState<string>('');

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const response = await fetch('/api/cron/crawl-website');
      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
        setLastCrawl(data.report?.timestamp || '');
      }
    } catch (error) {
      console.error('Error fetching crawl report:', error);
    }
  };

  const runCrawl = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cron/crawl-website', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Crawl completed! Found ${data.report.fourOhFourCount} 404 errors, auto-fixed ${data.report.autoFixSuccesses} of them.`);
        fetchLatestReport();
      } else {
        alert('Failed to run crawl');
      }
    } catch (error) {
      console.error('Error running crawl:', error);
      alert('Error running crawl');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (count: number, total: number) => {
    const percentage = (count / total) * 100;
    if (percentage === 0) return 'text-green-500';
    if (percentage < 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (count: number, total: number) => {
    const percentage = (count / total) * 100;
    if (percentage === 0) return '✅';
    if (percentage < 5) return '⚠️';
    return '❌';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Website Crawler Monitor</h2>
          <button
            onClick={runCrawl}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run Crawl'}
          </button>
        </div>
        
        {lastCrawl && (
          <p className="text-gray-600">
            Last crawl: {new Date(lastCrawl).toLocaleString()}
          </p>
        )}
      </div>

      {/* Status Overview */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total URLs</p>
                <p className="text-2xl font-bold text-gray-900">{report.totalUrls}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((report.successCount / report.totalUrls) * 100)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">404 Errors</p>
                <p className={`text-2xl font-bold ${getStatusColor(report.fourOhFourCount, report.totalUrls)}`}>
                  {report.fourOhFourCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{getStatusIcon(report.fourOhFourCount, report.totalUrls)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(report.averageResponseTime)}ms
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 404 Errors Details */}
      {report && report.fourOhFourCount > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🚨 404 Errors Found ({report.fourOhFourCount})
          </h3>
          <div className="space-y-3">
            {report.fourOhFours.map((error, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">{error.url}</p>
                  <p className="text-sm text-red-600">
                    Response time: {error.responseTime}ms
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    404
                  </span>
                  <button
                    onClick={() => {
                      // Auto-fix this specific URL
                      fetch('/api/cron/auto-fix-404', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: error.url })
                      }).then(() => {
                        alert('Auto-fix initiated for this URL');
                        fetchLatestReport();
                      });
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    Auto-Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Errors */}
      {report && report.errorCount > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            All Errors ({report.errorCount})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.errors.map((error, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {error.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        error.status === 404 ? 'bg-red-100 text-red-800' :
                        error.status >= 500 ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {error.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {error.responseTime}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {error.error || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Errors Message */}
      {report && report.errorCount === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                🎉 Perfect! No Errors Found
              </h3>
              <p className="text-green-700">
                Your website is in excellent condition with no 404 errors or other issues detected.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

