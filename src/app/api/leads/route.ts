import { NextRequest, NextResponse, after } from 'next/server';
import { GHLClient } from '@/lib/ghl';
import { runFullSiteAudit } from '@/lib/apify-audit-client';

// Gives the after() background audit room to finish without delaying the response
// (Hobby-plan-safe ceiling; raise if your Vercel plan allows longer function duration).
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, businessName, url, primaryLeak, leadImpact } = body;

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

    // Sync lead to GHL pipeline and enroll in AI Outbound workflow
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
    });

    // Generate the full multi-page report via the site-audit Apify Actor after the
    // response has been sent, so a slow crawl never delays lead capture. Best-effort:
    // silently does nothing if unconfigured, slow, or erroring.
    after(async () => {
      const fullReport = await runFullSiteAudit(url);
      if (fullReport?.summaryText) {
        await client.updateContactCustomField(result.contact.id, 'full_audit_report', fullReport.summaryText);
      }
    });

    return NextResponse.json({
      success: true,
      leadId: result.contact.id,
      opportunityId: result.opportunity?.id || null,
    });
  } catch (error: any) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to capture lead',
    }, { status: 500 });
  }
}
