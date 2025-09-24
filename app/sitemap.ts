import { MetadataRoute } from 'next'
import { PLATFORMS, MOODS } from '@/lib/constants'
import { getAllPosts } from '@/lib/blog'
import { db } from '@/lib/database'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://whattowatch.com'
  const currentDate = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies/trending`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies/top-rated`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies/recent`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/what-to-watch/tonight`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/what-to-watch/under-90-minutes`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/what-to-watch/family-night`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Platform-specific routes
  const platformRoutes: MetadataRoute.Sitemap = PLATFORMS.map(platform => ({
    url: `${baseUrl}/what-to-watch/on-${platform}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Mood-specific routes
  const moodRoutes: MetadataRoute.Sitemap = MOODS.map(mood => ({
    url: `${baseUrl}/what-to-watch/by-mood/${mood}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Blog post routes
  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Movie routes - fetch from database
  let movieRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: movies } = await db.ensureClient()
      .from('titles')
      .select('slug, updated_at')
      .limit(1000) // Limit to prevent sitemap from being too large
    
    movieRoutes = movies?.map((movie: any) => ({
      url: `${baseUrl}/movie/${movie.slug}`,
      lastModified: movie.updated_at ? new Date(movie.updated_at) : currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })) || []
  } catch (error) {
    console.error('Error fetching movies for sitemap:', error)
  }

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = [
    'action', 'comedy', 'drama', 'romance', 'thriller', 'sci-fi', 'horror', 'family', 'documentary'
  ].map(category => ({
    url: `${baseUrl}/movies/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    ...staticRoutes, 
    ...platformRoutes, 
    ...moodRoutes, 
    ...blogRoutes, 
    ...movieRoutes,
    ...categoryRoutes
  ]
}
