import { NextRequest, NextResponse } from 'next/server';
import { GHLClient } from '@/lib/ghl';

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
