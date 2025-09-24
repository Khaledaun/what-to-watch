import { BlogMeta } from './blog';

export function generateSoftwareApplicationLD() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "What to Watch Tonight",
    "description": "Get personalized movie and TV show recommendations based on your streaming platforms, mood, and time available.",
    "url": "https://whattowatch.com",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "author": {
      "@type": "Organization",
      "name": "What to Watch"
    },
    "publisher": {
      "@type": "Organization",
      "name": "What to Watch"
    }
  };
}

export function generateArticleLD(post: BlogMeta, content: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": "What to Watch"
    },
    "publisher": {
      "@type": "Organization",
      "name": "What to Watch",
      "logo": {
        "@type": "ImageObject",
        "url": "https://whattowatch.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://whattowatch.com/blog/${post.slug}`
    },
    "keywords": post.tags?.join(", "),
    "articleSection": "Entertainment",
    "wordCount": content.split(' ').length
  };
}

export function generateBreadcrumbLD(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://whattowatch.com${item.url}`
    }))
  };
}

export function generateFAQPageLD(faqItems: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

export function generateWebSiteLD() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "What to Watch Tonight",
    "description": "Get personalized movie and TV show recommendations based on your streaming platforms, mood, and time available.",
    "url": "https://whattowatch.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://whattowatch.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "What to Watch Tonight",
      "logo": {
        "@type": "ImageObject",
        "url": "https://whattowatch.com/logo.png"
      }
    },
    "sameAs": [
      "https://twitter.com/whattowatch",
      "https://facebook.com/whattowatch"
    ]
  };
}

// New: Movie structured data
export function generateMovieLD(movie: {
  title: string;
  description: string;
  releaseDate: string;
  duration: string;
  rating: number;
  genre: string[];
  image: string;
  url: string;
  streamingPlatforms: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.description,
    "datePublished": movie.releaseDate,
    "duration": movie.duration,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": movie.rating,
      "bestRating": "10",
      "worstRating": "1"
    },
    "genre": movie.genre,
    "image": movie.image,
    "url": movie.url,
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": "Streaming Platforms"
      }
    },
    "availableOn": movie.streamingPlatforms.map(platform => ({
      "@type": "Service",
      "name": platform,
      "provider": {
        "@type": "Organization",
        "name": platform
      }
    }))
  };
}

// New: TV Series structured data
export function generateTVSeriesLD(series: {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  rating: number;
  genre: string[];
  image: string;
  url: string;
  streamingPlatforms: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": series.title,
    "description": series.description,
    "startDate": series.startDate,
    "endDate": series.endDate,
    "numberOfSeasons": series.numberOfSeasons,
    "numberOfEpisodes": series.numberOfEpisodes,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": series.rating,
      "bestRating": "10",
      "worstRating": "1"
    },
    "genre": series.genre,
    "image": series.image,
    "url": series.url,
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": "Streaming Platforms"
      }
    },
    "availableOn": series.streamingPlatforms.map(platform => ({
      "@type": "Service",
      "name": platform,
      "provider": {
        "@type": "Organization",
        "name": platform
      }
    }))
  };
}

// New: Collection/List structured data
export function generateCollectionLD(collection: {
  name: string;
  description: string;
  items: Array<{
    name: string;
    url: string;
    type: 'Movie' | 'TVSeries';
  }>;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": collection.name,
    "description": collection.description,
    "url": collection.url,
    "mainEntity": {
      "@type": "ItemList",
      "name": collection.name,
      "description": collection.description,
      "numberOfItems": collection.items.length,
      "itemListElement": collection.items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": item.type,
          "name": item.name,
          "url": item.url
        }
      }))
    }
  };
}

