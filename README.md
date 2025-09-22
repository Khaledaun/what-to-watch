# What to Watch Tonight

A production-ready Next.js 14 application that provides personalized movie and TV show recommendations based on streaming platforms, mood, time available, and audience preferences.

## Features

- 🎬 **Personalized Recommendations**: AI-powered suggestions based on your preferences
- 📱 **Multi-Platform Support**: Netflix, Prime Video, Disney+, Hulu, Max, Apple TV+
- 🎭 **Mood-Based Filtering**: Find content that matches your current mood
- ⏰ **Time-Aware**: Recommendations based on your available viewing time
- 👨‍👩‍👧‍👦 **Audience-Appropriate**: Family-friendly filtering options
- 🚀 **SEO-Optimized**: Clean URLs, structured data, and meta tags
- ⚡ **Performance-First**: Edge runtime, caching, and optimized images
- 📊 **Analytics Ready**: GA4 integration with custom events

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Source**: TMDB API
- **Caching**: Redis/Upstash (with in-memory fallback)
- **Testing**: Vitest + Testing Library
- **Analytics**: Google Analytics 4

## Quick Start

### Prerequisites

- Node.js 18+ 
- TMDB API key (required)
- Redis instance (optional, falls back to in-memory cache)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd what-to-watch
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   # Required
   TMDB_API_KEY=your_tmdb_api_key_here
   
   # Optional
   OMDB_API_KEY=your_omdb_api_key_here
   REDIS_URL=your_redis_url_here
   REDIS_TOKEN=your_redis_token_here
   
   # App Configuration
   ORIGIN=https://localhost:3000
   DEFAULT_COUNTRIES=US,CA
   CACHE_TTL_SECONDS=900
   ```

3. **Get a TMDB API key:**
   - Visit [TMDB API](https://www.themoviedb.org/settings/api)
   - Create an account and request an API key
   - Add it to your `.env.local` file

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Performance
npm run lighthouse   # Run Lighthouse audit
```

## Project Structure

```
what-to-watch/
├── app/                    # Next.js App Router
│   ├── api/recommend/      # API routes
│   ├── what-to-watch/      # Programmatic pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.txt          # Robots.txt
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── Filters.tsx         # Filter component
│   ├── ResultCard.tsx      # Recommendation card
│   └── ...
├── lib/                    # Core logic
│   ├── env.ts              # Environment validation
│   ├── tmdb.ts             # TMDB API client
│   ├── cache.ts            # Caching layer
│   ├── scoring.ts          # Recommendation scoring
│   ├── availability.ts     # Platform availability
│   └── ...
├── tests/                  # Test files
│   ├── unit/               # Unit tests
│   └── e2e/                # End-to-end tests
└── public/                 # Static assets
```

## API Endpoints

### GET/POST `/api/recommend`

Returns personalized movie and TV show recommendations.

**Parameters:**
- `countries` (array): Supported countries (default: ['US'])
- `platforms` (array): Streaming platforms (required)
- `moods` (array, optional): Mood preferences
- `timeBudget` (string, optional): Available time ('<45', '~90', '2h+')
- `audience` (string, optional): Target audience
- `type` (string, optional): Content type ('movie', 'series', 'either')
- `limit` (number, optional): Number of recommendations (default: 3)

**Response:**
```json
{
  "primary": [...],      // Main recommendations
  "alternates": [...],   // Alternative options
  "traceId": "...",      // Request tracking ID
  "cached": false        // Whether result was cached
}
```

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - `TMDB_API_KEY`
   - `REDIS_URL` (optional)
   - `ORIGIN` (your domain)

3. **Deploy:**
   ```bash
   npm run build
   ```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Adding New Features

### New Streaming Platform

1. **Add platform to constants:**
   ```typescript
   // lib/constants.ts
   export const PLATFORMS = ['netflix', 'prime', 'new-platform'] as const
   ```

2. **Update provider mapping:**
   ```typescript
   // lib/availability.ts
   const PROVIDER_MAPPING = {
     // ... existing mappings
     NEW_PROVIDER_ID: 'new-platform',
   }
   ```

3. **Add platform URLs:**
   ```typescript
   // lib/availability.ts
   const PLATFORM_URLS = {
     // ... existing URLs
     'new-platform': {
       'US': 'https://new-platform.com/',
       'CA': 'https://new-platform.ca/',
     },
   }
   ```

### New Mood Category

1. **Add mood to constants:**
   ```typescript
   // lib/constants.ts
   export const MOODS = ['feel-good', 'intense', 'new-mood'] as const
   ```

2. **Configure mood settings:**
   ```typescript
   // lib/moods.ts
   export const MOOD_CONFIGS = {
     // ... existing configs
     'new-mood': {
       genres: [28, 35], // TMDB genre IDs
       includes: ['keyword1', 'keyword2'],
       excludes: ['keyword3'],
       maturity: 'all',
     },
   }
   ```

### New Route

1. **Create page file:**
   ```typescript
   // app/what-to-watch/new-route/page.tsx
   export const metadata = {
     title: 'New Route - What to Watch',
     description: 'Description for new route',
   }
   
   export default function NewRoute() {
     return <div>New route content</div>
   }
   ```

2. **Update sitemap:**
   ```typescript
   // app/sitemap.ts
   const newRoutes = [
     {
       url: `${baseUrl}/what-to-watch/new-route`,
       lastModified: currentDate,
       changeFrequency: 'weekly',
       priority: 0.7,
     },
   ]
   ```

## SEO Checklist

Before publishing, ensure:

- [ ] All pages have unique, descriptive titles (≤60 chars)
- [ ] Meta descriptions are optimized (≤155 chars)
- [ ] OpenGraph and Twitter cards are configured
- [ ] Structured data (JSON-LD) is implemented
- [ ] Sitemap includes all routes
- [ ] Robots.txt allows crawling
- [ ] Images have alt text and proper dimensions
- [ ] Page load times are optimized
- [ ] Mobile responsiveness is tested

## Performance Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **INP (Interaction to Next Paint)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Bundle Size**: < 150kb JavaScript
- **Lighthouse Scores**: ≥90 for Performance, SEO, Best Practices

## Analytics Events

The app tracks the following events:

- `recommend_shown`: When recommendations are displayed
- `play_now_click`: When user clicks "Play Now"
- `trailer_click`: When user clicks "Trailer"
- `hide_click`: When user hides a recommendation
- `filter_change`: When user changes filters
- `page_view`: Standard page view tracking

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Attribution

- **TMDB API**: Data provided by [The Movie Database](https://www.themoviedb.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS.

