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
    // Simulate API call to fetch dashboard stats
    const fetchStats = async () => {
      try {
        // This would be a real API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          titles: {
            total: 15420,
            movies: 8920,
            tvShows: 6500
          },
          factsheets: {
            total: 15420,
            stale: 2340,
            fresh: 13080
          },
          providers: {
            total: 15420,
            lastUpdated: '2 hours ago'
          },
          content: {
            drafts: 12,
            scheduled: 8,
            published: 156
          },
          news: {
            queued: 45,
            approved: 23
          },
          jobs: {
            queued: 3,
            running: 1,
            failed: 0
          },
          lastCronRun: '1 hour ago'
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
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
          subtitle={`${stats.titles.movies} movies, ${stats.titles.tvShows} TV shows`}
          icon="🎬"
          trend="+12%"
          trendUp={true}
        />
        
        <AdminCard
          title="Factsheets"
          value={stats.factsheets.fresh.toLocaleString()}
          subtitle={`${stats.factsheets.stale} stale, ${stats.factsheets.fresh} fresh`}
          icon="📚"
          trend={`${Math.round((stats.factsheets.stale / stats.factsheets.total) * 100)}% stale`}
          trendUp={false}
        />
        
        <AdminCard
          title="Providers"
          value={stats.providers.total.toLocaleString()}
          subtitle={`Last updated: ${stats.providers.lastUpdated}`}
          icon="📺"
          trend="Fresh"
          trendUp={true}
        />
        
        <AdminCard
          title="Content"
          value={stats.content.published.toLocaleString()}
          subtitle={`${stats.content.drafts} drafts, ${stats.content.scheduled} scheduled`}
          icon="✍️"
          trend="+8%"
          trendUp={true}
        />
        
        <AdminCard
          title="News"
          value={stats.news.approved.toLocaleString()}
          subtitle={`${stats.news.queued} queued, ${stats.news.approved} approved`}
          icon="📰"
          trend="+15%"
          trendUp={true}
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
          trend="On schedule"
          trendUp={true}
        />
        
        <AdminCard
          title="System Health"
          value="98.5%"
          subtitle="Uptime this month"
          icon="💚"
          trend="Excellent"
          trendUp={true}
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
