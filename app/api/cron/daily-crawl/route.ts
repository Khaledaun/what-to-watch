import { NextRequest, NextResponse } from 'next/server';
import { ProfessionalCrawler } from '@/lib/crawler';
import { GrokAutoFix } from '@/lib/grok-auto-fix';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting daily website crawl...');

    const crawler = new ProfessionalCrawler();
    const autoFix = new GrokAutoFix();

    // Run the crawl
    const report = await crawler.crawlWebsite();
    
    // Save the report
    await crawler.saveCrawlReport(report);

    // Auto-fix 404 errors if any found
    let autoFixResults: any[] = [];
    if (report.fourOhFourCount > 0) {
      console.log(`Found ${report.fourOhFourCount} 404 errors, attempting auto-fix...`);
      
      const fourOhFourUrls = report.fourOhFours.map(error => error.url);
      autoFixResults = await autoFix.batchFix404s(fourOhFourUrls);
      
      console.log(`Auto-fixed ${autoFixResults.filter(r => r.success).length} out of ${autoFixResults.length} 404 errors`);
    }

    // Send notification if there are issues
    if (report.fourOhFourCount > 0 || report.errorCount > 10) {
      await sendNotification(report, autoFixResults);
    }

    return NextResponse.json({
      message: 'Daily crawl completed successfully',
      report: {
        totalUrls: report.totalUrls,
        successCount: report.successCount,
        errorCount: report.errorCount,
        fourOhFourCount: report.fourOhFourCount,
        averageResponseTime: report.averageResponseTime,
        autoFixResults: autoFixResults.length,
        autoFixSuccesses: autoFixResults.filter(r => r.success).length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Daily crawl error:', error);
    return NextResponse.json({
      error: 'Failed to run daily crawl',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function sendNotification(report: any, autoFixResults: any[]) {
  try {
    // Send email notification to admin
    const emailData = {
      to: 'khaled@nas-law.com',
      subject: `Website Crawl Report - ${report.fourOhFourCount} 404 Errors Found`,
      html: `
        <h2>Daily Website Crawl Report</h2>
        <p><strong>Total URLs:</strong> ${report.totalUrls}</p>
        <p><strong>Success Rate:</strong> ${Math.round((report.successCount / report.totalUrls) * 100)}%</p>
        <p><strong>404 Errors:</strong> ${report.fourOhFourCount}</p>
        <p><strong>Total Errors:</strong> ${report.errorCount}</p>
        <p><strong>Average Response Time:</strong> ${Math.round(report.averageResponseTime)}ms</p>
        
        ${report.fourOhFourCount > 0 ? `
          <h3>404 Errors Found:</h3>
          <ul>
            ${report.fourOhFours.map((error: any) => `<li>${error.url}</li>`).join('')}
          </ul>
          
          <h3>Auto-Fix Results:</h3>
          <p>Successfully fixed: ${autoFixResults.filter(r => r.success).length} out of ${autoFixResults.length}</p>
        ` : ''}
        
        <p>Check the admin dashboard for more details.</p>
      `
    };

    // You can implement email sending here using your preferred service
    console.log('Notification email would be sent:', emailData);
    
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
