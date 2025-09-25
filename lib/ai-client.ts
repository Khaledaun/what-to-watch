import { env } from './env';

export interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export class AIClient {
  private providers: AIProvider[] = [];
  private defaultProvider: string = 'openai';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    try {
      // OpenAI
      if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.trim() !== '') {
        this.providers.push({
          name: 'openai',
          apiKey: env.OPENAI_API_KEY,
          baseUrl: 'https://api.openai.com/v1',
          model: 'gpt-4o-mini'
        });
        console.log('✅ OpenAI provider initialized');
      } else {
        console.log('⚠️ OpenAI API key not configured');
      }

      // Grok AI
      if (env.GROK_API_KEY && env.GROK_API_KEY.trim() !== '') {
        this.providers.push({
          name: 'grok',
          apiKey: env.GROK_API_KEY,
          baseUrl: 'https://api.x.ai/v1',
          model: env.GROK_MODEL || 'grok-4-fast-reasoning'
        });
        console.log('✅ Grok provider initialized');
      } else {
        console.log('⚠️ Grok API key not configured');
      }

      // Claude AI
      if (env.CLAUDE_API_KEY && env.CLAUDE_API_KEY.trim() !== '') {
        this.providers.push({
          name: 'claude',
          apiKey: env.CLAUDE_API_KEY,
          baseUrl: 'https://api.anthropic.com/v1',
          model: 'claude-3-5-sonnet-20241022'
        });
        console.log('✅ Claude provider initialized');
      } else {
        console.log('⚠️ Claude API key not configured');
      }

      // Set default provider
      this.defaultProvider = env.DEFAULT_AI_PROVIDER || 'openai';
      console.log(`🎯 Default AI provider: ${this.defaultProvider}`);
      console.log(`📊 Total providers configured: ${this.providers.length}`);
      
    } catch (error) {
      console.error('❌ Error initializing AI providers:', error);
    }
  }

  async generateContent(
    prompt: string,
    provider?: string,
    maxTokens: number = 2000
  ): Promise<string> {
    const selectedProvider = provider || this.defaultProvider;
    const providerConfig = this.providers.find(p => p.name === selectedProvider);

    if (!providerConfig) {
      const availableProviders = this.providers.map(p => p.name).join(', ');
      throw new Error(`AI provider '${selectedProvider}' not configured. Available providers: ${availableProviders || 'none'}`);
    }

    console.log(`🚀 Making API call to ${selectedProvider} (${providerConfig.model})`);

    try {
      const response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${providerConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: providerConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional content writer specializing in movie and TV show recommendations. Write engaging, SEO-optimized content that helps people discover great entertainment.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = `AI API error: ${response.status} - ${errorData.error?.message || response.statusText}`;
        console.error(`❌ ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || 'No content generated';
      console.log(`✅ AI response received (${content.length} characters)`);
      return content;
    } catch (error) {
      console.error(`❌ AI generation error with ${selectedProvider}:`, error);
      throw error;
    }
  }

  async generateArticleTopics(count: number = 5): Promise<Array<{
    title: string;
    slug: string;
    category: string;
    description: string;
    keywords: string[];
  }>> {
    // Check if any providers are available
    if (this.providers.length === 0) {
      console.log('⚠️ No AI providers available, using fallback topics');
      return this.getFallbackTopics(count);
    }

    const prompt = `Generate ${count} trending article topics for a movie and TV show recommendation website. Each topic should be:

1. SEO-optimized with popular keywords
2. Relevant to current movie/TV trends
3. Engaging for movie enthusiasts
4. Include category (Movie Lists, Streaming Guides, Reviews, Comparisons, etc.)

Format as JSON array with: title, slug, category, description, keywords

Examples of good topics:
- "Top 10 Action Movies on Netflix in 2024"
- "How to Watch Popular Movies on All Streaming Platforms"
- "Netflix vs Prime Video: Which Has Better Movies?"

Focus on trending content and streaming platform comparisons.`;

    try {
      console.log(`🤖 Generating ${count} topics using ${this.defaultProvider}...`);
      const content = await this.generateContent(prompt, this.defaultProvider, 1500);
      
      // Try to parse JSON response
      try {
        const topics = JSON.parse(content);
        if (Array.isArray(topics) && topics.length > 0) {
          console.log(`✅ Generated ${topics.length} topics successfully`);
          return topics;
        } else {
          console.log('⚠️ Invalid topics format, using fallback');
          return this.getFallbackTopics(count);
        }
      } catch (parseError) {
        console.log('⚠️ JSON parsing failed, extracting from text');
        return this.extractTopicsFromText(content, count);
      }
    } catch (error) {
      console.error('❌ Error generating topics:', error);
      console.log('🔄 Falling back to predefined topics');
      return this.getFallbackTopics(count);
    }
  }

  async generateFullArticle(topic: {
    title: string;
    category: string;
    description: string;
    keywords: string[];
  }): Promise<{
    content: string;
    excerpt: string;
    wordCount: number;
    seoScore: number;
  }> {
    const prompt = `Write a comprehensive, SEO-optimized article with the following details:

Title: ${topic.title}
Category: ${topic.category}
Description: ${topic.description}
Keywords: ${topic.keywords.join(', ')}

Requirements:
- 2000-3000 words
- Engaging introduction and conclusion
- Use the provided keywords naturally
- Include subheadings (H2, H3)
- Add relevant movie/TV show examples
- Include streaming platform information where relevant
- Write in a conversational, engaging tone
- Optimize for search engines
- Include a compelling excerpt (150-200 words)

Format the article in Markdown with proper headings, lists, and formatting.`;

    try {
      const content = await this.generateContent(prompt, this.defaultProvider, 4000);
      
      // Extract excerpt (first 200 words)
      const excerpt = content.split(' ').slice(0, 200).join(' ') + '...';
      
      // Calculate word count
      const wordCount = content.split(' ').length;
      
      // Simple SEO score calculation
      const seoScore = this.calculateSEOScore(content, topic.keywords);
      
      return {
        content,
        excerpt,
        wordCount,
        seoScore
      };
    } catch (error) {
      console.error('Error generating article:', error);
      throw error;
    }
  }

  private extractTopicsFromText(text: string, count: number) {
    // Simple extraction logic for when JSON parsing fails
    const lines = text.split('\n').filter(line => line.trim());
    const topics = [];
    
    for (let i = 0; i < Math.min(count, lines.length); i++) {
      const line = lines[i].replace(/^\d+\.\s*/, '').trim();
      if (line) {
        topics.push({
          title: line,
          slug: line.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
          category: 'Movie Lists',
          description: `A comprehensive guide about ${line.toLowerCase()}`,
          keywords: line.toLowerCase().split(' ').filter(word => word.length > 3)
        });
      }
    }
    
    return topics.length > 0 ? topics : this.getFallbackTopics(count);
  }

  private getFallbackTopics(count: number) {
    const fallbackTopics = [
      {
        title: "Top 10 Action Movies on Netflix in 2024",
        slug: "top-10-action-movies-netflix-2024",
        category: "Movie Lists",
        description: "Discover the best action movies currently streaming on Netflix",
        keywords: ["action movies", "netflix", "2024", "streaming"]
      },
      {
        title: "How to Watch Popular Movies on All Streaming Platforms",
        slug: "how-to-watch-popular-movies-all-platforms",
        category: "Streaming Guides",
        description: "Complete guide to finding movies across streaming services",
        keywords: ["streaming", "movies", "platforms", "guide"]
      },
      {
        title: "Netflix vs Prime Video: Which Has Better Movies?",
        slug: "netflix-vs-prime-video-better-movies",
        category: "Streaming Comparison",
        description: "Compare the movie libraries of top streaming services",
        keywords: ["netflix", "prime video", "comparison", "movies"]
      },
      {
        title: "Best Drama Movies on Prime Video: Hidden Gems",
        slug: "best-drama-movies-prime-video-hidden-gems",
        category: "Movie Reviews",
        description: "Hidden gem drama movies you need to watch",
        keywords: ["drama movies", "prime video", "hidden gems", "reviews"]
      },
      {
        title: "The Shawshank Redemption: Why It's Still #1",
        slug: "shawshank-redemption-number-one-movie",
        category: "Movie Analysis",
        description: "Analysis of why The Shawshank Redemption remains a masterpiece",
        keywords: ["shawshank redemption", "classic movies", "analysis", "masterpiece"]
      }
    ];

    return fallbackTopics.slice(0, count);
  }

  private calculateSEOScore(content: string, keywords: string[]): number {
    let score = 0;
    const contentLower = content.toLowerCase();
    
    // Check for keyword density
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const occurrences = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
      score += Math.min(occurrences * 5, 20); // Max 20 points per keyword
    });
    
    // Check for headings
    const headings = (content.match(/^#+\s/gm) || []).length;
    score += Math.min(headings * 3, 15); // Max 15 points for headings
    
    // Check for word count (optimal range 2000-3000)
    const wordCount = content.split(' ').length;
    if (wordCount >= 2000 && wordCount <= 3000) {
      score += 20;
    } else if (wordCount >= 1500) {
      score += 10;
    }
    
    // Check for lists and formatting
    const lists = (content.match(/^[-*+]\s/gm) || []).length;
    score += Math.min(lists * 2, 10); // Max 10 points for lists
    
    return Math.min(score, 100); // Cap at 100
  }

  getAvailableProviders(): string[] {
    return this.providers.map(p => p.name);
  }

  getDefaultProvider(): string {
    return this.defaultProvider;
  }

  isProviderAvailable(provider: string): boolean {
    return this.providers.some(p => p.name === provider);
  }
}

// Export singleton instance
export const aiClient = new AIClient();
