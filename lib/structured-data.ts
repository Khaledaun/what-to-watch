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
    }
  };
}

