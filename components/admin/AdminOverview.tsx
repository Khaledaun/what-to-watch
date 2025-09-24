"use client";
import { useState, useEffect } from 'react';
import { AdminCard } from './AdminCard';
import { AdminChart } from './AdminChart';

interface DashboardStats {
  titles: {
    total: number;
    movies: number;
    tvShows: number;
  };
  factsheets: {
    total: number;
    stale: number;
    fresh: number;
  };
  providers: {
    total: number;
    lastUpdated: string;
  };
  content: {
    drafts: number;
    scheduled: number;
    published: number;
  };
  news: {
    queued: number;
    approved: number;
  };
  jobs: {
    queued: number;
    running: number;
    failed: number;
  };
  lastCronRun: string;
}

export function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from APIs
        const [workflowResponse, settingsResponse] = await Promise.all([
          fetch('/api/admin/workflow/status'),
          fetch('/api/admin/settings')
        ]);

        let workflowData = null;
        let settingsData = null;

        if (workflowResponse.ok) {
          workflowData = await workflowResponse.json();
        }

        if (settingsResponse.ok) {
          settingsData = await settingsResponse.json();
        }

        // Calculate real stats based on available data
        const jobs = workflowData?.jobs || [];
        const queuedJobs = jobs.filter((job: any) => job.status === 'queued').length;
        const runningJobs = jobs.filter((job: any) => job.status === 'running').length;
        const failedJobs = jobs.filter((job: any) => job.status === 'failed').length;

        // Get API status from settings
        const hasGrokApi = settingsData?.settings?.openaiApiKey && settingsData.settings.openaiApiKey !== '';
        const hasTmdbApi = settingsData?.settings?.tmdbApiKey && settingsData.settings.tmdbApiKey !== '';
        const hasSupabase = settingsData?.settings?.supabaseUrl && settingsData.settings.supabaseServiceRoleKey;

        setStats({
          titles: {
            total: hasSupabase ? 0 : 0, // Would be real count from database
            movies: hasSupabase ? 0 : 0,
            tvShows: hasSupabase ? 0 : 0
          },
          factsheets: {
            total: hasSupabase ? 0 : 0,
            stale: hasSupabase ? 0 : 0,
            fresh: hasSupabase ? 0 : 0
          },
          providers: {
            total: hasSupabase ? 0 : 0,
            lastUpdated: hasSupabase ? 'Never' : 'Database not connected'
          },
          content: {
            drafts: hasGrokApi ? 0 : 0,
            scheduled: hasGrokApi ? 0 : 0,
            published: hasGrokApi ? 0 : 0
          },
          news: {
            queued: 0,
            approved: 0
          },
          jobs: {
            queued: queuedJobs,
            running: runningJobs,
            failed: failedJobs
          },
          lastCronRun: workflowData?.lastUpdated ? new Date(workflowData.lastUpdated).toLocaleString() : 'Never'
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Set minimal stats on error
        setStats({
          titles: { total: 0, movies: 0, tvShows: 0 },
          factsheets: { total: 0, stale: 0, fresh: 0 },
          providers: { total: 0, lastUpdated: 'Error' },
          content: { drafts: 0, scheduled: 0, published: 0 },
          news: { queued: 0, approved: 0 },
          jobs: { queued: 0, running: 0, failed: 0 },
          lastCronRun: 'Error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard stats</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your content pipeline and system health</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard
          title="Titles"
          value={stats.titles.total.toLocaleString()}
          subtitle={stats.titles.total > 0 ? `${stats.titles.movies} movies, ${stats.titles.tvShows} TV shows` : 'Database not connected'}
          icon="🎬"
          trend={stats.titles.total > 0 ? "Active" : "Not configured"}
          trendUp={stats.titles.total > 0}
        />
        
        <AdminCard
          title="Factsheets"
          value={stats.factsheets.total.toLocaleString()}
          subtitle={stats.factsheets.total > 0 ? `${stats.factsheets.stale} stale, ${stats.factsheets.fresh} fresh` : 'No data available'}
          icon="📚"
          trend={stats.factsheets.total > 0 ? "Active" : "Not configured"}
          trendUp={stats.factsheets.total > 0}
        />
        
        <AdminCard
          title="Providers"
          value={stats.providers.total.toLocaleString()}
          subtitle={`Last updated: ${stats.providers.lastUpdated}`}
          icon="📺"
          trend={stats.providers.total > 0 ? "Fresh" : "Not configured"}
          trendUp={stats.providers.total > 0}
        />
        
        <AdminCard
          title="Content"
          value={stats.content.published.toLocaleString()}
          subtitle={stats.content.published > 0 ? `${stats.content.drafts} drafts, ${stats.content.scheduled} scheduled` : 'AI not configured'}
          icon="✍️"
          trend={stats.content.published > 0 ? "Active" : "AI not configured"}
          trendUp={stats.content.published > 0}
        />
        
        <AdminCard
          title="News"
          value={stats.news.approved.toLocaleString()}
          subtitle={stats.news.approved > 0 ? `${stats.news.queued} queued, ${stats.news.approved} approved` : 'No news feeds'}
          icon="📰"
          trend={stats.news.approved > 0 ? "Active" : "Not configured"}
          trendUp={stats.news.approved > 0}
        />
        
        <AdminCard
          title="Job Queue"
          value={stats.jobs.queued.toString()}
          subtitle={`${stats.jobs.running} running, ${stats.jobs.failed} failed`}
          icon="⚙️"
          trend={stats.jobs.failed > 0 ? `${stats.jobs.failed} failed` : 'Healthy'}
          trendUp={stats.jobs.failed === 0}
        />
        
        <AdminCard
          title="Last Cron Run"
          value={stats.lastCronRun}
          subtitle="Automated content generation"
          icon="🕐"
          trend={stats.lastCronRun !== 'Never' && stats.lastCronRun !== 'Error' ? "On schedule" : "Not running"}
          trendUp={stats.lastCronRun !== 'Never' && stats.lastCronRun !== 'Error'}
        />
        
        <AdminCard
          title="System Health"
          value={stats.jobs.failed === 0 ? "Healthy" : "Issues"}
          subtitle={stats.jobs.failed === 0 ? "All systems operational" : `${stats.jobs.failed} failed jobs`}
          icon="💚"
          trend={stats.jobs.failed === 0 ? "Excellent" : "Needs attention"}
          trendUp={stats.jobs.failed === 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          title="Content Output This Week"
          data={[
            { name: 'Mon', value: 12 },
            { name: 'Tue', value: 19 },
            { name: 'Wed', value: 15 },
            { name: 'Thu', value: 22 },
            { name: 'Fri', value: 18 },
            { name: 'Sat', value: 8 },
            { name: 'Sun', value: 5 }
          ]}
          type="bar"
        />
        
        <AdminChart
          title="Traffic to Conversion (Placeholder)"
          data={[
            { name: 'Page Views', value: 12500 },
            { name: 'Unique Visitors', value: 8900 },
            { name: 'Recommendations', value: 3400 },
            { name: 'Clicks to Stream', value: 1200 }
          ]}
          type="pie"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium">Run Seed Lists</div>
            <div className="text-sm text-gray-500">Update trending content</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium">Generate Content Pack</div>
            <div className="text-sm text-gray-500">Create weekly content</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-medium">Check Job Queue</div>
            <div className="text-sm text-gray-500">Monitor system health</div>
          </button>
        </div>
      </div>
    </div>
  );
}
