import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';
import fs from 'fs';

const RATE_LIMIT_FILE = '/tmp/audit_rate_limits.json';

function getRateLimits() {
  try {
    if (fs.existsSync(RATE_LIMIT_FILE)) {
      return JSON.parse(fs.readFileSync(RATE_LIMIT_FILE, 'utf-8'));
    }
  } catch (e) {}
  return {};
}

function saveRateLimits(limits: any) {
  try {
    fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(limits, null, 2));
  } catch (e) {}
}

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
    const limits = getRateLimits();
    const lastAudit = limits[domain];
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

    console.log(`Starting bulletproof audit for ${formattedUrl}...`);
    const result = await runAudit(formattedUrl);
    
    // Update rate limit only on success
    limits[domain] = Date.now();
    saveRateLimits(limits);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Audit failed:', error);
    
    let userMessage = 'We encountered an error while analyzing your site. Please try again.';
    if (error.message?.includes('timeout')) {
      userMessage = "We couldn't reach your website. It might be taking too long to respond.";
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('EAI_AGAIN')) {
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
