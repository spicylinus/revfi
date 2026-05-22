import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';

// In-memory rate limiting store (best-effort for serverless environments)
const rateLimits = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Please enter a website URL' },
        { status: 400 }
      );
    }

    // Basic URL validation & formatting
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    let urlObj;
    try {
      urlObj = new URL(formattedUrl);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "That doesn't look like a valid website address" },
        { status: 400 }
      );
    }

    const domain = urlObj.hostname;

    // Rate Limiting (1 per hour per domain)
    const lastAudit = rateLimits.get(domain);
    const oneHourAgo = Date.now() - 3600000;

    if (lastAudit && lastAudit > oneHourAgo) {
      const waitMinutes = Math.ceil((lastAudit + 3600000 - Date.now()) / 60000);
      return NextResponse.json(
        { 
          success: false, 
          error: `Rate limit reached. Please wait ${waitMinutes} minutes before auditing this site again.` 
        },
        { status: 429 }
      );
    }

    console.log(`Starting fetch-based audit for ${formattedUrl}...`);
    const result = await runAudit(formattedUrl);
    
    // Update rate limit only on success
    rateLimits.set(domain, Date.now());

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Audit failed:', error);
    
    let userMessage = 'We encountered an error while analyzing your site. Please try again.';
    if (error.message?.includes('timeout') || error.name === 'AbortError') {
      userMessage = "We couldn't reach your website. It might be taking too long to respond.";
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('EAI_AGAIN') || error.message?.includes('fetch failed')) {
      userMessage = "We couldn't find your website. Please check the URL and try again.";
    }

    return NextResponse.json(
      { 
        success: false, 
        error: userMessage
      },
      { status: 500 }
    );
  }
}
