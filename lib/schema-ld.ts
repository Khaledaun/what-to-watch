interface FAQItem {
  question: string
  answer: string
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function softwareApplicationLD() {
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
  }
}

export function faqLD(faqItems: FAQItem[]) {
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
  }
}

export function breadcrumbLD(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://whattowatch.com${item.url}`
    }))
  }
}

export function movieLD(recommendation: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": recommendation.title,
    "description": recommendation.whyOneLiner,
    "image": recommendation.posterUrl,
    "datePublished": recommendation.year ? `${recommendation.year}-01-01` : undefined,
    "duration": recommendation.runtimeMinutes ? `PT${recommendation.runtimeMinutes}M` : undefined,
    "contentRating": recommendation.maturity,
    "aggregateRating": recommendation.ratings?.imdb ? {
      "@type": "AggregateRating",
      "ratingValue": recommendation.ratings.imdb,
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": "1000"
    } : undefined,
    "offers": recommendation.availability.providers.map((provider: string) => ({
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": provider
      }
    }))
  }
}

export function tvSeriesLD(recommendation: any) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": recommendation.title,
    "description": recommendation.whyOneLiner,
    "image": recommendation.posterUrl,
    "datePublished": recommendation.year ? `${recommendation.year}-01-01` : undefined,
    "numberOfSeasons": recommendation.seasonCount,
    "contentRating": recommendation.maturity,
    "aggregateRating": recommendation.ratings?.imdb ? {
      "@type": "AggregateRating",
      "ratingValue": recommendation.ratings.imdb,
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": "1000"
    } : undefined,
    "offers": recommendation.availability.providers.map((provider: string) => ({
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": provider
      }
    }))
  }
}

export function webSiteLD() {
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
    }
  }
}

