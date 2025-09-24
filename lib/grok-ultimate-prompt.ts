import { ArticleGenerationRequest } from './grok-client';

export interface UltimateArticleRequest extends ArticleGenerationRequest {
  contentType: 'list' | 'guide' | 'review' | 'comparison' | 'seasonal' | 'trending' | 'evergreen';
  targetAudience: 'general' | 'movie-buffs' | 'casual-viewers' | 'families' | 'couples';
  tone: 'professional' | 'conversational' | 'enthusiastic' | 'analytical';
  imageRequirements: ImageRequirement[];
}

export interface ImageRequirement {
  type: 'hero' | 'section' | 'movie-poster' | 'comparison' | 'infographic';
  description: string;
  altText: string;
  placement: 'top' | 'middle' | 'bottom' | 'inline';
}

export class GrokUltimatePrompt {
  
  static createUltimatePrompt(request: UltimateArticleRequest): string {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.getUserPrompt(request);
    
    return `${systemPrompt}\n\n${userPrompt}`;
  }

  private static getSystemPrompt(): string {
    return `You are an exceptional movie critic and promotional content writer with 15+ years of experience. You write for a premium streaming recommendation website that helps users discover the perfect movies and TV shows.

**YOUR EXPERTISE:**
- Master of SEO-optimized content that ranks #1 on Google
- Expert in movie/TV analysis with deep industry knowledge
- Skilled at creating engaging, shareable content
- Pro at converting readers into engaged users
- Authority on streaming platforms and content discovery

**WRITING STYLE:**
- Write like a passionate movie critic who's also a marketing genius
- Use compelling storytelling that hooks readers from the first sentence
- Include specific details, ratings, and insider knowledge
- Create urgency and FOMO (fear of missing out)
- Use power words and emotional triggers
- Write in a conversational yet authoritative tone

**SEO MASTERY:**
- Naturally integrate primary and long-tail keywords
- Use semantic keywords and LSI (Latent Semantic Indexing) terms
- Create compelling meta titles that get clicks
- Write meta descriptions that drive traffic
- Structure content for featured snippets
- Include FAQ sections for voice search optimization

**CONTENT STRUCTURE REQUIREMENTS:**
1. **Hook Opening** (100-150 words): Compelling story, statistic, or question
2. **Value Proposition** (50-100 words): What readers will gain
3. **Main Content** (2000-3000 words): Detailed, valuable information
4. **Action Items** (100-150 words): Clear next steps
5. **FAQ Section** (200-300 words): Answer common questions
6. **Conclusion** (100-150 words): Strong call-to-action

**IMAGE INTEGRATION:**
- Every image must have a specific purpose and placement
- Use descriptive alt text for SEO and accessibility
- Include image captions that add value
- Ensure images support the narrative flow
- Use high-quality, relevant visuals only

**OUTPUT FORMAT:**
Return a JSON object with this exact structure:
{
  "title": "SEO-optimized title (50-60 characters)",
  "content": "Full HTML article with proper structure, headings, and image placeholders",
  "excerpt": "Compelling 2-3 sentence excerpt (150-200 characters)",
  "metaTitle": "SEO meta title (50-60 characters)",
  "metaDescription": "SEO meta description (150-160 characters)",
  "focusKeyword": "Primary keyword",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3"],
  "wordCount": 2500,
  "readTime": 12,
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "images": [
    {
      "type": "hero",
      "description": "Main hero image description",
      "altText": "SEO-optimized alt text",
      "placement": "top",
      "caption": "Compelling image caption"
    }
  ],
  "internalLinks": [
    {
      "text": "Link text",
      "url": "/target-page",
      "context": "Why this link is relevant"
    }
  ],
  "faqSection": [
    {
      "question": "Common question",
      "answer": "Detailed, helpful answer"
    }
  ],
  "callToAction": "Strong, specific call-to-action for readers"
}`;
  }

  private static getUserPrompt(request: UltimateArticleRequest): string {
    const contentType = request.contentType;
    const targetAudience = request.targetAudience;
    const tone = request.tone;
    
    let contentSpecificPrompt = '';
    
    switch (contentType) {
      case 'list':
        contentSpecificPrompt = this.getListPrompt(request);
        break;
      case 'guide':
        contentSpecificPrompt = this.getGuidePrompt(request);
        break;
      case 'review':
        contentSpecificPrompt = this.getReviewPrompt(request);
        break;
      case 'comparison':
        contentSpecificPrompt = this.getComparisonPrompt(request);
        break;
      case 'seasonal':
        contentSpecificPrompt = this.getSeasonalPrompt(request);
        break;
      case 'trending':
        contentSpecificPrompt = this.getTrendingPrompt(request);
        break;
      case 'evergreen':
        contentSpecificPrompt = this.getEvergreenPrompt(request);
        break;
    }

    return `**ARTICLE SPECIFICATIONS:**

**Content Type:** ${contentType.toUpperCase()}
**Target Audience:** ${targetAudience.replace('-', ' ').toUpperCase()}
**Writing Tone:** ${tone.toUpperCase()}
**Target Word Count:** ${request.estimatedWordCount} words

**PRIMARY KEYWORDS:**
${request.targetKeywords.join(', ')}

**LONG-TAIL KEYWORDS:**
${request.longTailKeywords.join(', ')}

**CONTENT OUTLINE:**
${request.contentOutline.map((item, index) => `${index + 1}. ${item}`).join('\n')}

**AUTHORITY LINKS TO REFERENCE:**
${request.authorityLinks.map(link => `- ${link.title}: ${link.description}`).join('\n')}

**IMAGE REQUIREMENTS:**
${request.imageRequirements.map(img => `- ${img.type.toUpperCase()}: ${img.description} (${img.placement})`).join('\n')}

**CONTENT-SPECIFIC INSTRUCTIONS:**
${contentSpecificPrompt}

**CRITICAL REQUIREMENTS:**
1. **NO ERRORS ALLOWED** - Every image placeholder must be properly formatted
2. **SEO OPTIMIZATION** - Use keywords naturally, create compelling titles
3. **ENGAGEMENT** - Hook readers from the first sentence
4. **VALUE** - Provide actionable insights and recommendations
5. **AUTHORITY** - Demonstrate deep movie/TV knowledge
6. **CONVERSION** - Include clear calls-to-action

**WRITE THE ULTIMATE SEO-OPTIMIZED ARTICLE NOW:**`;
  }

  private static getListPrompt(request: UltimateArticleRequest): string {
    return `Create a compelling "Best of" list that:
- Starts with a hook about why this list matters NOW
- Includes specific ratings, years, and streaming availability
- Provides mini-reviews for each entry (50-100 words each)
- Uses power words like "Essential," "Must-Watch," "Hidden Gem"
- Creates urgency with phrases like "Available Now," "Limited Time"
- Includes a "Why We Chose These" section
- Ends with "What to Watch Next" recommendations`;
  }

  private static getGuidePrompt(request: UltimateArticleRequest): string {
    return `Create a comprehensive "How To" guide that:
- Addresses a specific problem or need
- Provides step-by-step instructions
- Includes insider tips and tricks
- Uses "Pro Tips" and "Expert Advice" callouts
- Includes troubleshooting section
- Provides multiple options/solutions
- Ends with "Success Stories" or testimonials`;
  }

  private static getReviewPrompt(request: UltimateArticleRequest): string {
    return `Create an in-depth review that:
- Opens with a compelling hook about the movie/show
- Provides detailed analysis of plot, acting, direction
- Includes specific scenes and moments
- Compares to similar works
- Addresses both strengths and weaknesses
- Includes "Who Will Love This" and "Who Should Skip" sections
- Provides streaming options and availability`;
  }

  private static getComparisonPrompt(request: UltimateArticleRequest): string {
    return `Create a detailed comparison that:
- Opens with why this comparison matters
- Uses side-by-side analysis format
- Includes specific examples and evidence
- Provides a clear winner with reasoning
- Includes "Best For" sections for each option
- Addresses common misconceptions
- Ends with personalized recommendations`;
  }

  private static getSeasonalPrompt(request: UltimateArticleRequest): string {
    return `Create seasonal content that:
- Connects to current events, holidays, or seasons
- Creates urgency with time-sensitive recommendations
- Includes "Perfect For" scenarios
- Provides mood-based suggestions
- Includes seasonal viewing tips
- Creates FOMO with "Limited Time" content
- Ends with "Don't Miss" recommendations`;
  }

  private static getTrendingPrompt(request: UltimateArticleRequest): string {
    return `Create trending content that:
- Opens with current buzz or viral moments
- Explains why this is trending NOW
- Includes social media context
- Provides insider perspective
- Includes "What's Next" predictions
- Creates urgency with "Catch Up Before" messaging
- Ends with "Stay Updated" call-to-action`;
  }

  private static getEvergreenPrompt(request: UltimateArticleRequest): string {
    return `Create evergreen content that:
- Focuses on timeless topics and themes
- Provides comprehensive, lasting value
- Includes historical context and evolution
- Addresses fundamental questions
- Provides long-term recommendations
- Includes "Classic vs Modern" comparisons
- Ends with "Timeless Favorites" section`;
  }

  static generateImageRequirements(contentType: string, topic: string): ImageRequirement[] {
    const baseImages: ImageRequirement[] = [
      {
        type: 'hero',
        description: `Eye-catching hero image for ${topic}`,
        altText: `${topic} - streaming recommendations`,
        placement: 'top'
      }
    ];

    switch (contentType) {
      case 'list':
        return [
          ...baseImages,
          {
            type: 'section',
            description: 'Visual breakdown of top recommendations',
            altText: 'Top movie recommendations visual guide',
            placement: 'middle'
          },
          {
            type: 'infographic',
            description: 'Quick reference guide for all recommendations',
            altText: 'Movie recommendations quick reference',
            placement: 'bottom'
          }
        ];

      case 'guide':
        return [
          ...baseImages,
          {
            type: 'section',
            description: 'Step-by-step visual guide',
            altText: 'How to guide visual steps',
            placement: 'middle'
          },
          {
            type: 'infographic',
            description: 'Quick tips and tricks summary',
            altText: 'Quick tips infographic',
            placement: 'bottom'
          }
        ];

      case 'comparison':
        return [
          ...baseImages,
          {
            type: 'comparison',
            description: 'Side-by-side comparison visual',
            altText: 'Streaming platform comparison chart',
            placement: 'middle'
          },
          {
            type: 'section',
            description: 'Winner announcement visual',
            altText: 'Best choice recommendation',
            placement: 'bottom'
          }
        ];

      default:
        return [
          ...baseImages,
          {
            type: 'section',
            description: 'Supporting visual content',
            altText: 'Additional visual content',
            placement: 'middle'
          }
        ];
    }
  }

  static getContentTypes(): Array<{type: string, description: string, examples: string[]}> {
    return [
      {
        type: 'list',
        description: 'Curated lists of movies/TV shows',
        examples: ['Top 10 Action Movies', 'Best Romantic Comedies', 'Hidden Gems on Netflix']
      },
      {
        type: 'guide',
        description: 'How-to guides and tutorials',
        examples: ['How to Find Movies', 'Streaming Setup Guide', 'Movie Night Planning']
      },
      {
        type: 'review',
        description: 'In-depth movie/TV show reviews',
        examples: ['Oppenheimer Review', 'The Bear Season 3', 'Latest Netflix Original']
      },
      {
        type: 'comparison',
        description: 'Platform and service comparisons',
        examples: ['Netflix vs Disney+', 'Movie vs TV Show', 'Free vs Paid Streaming']
      },
      {
        type: 'seasonal',
        description: 'Holiday and seasonal content',
        examples: ['Christmas Movies', 'Summer Blockbusters', 'Halloween Thrillers']
      },
      {
        type: 'trending',
        description: 'Current trending topics',
        examples: ['Viral Movies', 'Social Media Hits', 'Award Season Picks']
      },
      {
        type: 'evergreen',
        description: 'Timeless, always-relevant content',
        examples: ['Classic Movies', 'Essential Genres', 'Cinema History']
      }
    ];
  }
}

