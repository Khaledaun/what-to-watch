import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Extended content with proper metadata
const extendedContent = [
  {
    kind: 'article' as const,
    title_id: null,
    slug: 'best-netflix-movies-2024',
    country: 'US',
    language: 'en-US',
    status: 'published' as const,
    published_at: new Date().toISOString(),
    seo_jsonld: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Best Netflix Movies 2024: Top Picks for Every Mood",
      "description": "Discover the best Netflix movies of 2024 with our curated list of top-rated films across all genres.",
      "keywords": ["netflix movies 2024", "best netflix films", "top netflix content", "netflix recommendations"],
      "longtails": [
        "best netflix movies 2024 to watch",
        "top rated netflix films this year",
        "netflix movie recommendations 2024",
        "what to watch on netflix 2024"
      ]
    },
    body_md: `# Best Netflix Movies 2024: Top Picks for Every Mood

Discover the best Netflix movies of 2024 with our curated list of top-rated films across all genres.

## Action & Adventure
- **Extraction 2**: High-octane action with Chris Hemsworth
- **The Mother**: Jennifer Lopez in a gripping thriller
- **Fast X**: The latest installment in the Fast & Furious franchise

## Drama & Romance
- **The Diplomat**: Political thriller with Keri Russell
- **Beef**: Dark comedy series that's a must-watch
- **Queen Charlotte**: Bridgerton prequel with stunning visuals

## Comedy & Family
- **Wednesday**: Tim Burton's Addams Family spin-off
- **Glass Onion**: Knives Out sequel with an all-star cast
- **The Night Agent**: High-stakes political thriller

## Horror & Thriller
- **The Watcher**: Based on true events, this series will keep you on edge
- **You**: Season 4 brings more psychological thrills
- **The Sandman**: Neil Gaiman's epic fantasy adaptation

## International Hits
- **Squid Game**: Korean survival drama that took the world by storm
- **Money Heist**: Spanish heist series with complex characters
- **Dark**: German sci-fi thriller with mind-bending twists

## Documentaries
- **The Tinder Swindler**: True crime documentary about online dating scams
- **Making a Murderer**: In-depth look at the Steven Avery case
- **Tiger King**: Wild documentary about big cat owners

## Why These Movies Matter

These selections represent the best of what Netflix has to offer in 2024, combining critical acclaim with audience appeal. Each film and series has been chosen for its quality, entertainment value, and cultural impact.

## How to Choose Your Next Watch

1. **Consider your mood**: Action for excitement, drama for depth, comedy for laughs
2. **Check ratings**: Look for high IMDb and Rotten Tomatoes scores
3. **Read reviews**: Get insights from critics and viewers
4. **Try something new**: Don't be afraid to explore different genres

Start your Netflix journey today with these top-rated selections!`,
    created_by: 'system',
    updated_by: 'system'
  },
  {
    kind: 'howto' as const,
    title_id: null,
    slug: 'how-to-choose-perfect-movie-night',
    country: 'US',
    language: 'en-US',
    status: 'published' as const,
    published_at: new Date().toISOString(),
    seo_jsonld: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Choose the Perfect Movie for Your Night",
      "description": "Learn how to select the ideal movie for any occasion with our comprehensive guide to movie selection.",
      "keywords": ["how to choose movie", "movie selection guide", "perfect movie night", "movie recommendations"],
      "longtails": [
        "how to pick the right movie for tonight",
        "movie selection tips for couples",
        "how to choose family movie night",
        "best way to pick a movie to watch"
      ]
    },
    body_md: `# How to Choose the Perfect Movie for Your Night

Learn how to select the ideal movie for any occasion with our comprehensive guide to movie selection.

## Step 1: Consider Your Audience

### Solo Viewing
- Choose genres you personally enjoy
- Pick movies with complex plots or character development
- Consider foreign films or documentaries
- Don't worry about mainstream appeal

### Date Night
- Romantic comedies or light dramas work well
- Avoid overly violent or disturbing content
- Consider movies with beautiful cinematography
- Choose films that spark conversation

### Family Movie Night
- Look for age-appropriate content
- Consider animated films or family-friendly adventures
- Check ratings and content warnings
- Pick movies with positive messages

### Group Viewing
- Choose crowd-pleasers with broad appeal
- Consider comedies or action films
- Avoid overly long or complex plots
- Pick movies that are fun to watch together

## Step 2: Match Your Mood

### Feeling Stressed?
- **Comedies**: Light-hearted films to lift your spirits
- **Romantic Comedies**: Feel-good stories with happy endings
- **Animated Films**: Colorful, cheerful content

### Want Excitement?
- **Action Films**: High-energy, fast-paced entertainment
- **Thrillers**: Suspenseful stories that keep you guessing
- **Horror**: If you enjoy being scared

### Seeking Depth?
- **Dramas**: Character-driven stories with emotional depth
- **Documentaries**: Educational and thought-provoking content
- **Foreign Films**: Different perspectives and cultures

### Need Inspiration?
- **Biographical Films**: Stories of real people overcoming challenges
- **Sports Movies**: Underdog stories and triumph
- **Adventure Films**: Epic journeys and discovery

## Step 3: Consider Time Constraints

### Under 90 Minutes
- Look for shorter films or TV episodes
- Consider animated shorts or documentaries
- Choose movies with tight pacing

### 2+ Hours Available
- Epic films and franchises
- Complex dramas with character development
- Films with beautiful cinematography worth savoring

## Step 4: Check Availability

### Streaming Services
- Netflix: Wide variety, original content
- Amazon Prime: Mix of mainstream and indie films
- Disney+: Family-friendly and Marvel content
- Hulu: TV shows and recent releases
- HBO Max: Premium content and classics

### Free Options
- Public library digital collections
- Free streaming platforms
- Network TV and cable

## Step 5: Read Reviews and Ratings

### Professional Reviews
- Rotten Tomatoes: Critical consensus
- Metacritic: Weighted average scores
- IMDb: User ratings and reviews

### User Reviews
- Look for reviews from people with similar tastes
- Check for content warnings
- Consider the overall rating trend

## Step 6: Trust Your Instincts

- If a movie calls to you, give it a chance
- Don't overthink the decision
- Remember you can always stop and try something else
- Keep a list of movies you want to watch

## Pro Tips for Movie Selection

1. **Create a Watchlist**: Keep track of movies you want to see
2. **Try New Genres**: Expand your horizons occasionally
3. **Consider the Season**: Horror in October, romance in February
4. **Check the Weather**: Rainy days are perfect for long dramas
5. **Ask for Recommendations**: Friends and family know your tastes

## Common Mistakes to Avoid

- Choosing movies based solely on popularity
- Ignoring your mood and preferences
- Not considering your audience
- Overthinking the decision
- Sticking only to familiar genres

## Conclusion

The perfect movie choice depends on your mood, audience, available time, and personal preferences. Trust your instincts, be open to new experiences, and remember that the best movie is the one that brings you joy and entertainment.

Start your movie selection journey today and discover your next favorite film!`,
    created_by: 'system',
    updated_by: 'system'
  },
  {
    kind: 'article' as const,
    title_id: null,
    slug: 'romantic-movies-date-night',
    country: 'US',
    language: 'en-US',
    status: 'published' as const,
    published_at: new Date().toISOString(),
    seo_jsonld: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Best Romantic Movies for Date Night: Perfect Picks for Couples",
      "description": "Discover the best romantic movies perfect for date night with our curated list of love stories that will set the mood.",
      "keywords": ["romantic movies", "date night movies", "couples movies", "romance films"],
      "longtails": [
        "best romantic movies for date night",
        "romantic films for couples to watch",
        "date night movie recommendations",
        "romantic movies to watch with boyfriend"
      ]
    },
    body_md: `# Best Romantic Movies for Date Night: Perfect Picks for Couples

Discover the best romantic movies perfect for date night with our curated list of love stories that will set the mood.

## Classic Romance

### The Notebook (2004)
A timeless love story that spans decades, featuring Ryan Gosling and Rachel McAdams in one of cinema's most iconic romantic performances.

### Casablanca (1942)
Humphrey Bogart and Ingrid Bergman star in this classic tale of love and sacrifice during World War II.

### When Harry Met Sally (1989)
Billy Crystal and Meg Ryan explore the question of whether men and women can truly be friends in this witty romantic comedy.

## Modern Romance

### La La Land (2016)
Ryan Gosling and Emma Stone star in this musical romance about dreams, love, and the choices we make.

### The Fault in Our Stars (2014)
A touching story about two teenagers who fall in love while dealing with serious health issues.

### Crazy Rich Asians (2018)
A modern Cinderella story set in Singapore, featuring stunning visuals and a heartwarming love story.

## Romantic Comedies

### Pretty Woman (1990)
Julia Roberts and Richard Gere star in this modern fairy tale about a businessman and a prostitute.

### You've Got Mail (1998)
Tom Hanks and Meg Ryan star in this charming story about online romance in the early days of the internet.

### The Proposal (2009)
Sandra Bullock and Ryan Reynolds star in this hilarious fake engagement comedy.

## International Romance

### Amélie (2001)
A whimsical French film about a shy waitress who decides to help others find happiness.

### Before Sunrise (1995)
Ethan Hawke and Julie Delpy star in this intimate story about two strangers who meet on a train.

### In the Mood for Love (2000)
A beautiful Hong Kong film about two neighbors who suspect their spouses of having an affair.

## Why These Movies Work for Date Night

### Emotional Connection
These films create emotional intimacy and provide opportunities for meaningful conversation.

### Beautiful Cinematography
Stunning visuals create a romantic atmosphere and enhance the viewing experience.

### Memorable Moments
Iconic scenes and quotes that couples can reference and remember together.

### Universal Themes
Stories about love, sacrifice, and connection that resonate with all couples.

## Tips for the Perfect Romantic Movie Night

1. **Create the Right Atmosphere**: Dim the lights, light candles, and prepare cozy blankets
2. **Choose Comfortable Seating**: Make sure you can cuddle and be close together
3. **Prepare Snacks**: Have romantic treats like chocolate or wine ready
4. **Minimize Distractions**: Turn off phones and create a distraction-free environment
5. **Discuss Afterward**: Talk about the movie and what you both enjoyed

## Setting the Mood

### Lighting
- Use warm, soft lighting
- Consider string lights or candles
- Avoid harsh overhead lights

### Comfort
- Arrange comfortable seating
- Have blankets and pillows ready
- Ensure good temperature control

### Refreshments
- Prepare romantic snacks
- Have drinks ready
- Consider chocolate or other treats

## Conversation Starters

After watching, discuss:
- Which character you related to most
- Your favorite scene or quote
- What you would do in similar situations
- How the movie made you feel

## Conclusion

The perfect romantic movie for date night combines beautiful storytelling, emotional depth, and the ability to bring couples closer together. Whether you prefer classic romance, modern love stories, or romantic comedies, there's a perfect film for every couple.

Choose a movie that speaks to both of you, create the right atmosphere, and enjoy a magical evening together.`,
    created_by: 'system',
    updated_by: 'system'
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Starting content generation...');

    // Insert extended content
    const { error: contentError } = await db.ensureClient()
      .from('content_items')
      .upsert(extendedContent, { 
        onConflict: 'slug,country,language',
        ignoreDuplicates: false 
      });

    if (contentError) {
      console.error('❌ Error generating content:', contentError);
      return NextResponse.json({
        error: 'Failed to generate content',
        message: contentError.message
      }, { status: 500 });
    }

    console.log(`✅ Successfully generated ${extendedContent.length} content items!`);

    // Get final counts
    const [moviesResult, contentResult] = await Promise.all([
      db.ensureClient().from('titles').select('id').eq('type', 'movie'),
      db.ensureClient().from('content_items').select('id')
    ]);

    const movieCount = moviesResult.data?.length || 0;
    const contentCount = contentResult.data?.length || 0;

    return NextResponse.json({
      message: 'Content generation completed successfully!',
      stats: {
        movies: movieCount,
        content: contentCount,
        newContent: extendedContent.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in content generation:', error);
    return NextResponse.json({
      error: 'Failed to generate content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
