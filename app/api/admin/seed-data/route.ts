import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Sample movie data for testing
const sampleMovies = [
  {
    tmdb_id: 278,
    type: 'movie' as const,
    slug: 'the-shawshank-redemption-1994',
    title: 'The Shawshank Redemption',
    original_title: 'The Shawshank Redemption',
    overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Ellis "Red" Redding -- for his integrity and unquenchable sense of hope.',
    release_date: '1994-09-23',
    popularity: 85.5,
    vote_average: 8.7,
    vote_count: 25000,
    adult: false,
    genres: [18, 80],
    original_language: 'en',
  },
  {
    tmdb_id: 238,
    type: 'movie' as const,
    slug: 'the-godfather-1972',
    title: 'The Godfather',
    original_title: 'The Godfather',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.',
    release_date: '1972-03-14',
    popularity: 90.2,
    vote_average: 8.7,
    vote_count: 18000,
    adult: false,
    genres: [18, 80],
    original_language: 'en',
  },
  {
    tmdb_id: 424,
    type: 'movie' as const,
    slug: 'schindlers-list-1993',
    title: "Schindler's List",
    original_title: "Schindler's List",
    overview: 'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.',
    release_date: '1993-12-15',
    popularity: 75.8,
    vote_average: 8.6,
    vote_count: 15000,
    adult: false,
    genres: [18, 36, 10752],
    original_language: 'en',
  },
  {
    tmdb_id: 389,
    type: 'movie' as const,
    slug: '12-angry-men-1957',
    title: '12 Angry Men',
    original_title: '12 Angry Men',
    overview: 'The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors\' prejudices and preconceptions about the trial, the accused, and each other.',
    release_date: '1957-04-10',
    popularity: 65.3,
    vote_average: 8.5,
    vote_count: 8000,
    adult: false,
    genres: [18, 80],
    original_language: 'en',
  },
  {
    tmdb_id: 129,
    type: 'movie' as const,
    slug: 'spirited-away-2001',
    title: 'Spirited Away',
    original_title: '千と千尋の神隠し',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    release_date: '2001-07-20',
    popularity: 80.1,
    vote_average: 8.5,
    vote_count: 12000,
    adult: false,
    genres: [16, 10751, 14],
    original_language: 'ja',
  },
  {
    tmdb_id: 13,
    type: 'movie' as const,
    slug: 'forrest-gump-1994',
    title: 'Forrest Gump',
    original_title: 'Forrest Gump',
    overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.',
    release_date: '1994-06-23',
    popularity: 88.7,
    vote_average: 8.5,
    vote_count: 22000,
    adult: false,
    genres: [35, 18, 10749],
    original_language: 'en',
  },
  {
    tmdb_id: 680,
    type: 'movie' as const,
    slug: 'pulp-fiction-1994',
    title: 'Pulp Fiction',
    original_title: 'Pulp Fiction',
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.',
    release_date: '1994-09-10',
    popularity: 82.4,
    vote_average: 8.5,
    vote_count: 20000,
    adult: false,
    genres: [80, 18],
    original_language: 'en',
  },
  {
    tmdb_id: 155,
    type: 'movie' as const,
    slug: 'the-dark-knight-2008',
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    release_date: '2008-07-16',
    popularity: 95.2,
    vote_average: 8.5,
    vote_count: 30000,
    adult: false,
    genres: [28, 80, 18, 53],
    original_language: 'en',
  },
  {
    tmdb_id: 497,
    type: 'movie' as const,
    slug: 'the-green-mile-1999',
    title: 'The Green Mile',
    original_title: 'The Green Mile',
    overview: 'A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people\'s ailments. When the cell block\'s head guard, Paul Edgecomb, recognizes Coffey\'s miraculous gift, he tries desperately to help stave off the condemned man\'s execution.',
    release_date: '1999-12-10',
    popularity: 78.9,
    vote_average: 8.5,
    vote_count: 18000,
    adult: false,
    genres: [18, 14, 80],
    original_language: 'en',
  },
  {
    tmdb_id: 372058,
    type: 'movie' as const,
    slug: 'your-name-2016',
    title: 'Your Name.',
    original_title: '君の名は。',
    overview: 'High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki\'s body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.',
    release_date: '2016-08-26',
    popularity: 70.5,
    vote_average: 8.5,
    vote_count: 10000,
    adult: false,
    genres: [16, 18, 14, 10749],
    original_language: 'ja',
  }
];

const sampleContent = [
  {
    kind: 'article' as const,
    title_id: null,
    slug: 'top-10-movies-of-all-time',
    country: 'US',
    language: 'en-US',
    status: 'published' as const,
    published_at: new Date().toISOString(),
    seo_jsonld: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Top 10 Movies of All Time",
      "description": "Discover the greatest movies ever made according to critics and audiences worldwide."
    },
    body_md: `# Top 10 Movies of All Time

Discover the greatest movies ever made according to critics and audiences worldwide.

## 1. The Shawshank Redemption (1994)
A timeless tale of hope and friendship in the most unlikely of places.

## 2. The Godfather (1972)
The definitive crime saga that redefined cinema.

## 3. Schindler's List (1993)
A powerful story of courage and humanity during the darkest times.

## 4. 12 Angry Men (1957)
A masterclass in tension and character development.

## 5. Spirited Away (2001)
Miyazaki's magical masterpiece that transcends age and culture.

## 6. Forrest Gump (1994)
A heartwarming journey through American history.

## 7. Pulp Fiction (1994)
Tarantino's revolutionary take on storytelling.

## 8. The Dark Knight (2008)
The superhero movie that changed everything.

## 9. The Green Mile (1999)
A supernatural tale of redemption and miracles.

## 10. Your Name. (2016)
A beautiful anime about love, time, and connection.

These films represent the pinnacle of cinematic achievement and continue to inspire audiences worldwide.`,
    created_by: 'system',
    updated_by: 'system',
  },
  {
    kind: 'howto' as const,
    title_id: null,
    slug: 'how-to-watch-movies-online',
    country: 'US',
    language: 'en-US',
    status: 'published' as const,
    published_at: new Date().toISOString(),
    seo_jsonld: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Watch Movies Online",
      "description": "Complete guide to streaming movies online legally and safely."
    },
    body_md: `# How to Watch Movies Online

A complete guide to streaming movies online legally and safely.

## Popular Streaming Services

### Netflix
- Largest selection of movies and TV shows
- Original content and licensed films
- Multiple subscription tiers available

### Amazon Prime Video
- Included with Prime membership
- Extensive movie library
- Option to rent or buy additional content

### Disney+
- Family-friendly content
- Marvel, Star Wars, and Disney classics
- High-quality original series

### Hulu
- Great for TV shows and recent movies
- Live TV options available
- Ad-supported and ad-free plans

### Max (HBO Max)
- Premium content and HBO originals
- High-quality films and series
- Theatrical releases available

### Apple TV+
- Curated selection of high-quality content
- Original Apple productions
- Available on all Apple devices

## Tips for Finding Movies

1. **Use our recommendation engine** - Get personalized suggestions
2. **Check multiple services** - Movies rotate between platforms
3. **Look for free trials** - Test services before committing
4. **Consider bundle deals** - Save money with package subscriptions
5. **Check your local library** - Many offer free streaming services

## Legal and Safe Streaming

- Always use official streaming services
- Avoid pirated content
- Check regional availability
- Use VPNs responsibly and legally
- Support creators by paying for content

Start your movie journey today with our personalized recommendations!`,
    created_by: 'system',
    updated_by: 'system',
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert sample movies
    const { error: moviesError } = await db.ensureClient()
      .from('titles')
      .upsert(sampleMovies, { 
        onConflict: 'tmdb_id',
        ignoreDuplicates: false 
      });

    if (moviesError) {
      console.error('❌ Error seeding movies:', moviesError);
      return NextResponse.json({
        error: 'Failed to seed movies',
        message: moviesError.message
      }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${sampleMovies.length} movies!`);

    // Insert sample content
    const { error: contentError } = await db.ensureClient()
      .from('content_items')
      .upsert(sampleContent, { 
        onConflict: 'slug,country,language',
        ignoreDuplicates: false 
      });

    if (contentError) {
      console.error('❌ Error seeding content:', contentError);
      return NextResponse.json({
        error: 'Failed to seed content',
        message: contentError.message
      }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${sampleContent.length} content items!`);

    // Get final counts
    const [moviesResult, contentResult] = await Promise.all([
      db.ensureClient().from('titles').select('id').eq('type', 'movie'),
      db.ensureClient().from('content_items').select('id')
    ]);

    const movieCount = moviesResult.data?.length || 0;
    const contentCount = contentResult.data?.length || 0;

    return NextResponse.json({
      message: 'Database seeded successfully!',
      stats: {
        movies: movieCount,
        content: contentCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return NextResponse.json({
      error: 'Failed to seed database',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current database stats
    const [moviesResult, contentResult] = await Promise.all([
      db.ensureClient().from('titles').select('id').eq('type', 'movie'),
      db.ensureClient().from('content_items').select('id')
    ]);

    const movieCount = moviesResult.data?.length || 0;
    const contentCount = contentResult.data?.length || 0;

    return NextResponse.json({
      stats: {
        movies: movieCount,
        content: contentCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error getting database stats:', error);
    return NextResponse.json({
      error: 'Failed to get database stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
