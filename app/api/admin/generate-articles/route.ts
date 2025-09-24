import { NextRequest, NextResponse } from 'next/server';
import { ArticleGenerationJobProcessor } from '@/lib/article-generation-job';
import { ArticleTopicGenerator } from '@/lib/article-generator';

// POST /api/admin/generate-articles - Manually trigger article generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicIds, generateNewTopics = false, topicCount = 3 } = body;

    const jobProcessor = new ArticleGenerationJobProcessor();
    let jobIds: string[] = [];

    if (generateNewTopics) {
      // Generate new topics first
      const topicGenerator = new ArticleTopicGenerator();
      const topics = await topicGenerator.generateWeeklyTopics(topicCount);
      const newTopicIds = topics.map(topic => topic.id);
      jobIds = await jobProcessor.createArticleGenerationJobs(newTopicIds);
    } else if (topicIds && topicIds.length > 0) {
      // Use provided topic IDs
      jobIds = await jobProcessor.createArticleGenerationJobs(topicIds);
    } else {
      return NextResponse.json({
        error: 'Either topicIds or generateNewTopics must be provided'
      }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Article generation jobs created successfully',
      jobIds,
      count: jobIds.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Article generation error:', error);
    return NextResponse.json({
      error: 'Failed to create article generation jobs',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

