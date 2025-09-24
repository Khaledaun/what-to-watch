import { Metadata } from 'next'

// SEO Configuration
export const SEO_CONFIG = {
  siteName: 'What to Watch Tonight',
  siteUrl: 'https://whattowatch.com',
  defaultTitle: 'What to Watch Tonight - Movie & TV Recommendations',
  defaultDescription: 'Get personalized movie and TV show recommendations based on your streaming platforms, mood, and time available. Find the perfect show to watch tonight.',
  defaultKeywords: 'movies, TV shows, recommendations, streaming, Netflix, Prime Video, Disney+, Hulu, Max, Apple TV+, what to watch, movie recommendations, TV recommendations',
  author: 'What to Watch',
  twitterHandle: '@whattowatch',
  ogImage: '/og-image.jpg',
  favicon: '/favicon.ico',
}

// Generate metadata for different page types
export function generatePageMetadata({
  title,
  description,
  keywords,
  path,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  image,
}: {
  title?: string
  description?: string
  keywords?: string
  path: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  image?: string
}): Metadata {
  const fullTitle = title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle
  const fullDescription = description || SEO_CONFIG.defaultDescription
  const fullKeywords = keywords ? `${SEO_CONFIG.defaultKeywords}, ${keywords}` : SEO_CONFIG.defaultKeywords
  const fullImage = image || SEO_CONFIG.ogImage
  const fullUrl = `${SEO_CONFIG.siteUrl}${path}`

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: [{ name: SEO_CONFIG.author }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.author,
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: SEO_CONFIG.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  }
}

// Generate metadata for movie/TV show pages
export function generateMovieMetadata(movie: {
  title: string
  year: number
  type: 'movie' | 'series'
  overview: string
  genres: string[]
  rating: number
  runtime?: number
  posterUrl?: string
}): Metadata {
  const title = `${movie.title} (${movie.year}) - ${movie.type === 'movie' ? 'Movie' : 'TV Show'} Recommendations`
  const description = `${movie.overview.substring(0, 150)}... Find where to watch ${movie.title} and get similar recommendations.`
  const keywords = `${movie.title}, ${movie.year}, ${movie.type}, ${movie.genres.join(', ')}, movie recommendations, TV show recommendations, where to watch`

  return generatePageMetadata({
    title,
    description,
    keywords,
    path: `/movie/${movie.title.toLowerCase().replace(/\s+/g, '-')}-${movie.year}`,
    type: 'article',
    image: movie.posterUrl,
  })
}

// Generate metadata for platform pages
export function generatePlatformMetadata(platform: string): Metadata {
  const platformName = platform.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const title = `What to Watch on ${platformName} Tonight - ${platformName} Recommendations`
  const description = `Find the best movies and TV shows to watch on ${platformName} tonight. Get personalized ${platformName} recommendations based on your mood and time available.`
  const keywords = `${platformName}, ${platformName} movies, ${platformName} TV shows, ${platformName} recommendations, what to watch on ${platformName}`

  return generatePageMetadata({
    title,
    description,
    keywords,
    path: `/what-to-watch/on-${platform}`,
  })
}

// Generate metadata for mood pages
export function generateMoodMetadata(mood: string): Metadata {
  const moodName = mood.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const title = `${moodName} Movies & TV Shows - ${moodName} Recommendations`
  const description = `Find the best ${moodName.toLowerCase()} movies and TV shows to watch tonight. Get personalized ${moodName.toLowerCase()} recommendations based on your streaming platforms.`
  const keywords = `${moodName.toLowerCase()} movies, ${moodName.toLowerCase()} TV shows, ${moodName.toLowerCase()} recommendations, ${moodName.toLowerCase()} entertainment`

  return generatePageMetadata({
    title,
    description,
    keywords,
    path: `/what-to-watch/by-mood/${mood}`,
  })
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SEO_CONFIG.siteUrl}${item.url}`
    }))
  }
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// Generate movie/TV show structured data
export function generateMovieStructuredData(movie: {
  title: string
  year: number
  type: 'movie' | 'series'
  overview: string
  rating: number
  genres: string[]
  runtime?: number
  posterUrl?: string
  trailerUrl?: string
}) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": movie.type === 'movie' ? "Movie" : "TVSeries",
    "name": movie.title,
    "description": movie.overview,
    "datePublished": `${movie.year}-01-01`,
    "genre": movie.genres,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": movie.rating,
      "bestRating": 10,
      "worstRating": 0
    },
    "image": movie.posterUrl,
    "url": `${SEO_CONFIG.siteUrl}/movie/${movie.title.toLowerCase().replace(/\s+/g, '-')}-${movie.year}`
  }

  if (movie.type === 'movie' && movie.runtime) {
    return {
      ...baseData,
      "duration": `PT${movie.runtime}M`
    }
  }

  return baseData
}

// SEO utility functions
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function generateKeywords(baseKeywords: string[], additionalKeywords: string[]): string {
  return [...baseKeywords, ...additionalKeywords].join(', ')
}
