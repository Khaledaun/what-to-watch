"use client";
import { useState, useEffect } from 'react';
import { TMDBConfig } from '@/lib/tmdb-enhanced';

interface TMDBIngestState {
  config: TMDBConfig | null;
  lastSeedRun: string | null;
  lastChangesScan: string | null;
  hydrationQueue: Array<{
    id: string;
    title: string;
    type: 'movie' | 'tv';
    status: string;
    attempts: number;
    lastError?: string;
  }>;
}

export function TMDBIngest() {
  const [state, setState] = useState<TMDBIngestState>({
    config: null,
    lastSeedRun: null,
    lastChangesScan: null,
    hydrationQueue: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'config' | 'discovery' | 'changes' | 'hydration'>('config');

  useEffect(() => {
    fetchTMDBData();
  }, []);

  const fetchTMDBData = async () => {
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState({
        config: {
          images: {
            base_url: 'https://image.tmdb.org/t/p/',
            secure_base_url: 'https://image.tmdb.org/t/p/',
            backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
            logo_sizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
            poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
            profile_sizes: ['w45', 'w185', 'h632', 'original'],
            still_sizes: ['w92', 'w185', 'w300', 'original']
          },
          change_keys: ['adult', 'air_date', 'also_known_as', 'alternative_titles', 'biography', 'birthday', 'budget', 'cast', 'certifications', 'character_names', 'created_by', 'crew', 'deathday', 'episode', 'episode_number', 'episode_run_time', 'freebase_id', 'freebase_mid', 'general', 'genres', 'guest_stars', 'homepage', 'images', 'imdb_id', 'languages', 'name', 'network', 'origin_country', 'original_name', 'original_title', 'overview', 'parts', 'place_of_birth', 'plot_keywords', 'production_code', 'production_companies', 'production_countries', 'releases', 'revenue', 'runtime', 'season', 'season_number', 'season_regular', 'spoken_languages', 'status', 'tagline', 'title', 'translations', 'tvdb_id', 'tvrage_id', 'type', 'video', 'videos']
        },
        lastSeedRun: '2 hours ago',
        lastChangesScan: '6 hours ago',
        hydrationQueue: [
          { id: '1', title: 'Oppenheimer', type: 'movie', status: 'queued', attempts: 0 },
          { id: '2', title: 'The Bear', type: 'tv', status: 'running', attempts: 1 },
          { id: '3', title: 'Spider-Man: Across the Spider-Verse', type: 'movie', status: 'failed', attempts: 3, lastError: 'Rate limit exceeded' }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch TMDB data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runSeedLists = async () => {
    try {
      // This would trigger the seed lists job
      console.log('Running seed lists...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setState(prev => ({ ...prev, lastSeedRun: 'Just now' }));
    } catch (error) {
      console.error('Failed to run seed lists:', error);
    }
  };

  const runChangesScan = async () => {
    try {
      // This would trigger the changes scan job
      console.log('Running changes scan...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setState(prev => ({ ...prev, lastChangesScan: 'Just now' }));
    } catch (error) {
      console.error('Failed to run changes scan:', error);
    }
  };

  const hydrateTitle = async (id: string) => {
    try {
      // This would trigger hydration for a specific title
      console.log('Hydrating title:', id);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to hydrate title:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">TMDB Ingest</h1>
        <p className="text-gray-600">Manage TMDB data ingestion and synchronization</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'config', name: 'Configuration' },
            { id: 'discovery', name: 'Discovery' },
            { id: 'changes', name: 'Changes' },
            { id: 'hydration', name: 'Hydration Queue' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">TMDB Configuration</h2>
            
            {state.config && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base URL</label>
                  <p className="mt-1 text-sm text-gray-900">{state.config.images.base_url}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allowed Sizes</label>
                  <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Posters</p>
                      <p className="text-sm text-gray-900">{state.config.images.poster_sizes.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Backdrops</p>
                      <p className="text-sm text-gray-900">{state.config.images.backdrop_sizes.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Logos</p>
                      <p className="text-sm text-gray-900">{state.config.images.logo_sizes.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Profiles</p>
                      <p className="text-sm text-gray-900">{state.config.images.profile_sizes.join(', ')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Refresh Configuration
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                    Refresh Genres/Languages
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discovery Tab */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seed Lists</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Run</p>
                  <p className="text-sm text-gray-500">{state.lastSeedRun || 'Never'}</p>
                </div>
                <button
                  onClick={runSeedLists}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Run Seed Lists
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900">US Region</h3>
                  <p className="text-sm text-gray-500">Trending, Top Rated, Now Playing</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900">CA Region</h3>
                  <p className="text-sm text-gray-500">Trending, Top Rated, Now Playing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Changes Tab */}
      {activeTab === 'changes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Changes Scan</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Scan</p>
                  <p className="text-sm text-gray-500">{state.lastChangesScan || 'Never'}</p>
                </div>
                <button
                  onClick={runChangesScan}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Run Changes Scan
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Scans for changes in movies and TV shows from the last 24 hours.</p>
                <p>Automatically queues affected titles for hydration.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hydration Queue Tab */}
      {activeTab === 'hydration' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hydration Queue</h2>
            
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
                      Attempts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Error
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.hydrationQueue.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'running' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.attempts}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.lastError || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => hydrateTitle(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Hydrate Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
