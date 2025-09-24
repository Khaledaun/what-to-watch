import { env } from './env';
import { GrokUltimatePrompt, UltimateArticleRequest } from './grok-ultimate-prompt';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ArticleGenerationRequest {
  title: string;
  category: string;
  targetKeywords: string[];
  longTailKeywords: string[];
  contentOutline: string[];
  authorityLinks: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  estimatedWordCount: number;
  focusKeyword: string;
}

export interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  wordCount: number;
  readTime: number;
  tags: string[];
}

export class GrokClient {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.x.ai/v1';

  constructor() {
    this.apiKey = env.GROK_API_KEY || '';
    this.model = env.GROK_MODEL;
    
    if (!this.apiKey) {
      console.warn('GROK_API_KEY not provided. Grok integration will be disabled.');
    }
  }

  async generateArticle(request: ArticleGenerationRequest): Promise<GeneratedArticle> {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured');
    }

    // Use ultimate prompt for enhanced content generation
    const ultimateRequest: UltimateArticleRequest = {
      ...request,
      contentType: this.determineContentType(request.title),
      targetAudience: 'general',
      tone: 'professional',
      imageRequirements: GrokUltimatePrompt.generateImageRequirements(
        this.determineContentType(request.title),
        request.title
      )
    };

    const prompt = GrokUltimatePrompt.createUltimatePrompt(ultimateRequest);
    const messages: GrokMessage[] = [
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.makeRequest(messages);
      return this.parseArticleResponse(response, request);
    } catch (error) {
      console.error('Grok API error:', error);
      throw new Error(`Failed to generate article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private determineContentType(title: string): 'list' | 'guide' | 'review' | 'comparison' | 'seasonal' | 'trending' | 'evergreen' {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('top') || lowerTitle.includes('best') || lowerTitle.includes('list')) {
      return 'list';
    } else if (lowerTitle.includes('how to') || lowerTitle.includes('guide')) {
      return 'guide';
    } else if (lowerTitle.includes('vs') || lowerTitle.includes('comparison')) {
      return 'comparison';
    } else if (lowerTitle.includes('weekend') || lowerTitle.includes('seasonal')) {
      return 'seasonal';
    } else if (lowerTitle.includes('viral') || lowerTitle.includes('trending')) {
      return 'trending';
    } else if (lowerTitle.includes('classic') || lowerTitle.includes('essential')) {
      return 'evergreen';
    } else {
      return 'review';
    }
  }

  private createSystemPrompt(): string {
    return `You are an expert content writer specializing in movie and TV show articles for a streaming recommendation website. Your articles should be:

1. **SEO-Optimized**: Use the provided keywords naturally throughout the content
2. **Engaging**: Write in a conversational, informative tone that keeps readers engaged
3. **Comprehensive**: Provide detailed information, insights, and recommendations
4. **Well-Structured**: Use proper headings, subheadings, and formatting
5. **Actionable**: Give readers clear recommendations and next steps

**Writing Guidelines:**
- Write in a friendly, expert tone
- Use the provided content outline as a structure guide
- Include specific examples and recommendations
- Add internal linking opportunities (mention "check out our other articles")
- Use the authority links naturally in the content
- Aim for the specified word count
- Include a compelling introduction and conclusion
- Add relevant subheadings for better readability

**SEO Requirements:**
- Use the focus keyword in the first 100 words
- Include target keywords naturally throughout
- Write a compelling meta title and description
- Create an engaging excerpt for the article preview

**Output Format:**
Return your response as a JSON object with the following structure:
{
  "title": "SEO-optimized article title",
  "content": "Full article content in HTML format with proper headings, paragraphs, and formatting",
  "excerpt": "Compelling 2-3 sentence excerpt for article preview",
  "metaTitle": "SEO meta title (50-60 characters)",
  "metaDescription": "SEO meta description (150-160 characters)",
  "wordCount": 2500,
  "readTime": 12,
  "tags": ["tag1", "tag2", "tag3"]
}`;
  }

  private createUserPrompt(request: ArticleGenerationRequest): string {
    return `Please write a comprehensive article based on the following specifications:

**Article Title:** ${request.title}
**Category:** ${request.category}
**Target Word Count:** ${request.estimatedWordCount} words
**Focus Keyword:** ${request.focusKeyword}

**Target Keywords:** ${request.targetKeywords.join(', ')}
**Long-tail Keywords:** ${request.longTailKeywords.join(', ')}

**Content Outline:**
${request.contentOutline.map((item, index) => `${index + 1}. ${item}`).join('\n')}

**Authority Links to Reference:**
${request.authorityLinks.map(link => `- ${link.title}: ${link.description}`).join('\n')}

**Requirements:**
1. Write a comprehensive, engaging article that follows the content outline
2. Use the focus keyword and target keywords naturally throughout
3. Include specific movie/TV show recommendations with brief explanations
4. Reference the authority links naturally in the content
5. Write in HTML format with proper headings (h2, h3), paragraphs, and lists
6. Include a compelling introduction and actionable conclusion
7. Add internal linking opportunities (mention related articles)
8. Ensure the content is valuable and informative for readers

Please generate the article now.`;
  }

  private async makeRequest(messages: GrokMessage[]): Promise<GrokResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Grok API error: ${response.status} ${errorData}`);
    }

    return await response.json();
  }

  private parseArticleResponse(response: GrokResponse, request: ArticleGenerationRequest): GeneratedArticle {
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from Grok API');
    }

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      
      return {
        title: parsed.title || request.title,
        content: parsed.content || content,
        excerpt: parsed.excerpt || this.generateExcerpt(content),
        metaTitle: parsed.metaTitle || request.title,
        metaDescription: parsed.metaDescription || this.generateMetaDescription(content),
        wordCount: parsed.wordCount || this.countWords(content),
        readTime: parsed.readTime || Math.ceil(this.countWords(content) / 200),
        tags: parsed.tags || this.generateTags(request)
      };
    } catch (error) {
      // If JSON parsing fails, treat the entire response as content
      return {
        title: request.title,
        content: content,
        excerpt: this.generateExcerpt(content),
        metaTitle: request.title,
        metaDescription: this.generateMetaDescription(content),
        wordCount: this.countWords(content),
        readTime: Math.ceil(this.countWords(content) / 200),
        tags: this.generateTags(request)
      };
    }
  }

  private generateExcerpt(content: string): string {
    // Extract first paragraph or first 200 characters
    const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i)?.[1] || content;
    const cleanText = firstParagraph.replace(/<[^>]*>/g, '').trim();
    return cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText;
  }

  private generateMetaDescription(content: string): string {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const sentences = cleanContent.split('.').slice(0, 2);
    const description = sentences.join('.') + '.';
    return description.length > 160 ? description.substring(0, 157) + '...' : description;
  }

  private countWords(text: string): number {
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText.split(' ').filter(word => word.length > 0).length;
  }

  private generateTags(request: ArticleGenerationRequest): string[] {
    const tags = new Set<string>();
    
    // Add category-based tags
    if (request.category.toLowerCase().includes('movie')) tags.add('movies');
    if (request.category.toLowerCase().includes('tv')) tags.add('tv-shows');
    if (request.category.toLowerCase().includes('streaming')) tags.add('streaming');
    if (request.category.toLowerCase().includes('netflix')) tags.add('netflix');
    if (request.category.toLowerCase().includes('prime')) tags.add('prime-video');
    
    // Add keyword-based tags
    request.targetKeywords.forEach(keyword => {
      const cleanKeyword = keyword.toLowerCase().replace(/\s+/g, '-');
      tags.add(cleanKeyword);
    });
    
    // Add year-based tag
    tags.add('2024');
    
    return Array.from(tags).slice(0, 8); // Limit to 8 tags
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }
}
