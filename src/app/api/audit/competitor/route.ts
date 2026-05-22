import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';
import fs from 'fs';
import path from 'path';

const COMPETITOR_AUDIT_DIR = '/home/team/shared/sales/competitor-audits/';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, clientEmail } = body;

    if (!url || !clientEmail) {
      return NextResponse.json(
        { success: false, error: 'URL and Client Email are required' },
        { status: 400 }
      );
    }

    // Ensure directory exists
    if (!fs.existsSync(COMPETITOR_AUDIT_DIR)) {
      fs.mkdirSync(COMPETITOR_AUDIT_DIR, { recursive: true });
    }

    // Basic URL validation & formatting
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Trigger audit in the background (we don't await the full result to respond quickly to the UI)
    // But since this is a serverless function, it might be terminated if we don't await.
    // In this sandbox environment, it might stay alive long enough, but it's better to await or use a queue.
    // Given the task says "trigger a background audit", I'll await it here for simplicity in this script, 
    // but the UI won't wait because it doesn't await the fetch response in UpsellPage.
    
    console.log(`[COMPETITOR AUDIT] Starting background audit for ${formattedUrl} requested by ${clientEmail}...`);
    
    const result = await runAudit(formattedUrl);
    
    // Save the result
    const filename = `${clientEmail.replace(/[^a-z0-9]/gi, '_')}_${new URL(formattedUrl).hostname.replace(/[^a-z0-9]/gi, '_')}.json`;
    const filePath = path.join(COMPETITOR_AUDIT_DIR, filename);
    
    fs.writeFileSync(filePath, JSON.stringify({
      clientEmail,
      competitorUrl: formattedUrl,
      auditedAt: new Date().toISOString(),
      result
    }, null, 2));
    
    console.log(`[COMPETITOR AUDIT] Successfully saved audit to ${filePath}`);

    return NextResponse.json({
      success: true,
      message: 'Competitor audit triggered and saved'
    });
  } catch (error: any) {
    console.error('[COMPETITOR AUDIT] Failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
