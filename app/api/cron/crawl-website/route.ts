import { NextRequest, NextResponse } from 'next/server';
import { ProfessionalCrawler } from '@/lib/crawler';
import { GrokAutoFix } from '@/lib/grok-auto-fix';

export async function POST(request: NextRequest) {
  try {
    const crawler = new ProfessionalCrawler();
    const autoFix = new GrokAutoFix();

    console.log('Starting professional website crawl...');

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

    return NextResponse.json({
      message: 'Website crawl completed successfully',
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
    console.error('Crawl error:', error);
    return NextResponse.json({
      error: 'Failed to crawl website',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const crawler = new ProfessionalCrawler();
    const report = await crawler.getLatestCrawlReport();

    if (!report) {
      return NextResponse.json({
        message: 'No crawl reports found',
        report: null
      });
    }

    return NextResponse.json({
      message: 'Latest crawl report retrieved',
      report
    });

  } catch (error) {
    console.error('Error fetching crawl report:', error);
    return NextResponse.json({
      error: 'Failed to fetch crawl report',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
