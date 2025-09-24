import { NextRequest, NextResponse } from 'next/server';
import { ArticleTopicGenerator } from '@/lib/article-generator';
import { ArticleGenerationJobProcessor } from '@/lib/article-generation-job';
import { env } from '@/lib/env';

export const runtime = 'edge';

// POST /api/cron/generate-weekly-topics - Generate weekly article topics
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const generator = new ArticleTopicGenerator();
    const jobProcessor = new ArticleGenerationJobProcessor();
    
    // Generate 7 diverse article topics
    const topics = await generator.generateWeeklyTopics(7);
    
    // Create article generation jobs for all topics
    const topicIds = topics.map(topic => topic.id);
    const jobIds = await jobProcessor.createArticleGenerationJobs(topicIds);
    
    // Send email notification
    await sendTopicsEmail(topics);
    
    return NextResponse.json({
      message: 'Weekly topics generated and article generation jobs created successfully',
      topicsGenerated: topics.length,
      articleJobsCreated: jobIds.length,
      jobIds: jobIds,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Weekly topics generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate weekly topics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function sendTopicsEmail(topics: any[]) {
  try {
    // Create email content
    const emailContent = generateEmailContent(topics);
    
    // Log the email content (in production, you'd use a real email service)
    console.log('=== WEEKLY ARTICLE TOPICS EMAIL ===');
    console.log('To: Khaled@nas-law.com');
    console.log('Subject: Weekly Article Topics - ' + new Date().toLocaleDateString());
    console.log('Content:');
    console.log(emailContent);
    console.log('=====================================');

    // TODO: Integrate with email service like SendGrid, AWS SES, or Resend
    // For now, the topics are saved to the database and can be accessed via the admin dashboard

  } catch (error) {
    console.error('Failed to send topics email:', error);
  }
}

function generateEmailContent(topics: any[]): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Weekly Article Topics</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .topic { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .topic h3 { color: #2c3e50; margin-top: 0; }
        .keywords { background: #e8f4f8; padding: 10px; border-radius: 4px; margin: 10px 0; }
        .outline { background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0; }
        .priority-high { border-left: 4px solid #e74c3c; }
        .priority-medium { border-left: 4px solid #f39c12; }
        .priority-low { border-left: 4px solid #27ae60; }
        .difficulty { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .difficulty-easy { background: #d4edda; color: #155724; }
        .difficulty-medium { background: #fff3cd; color: #856404; }
        .difficulty-hard { background: #f8d7da; color: #721c24; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📝 Weekly Article Topics</h1>
        <p><strong>Date:</strong> ${currentDate}</p>
        <p><strong>Topics Generated:</strong> ${topics.length}</p>
        <p>Here are your weekly article topics with SEO data, keywords, and content outlines.</p>
      </div>
  `;

  topics.forEach((topic, index) => {
    const priorityClass = `priority-${topic.priority}`;
    const difficultyClass = `difficulty-${topic.difficulty}`;
    
    html += `
      <div class="topic ${priorityClass}">
        <h3>${index + 1}. ${topic.title}</h3>
        <p><strong>Category:</strong> ${topic.category}</p>
        <p><strong>Priority:</strong> <span class="difficulty ${difficultyClass}">${topic.priority.toUpperCase()}</span></p>
        <p><strong>Difficulty:</strong> <span class="difficulty ${difficultyClass}">${topic.difficulty.toUpperCase()}</span></p>
        <p><strong>Estimated Word Count:</strong> ${topic.estimatedWordCount.toLocaleString()}</p>
        
        <div class="keywords">
          <h4>🎯 Target Keywords:</h4>
          <p>${topic.targetKeywords.join(', ')}</p>
          
          <h4>🔍 Long-tail Keywords:</h4>
          <ul>
            ${topic.longTailKeywords.map((keyword: string) => `<li>${keyword}</li>`).join('')}
          </ul>
        </div>
        
        <div class="outline">
          <h4>📋 Content Outline:</h4>
          <ol>
            ${topic.contentOutline.map((item: string) => `<li>${item}</li>`).join('')}
          </ol>
        </div>
        
        <h4>🔗 Authority Links:</h4>
        <ul>
          ${topic.authorityLinks.map((link: any) => `
            <li>
              <strong>${link.title}</strong> (${link.relevance})<br>
              <a href="${link.url}" target="_blank">${link.url}</a><br>
              <em>${link.description}</em>
            </li>
          `).join('')}
        </ul>
        
        <h4>📊 SEO Data:</h4>
        <p><strong>Meta Title:</strong> ${topic.seoData.metaTitle}</p>
        <p><strong>Meta Description:</strong> ${topic.seoData.metaDescription}</p>
        <p><strong>Focus Keyword:</strong> ${topic.seoData.focusKeyword}</p>
      </div>
    `;
  });

  html += `
      <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <h3>📋 Next Steps:</h3>
        <ol>
          <li>Review the topics and select which ones to write</li>
          <li>Use the provided SEO data and keywords</li>
          <li>Follow the content outlines for structure</li>
          <li>Include the authority links for credibility</li>
          <li>Upload articles through the admin dashboard</li>
        </ol>
        
        <p><strong>Admin Dashboard:</strong> <a href="https://what-to-watch-6a62jwcu9-khaledauns-projects.vercel.app/admin">https://what-to-watch-6a62jwcu9-khaledauns-projects.vercel.app/admin</a></p>
      </div>
    </body>
    </html>
  `;

  return html;
}
