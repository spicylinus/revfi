import { NextRequest, NextResponse, after } from 'next/server';
import { GHLClient } from '@/lib/ghl';
import { runFullSiteAudit } from '@/lib/full-audit';

// Gives the after() background audit room to finish without delaying the response
// (Hobby-plan-safe ceiling; raise if your Vercel plan allows longer function duration).
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, businessName, url, primaryLeak, leadImpact, smsConsent } = body;

    if (!email || !url) {
      return NextResponse.json({ error: 'Email and URL are required' }, { status: 400 });
    }

    // Use GHL integration — key must have Contacts + Workflows scope
    const apiKey = process.env.GHL_API_KEY || 'pit-255f3042-dfdb-4411-bb2e-748895ac6060';
    const locationId = process.env.GHL_LOCATION_ID || 'PvyvSAbJ5bJWe7LadYX4';

    const client = new GHLClient(apiKey, locationId);

    // Parse business name into first/last
    const parts = (businessName || '').split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    // Sync lead to GHL pipeline (contact, tags, opportunity)
    const result = await client.syncLeadToPipeline({
      email,
      phone: phone || '',
      name: businessName,
      firstName,
      lastName,
      url_audited: url,
      primary_leak: primaryLeak,
      lead_impact: leadImpact,
      source: 'Website Auditor — Lead Capture Form',
      sms_consent: smsConsent === true,
    });

    // Crawl the full site and generate the comprehensive report after the response has
    // been sent, so a slow multi-page crawl never delays lead capture. Best-effort:
    // never throws past this point, so a crawl failure can't break lead capture.
    after(async () => {
      try {
        console.log(`Full site audit starting for ${url} (contact ${result.contact.id})`);
        const fullReport = await runFullSiteAudit(url);
        console.log(`Full site audit finished for ${url}: ${fullReport.pagesCrawled} page(s) crawled, ${fullReport.brokenLinks.length} broken link(s)`);
        if (fullReport.summaryText) {
          await client.updateContactCustomField(result.contact.id, 'full_audit_report', fullReport.summaryText);
          // Tag added only once the report is actually on the contact — this is the
          // trigger a GHL workflow should use to send the report email, so it never
          // fires before full_audit_report has real content.
          await client.addTags(result.contact.id, ['audit-report-ready']);
          console.log(`Full report written to contact ${result.contact.id} and tagged audit-report-ready`);
        } else {
          console.warn(`Full site audit produced no summaryText for ${url}, skipping contact update`);
        }
      } catch (err) {
        console.warn('Full site audit failed:', err);
      }
    });

    return NextResponse.json({
      success: true,
      leadId: result.contact.id,
      opportunityId: result.opportunity?.id || null,
    });
  } catch (error: any) {
    console.error('Lead Capture Error:', error);

    let userMessage = "We couldn't submit your diagnosis request. Please try again.";
    if (error.message?.includes('timeout') || error.name === 'AbortError') {
      userMessage = 'That took too long to process. Please try again.';
    } else if (
      error.message?.includes('ENOTFOUND') ||
      error.message?.includes('EAI_AGAIN') ||
      error.message?.includes('fetch failed')
    ) {
      userMessage = "We're having trouble reaching our systems right now. Please try again in a few minutes.";
    }

    return NextResponse.json({
      success: false,
      error: userMessage,
    }, { status: 500 });
  }
}
