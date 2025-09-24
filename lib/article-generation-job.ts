import { db, Job, JobStatus } from './database'
import { ArticleTopicGenerator } from './article-generator'
import { env } from './env'

export interface ArticleGenerationJobPayload {
  topicId: string
  priority: 'low' | 'medium' | 'high'
}

export class ArticleGenerationJobProcessor {
  private db = db

  async createArticleGenerationJobs(topicIds: string[]): Promise<string[]> {
    const jobIds: string[] = []
    
    for (const topicId of topicIds) {
      const job = await this.db.createJob({
        type: 'generate_article_from_topic',
        payload: {
          topicId,
          priority: 'medium'
        },
        status: 'queued',
        scheduled_for: new Date().toISOString()
      })
      
      jobIds.push(job.id)
    }
    
    return jobIds
  }

  async processArticleGeneration(job: Job): Promise<void> {
    const payload = job.payload as ArticleGenerationJobPayload
    const { topicId } = payload
    
    try {
      await this.db.updateJob(job.id, {
        status: 'running',
        started_at: new Date().toISOString(),
        attempts: job.attempts + 1
      })

      await this.addJobLog(job.id, 'info', `Starting article generation for topic: ${topicId}`)

      // Get topic details
      const { data: topic, error: topicError } = await this.db.ensureClient()
        .from('article_topics')
        .select('*')
        .eq('id', topicId)
        .single()

      if (topicError || !topic) {
        throw new Error(`Topic not found: ${topicId}`)
      }

      // Generate article content
      const articleContent = await this.generateArticleContent(topic)
      
      // Save article to database
      const { data: article, error: articleError } = await this.db.ensureClient()
        .from('articles')
        .insert({
          title: articleContent.title,
          slug: articleContent.slug,
          content: articleContent.content,
          excerpt: articleContent.excerpt,
          topic_id: topicId,
          status: 'published',
          published_at: new Date().toISOString(),
          seo_title: articleContent.seoTitle,
          seo_description: articleContent.seoDescription,
          tags: articleContent.tags,
          word_count: articleContent.wordCount
        })
        .select()
        .single()

      if (articleError) {
        throw new Error(`Failed to save article: ${articleError.message}`)
      }

      // Update topic status
      await this.db.ensureClient()
        .from('article_topics')
        .update({
          status: 'completed',
          article_id: article.id,
          completed_at: new Date().toISOString()
        })
        .eq('id', topicId)

      await this.db.updateJob(job.id, {
        status: 'done',
        finished_at: new Date().toISOString()
      })

      await this.addJobLog(job.id, 'info', `Article generated successfully: ${article.id}`)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      await this.db.updateJob(job.id, {
        status: 'failed',
        error: errorMessage,
        finished_at: new Date().toISOString()
      })

      await this.addJobLog(job.id, 'error', `Article generation failed: ${errorMessage}`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      })

      throw error
    }
  }

  private async generateArticleContent(topic: any): Promise<{
    title: string
    slug: string
    content: string
    excerpt: string
    seoTitle: string
    seoDescription: string
    tags: string[]
    wordCount: number
  }> {
    // This is a simplified implementation
    // In a real scenario, you'd integrate with an AI service like OpenAI or Grok
    
    const title = topic.title || `Article about ${topic.keyword}`
    const slug = this.generateSlug(title)
    const content = this.generateBasicContent(topic)
    const excerpt = content.substring(0, 200) + '...'
    const seoTitle = `${title} - What to Watch`
    const seoDescription = excerpt
    const tags = topic.tags || [topic.keyword]
    const wordCount = content.split(' ').length

    return {
      title,
      slug,
      content,
      excerpt,
      seoTitle,
      seoDescription,
      tags,
      wordCount
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  private generateBasicContent(topic: any): string {
    // Basic content generation - in production, this would use AI
    return `
# ${topic.title}

This is a comprehensive guide about ${topic.keyword}. 

## Introduction

${topic.description || `Let's explore everything you need to know about ${topic.keyword}.`}

## Key Points

- Important aspect 1
- Important aspect 2  
- Important aspect 3

## Conclusion

This guide provides valuable insights into ${topic.keyword} and helps you make informed decisions.

For more recommendations and reviews, visit What to Watch.
    `.trim()
  }

  private async addJobLog(jobId: string, level: string, message: string, data?: any) {
    await this.db.addJobLog(jobId, level, message, data)
  }
}
