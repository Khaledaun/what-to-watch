"use client";
import { useState, useEffect } from 'react';

interface SettingsData {
  // AI Tools - Multiple Providers
  openaiApiKey: string;
  grokApiKey: string;
  claudeApiKey: string;
  anthropicApiKey: string;
  contentGenerationEnabled: boolean;
  defaultAiProvider: 'openai' | 'grok' | 'claude';
  
  // AI Prompts
  contentGenerationPrompt: string;
  topicGenerationPrompt: string;
  seoOptimizationPrompt: string;
  
  // TMDB
  tmdbApiKey: string;
  siteRegionDefault: string;
  regionFallback: string;
  
  // Database
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  supabaseAnonKey: string;
  
  // Site Configuration
  siteBrandName: string;
  siteUrl: string;
  
  // Admin Auth
  nextauthSecret: string;
  nextauthUrl: string;
  
  // SEO & Analytics
  gaMeasurementId: string;
  googleSiteVerification: string;
  
  // Affiliate Partners
  amazonAssociateTag: string;
  cjPublisherId: string;
  flexoffersApiKey: string;
  
  // Monitoring
  sentryDsn: string;
  vercelAnalyticsId: string;
}

export function AdminSettings() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsData>({
    openaiApiKey: '',
    grokApiKey: '',
    claudeApiKey: '',
    anthropicApiKey: '',
    contentGenerationEnabled: false,
    defaultAiProvider: 'openai',
    contentGenerationPrompt: 'Generate engaging, SEO-optimized content about movies and TV shows...',
    topicGenerationPrompt: 'Create trending article topics for a movie recommendation website...',
    seoOptimizationPrompt: 'Optimize this content for search engines with proper keywords...',
    tmdbApiKey: '',
    siteRegionDefault: 'US',
    regionFallback: 'CA',
    supabaseUrl: '',
    supabaseServiceRoleKey: '',
    supabaseAnonKey: '',
    siteBrandName: 'What to Watch',
    siteUrl: 'http://localhost:3000',
    nextauthSecret: '',
    nextauthUrl: 'http://localhost:3000',
    gaMeasurementId: '',
    googleSiteVerification: '',
    amazonAssociateTag: '',
    cjPublisherId: '',
    flexoffersApiKey: '',
    sentryDsn: '',
    vercelAnalyticsId: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load current settings
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({
            ...prev,
            ...data.settings,
            // Ensure boolean values are properly set
            contentGenerationEnabled: data.settings.contentGenerationEnabled === true || data.settings.contentGenerationEnabled === 'true',
          }));
        } else {
          console.error('Failed to fetch settings');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: data.message || 'Settings saved successfully!' });
        setLastUpdated(new Date().toISOString());
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to save settings. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: keyof SettingsData, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings & Access</h1>
            <p className="text-gray-600 mt-2">Configure API keys, system settings, and user access</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-900">
                {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Tools Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-3 text-2xl">🤖</span>
              AI Tools Configuration
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${settings.contentGenerationEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">
                {settings.contentGenerationEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Default AI Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default AI Provider
              </label>
              <select
                value={settings.defaultAiProvider}
                onChange={(e) => handleInputChange('defaultAiProvider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="openai">OpenAI GPT</option>
                <option value="grok">Grok (x.ai)</option>
                <option value="claude">Claude (Anthropic)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose which AI provider to use for content generation
              </p>
            </div>

            {/* API Keys */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) => handleInputChange('openaiApiKey', e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grok API Key
                </label>
                <input
                  type="password"
                  value={settings.grokApiKey}
                  onChange={(e) => handleInputChange('grokApiKey', e.target.value)}
                  placeholder="grok-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claude API Key
                </label>
                <input
                  type="password"
                  value={settings.claudeApiKey}
                  onChange={(e) => handleInputChange('claudeApiKey', e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  value={settings.anthropicApiKey}
                  onChange={(e) => handleInputChange('anthropicApiKey', e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* AI Prompts */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-900">AI Prompts</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Generation Prompt
                </label>
                <textarea
                  value={settings.contentGenerationPrompt}
                  onChange={(e) => handleInputChange('contentGenerationPrompt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the prompt template for content generation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic Generation Prompt
                </label>
                <textarea
                  value={settings.topicGenerationPrompt}
                  onChange={(e) => handleInputChange('topicGenerationPrompt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the prompt template for topic generation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Optimization Prompt
                </label>
                <textarea
                  value={settings.seoOptimizationPrompt}
                  onChange={(e) => handleInputChange('seoOptimizationPrompt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the prompt template for SEO optimization..."
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="contentGenerationEnabled"
                checked={settings.contentGenerationEnabled}
                onChange={(e) => handleInputChange('contentGenerationEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="contentGenerationEnabled" className="ml-2 block text-sm text-gray-700">
                Enable AI Content Generation
              </label>
            </div>
          </div>
        </div>

        {/* TMDB Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-3 text-2xl">🎬</span>
              TMDB Configuration
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${settings.tmdbApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {settings.tmdbApiKey ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TMDB API Key
              </label>
              <input
                type="password"
                value={settings.tmdbApiKey}
                onChange={(e) => handleInputChange('tmdbApiKey', e.target.value)}
                placeholder="Enter your TMDB API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Region
                </label>
                <select
                  value={settings.siteRegionDefault}
                  onChange={(e) => handleInputChange('siteRegionDefault', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="US">US</option>
                  <option value="CA">CA</option>
                  <option value="GB">GB</option>
                  <option value="AU">AU</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fallback Region
                </label>
                <select
                  value={settings.regionFallback}
                  onChange={(e) => handleInputChange('regionFallback', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CA">CA</option>
                  <option value="US">US</option>
                  <option value="GB">GB</option>
                  <option value="AU">AU</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🗄️</span>
            Database Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase URL
              </label>
              <input
                type="url"
                value={settings.supabaseUrl}
                onChange={(e) => handleInputChange('supabaseUrl', e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase Service Role Key
              </label>
              <input
                type="password"
                value={settings.supabaseServiceRoleKey}
                onChange={(e) => handleInputChange('supabaseServiceRoleKey', e.target.value)}
                placeholder="Enter your Supabase service role key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase Anon Key
              </label>
              <input
                type="password"
                value={settings.supabaseAnonKey}
                onChange={(e) => handleInputChange('supabaseAnonKey', e.target.value)}
                placeholder="Enter your Supabase anon key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Site Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🌐</span>
            Site Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={settings.siteBrandName}
                onChange={(e) => handleInputChange('siteBrandName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site URL
              </label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SEO & Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            SEO & Analytics
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={settings.gaMeasurementId}
                onChange={(e) => handleInputChange('gaMeasurementId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Site Verification
              </label>
              <input
                type="text"
                value={settings.googleSiteVerification}
                onChange={(e) => handleInputChange('googleSiteVerification', e.target.value)}
                placeholder="Enter your Google verification code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Affiliate Partners */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💰</span>
            Affiliate Partners
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amazon Associate Tag
              </label>
              <input
                type="text"
                value={settings.amazonAssociateTag}
                onChange={(e) => handleInputChange('amazonAssociateTag', e.target.value)}
                placeholder="your-associate-tag"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Junction Publisher ID
              </label>
              <input
                type="text"
                value={settings.cjPublisherId}
                onChange={(e) => handleInputChange('cjPublisherId', e.target.value)}
                placeholder="Enter your CJ Publisher ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FlexOffers API Key
              </label>
              <input
                type="password"
                value={settings.flexoffersApiKey}
                onChange={(e) => handleInputChange('flexoffersApiKey', e.target.value)}
                placeholder="Enter your FlexOffers API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* API Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔍</span>
          API Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">OpenAI</div>
              <div className="text-sm text-gray-500">GPT Models</div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              settings.openaiApiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {settings.openaiApiKey ? 'Connected' : 'Not Configured'}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Grok AI</div>
              <div className="text-sm text-gray-500">x.ai Models</div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              settings.grokApiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {settings.grokApiKey ? 'Connected' : 'Not Configured'}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Claude</div>
              <div className="text-sm text-gray-500">Anthropic AI</div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              settings.claudeApiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {settings.claudeApiKey ? 'Connected' : 'Not Configured'}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">TMDB</div>
              <div className="text-sm text-gray-500">Movie Database</div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              settings.tmdbApiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {settings.tmdbApiKey ? 'Connected' : 'Not Configured'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
