import { NextRequest, NextResponse } from 'next/server';
import { GHLClient } from '@/lib/ghl';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, businessName, url, grade, leakEstimate } = body;

    if (!email || !url) {
      return NextResponse.json({ error: 'Email and URL are required' }, { status: 400 });
    }

    // Use existing GHL integration settings
    const apiKey = process.env.GHL_API_KEY || 'pit-60eefe1e-4c23-4c63-a3a8-82d77dac050c';
    const locationId = process.env.GHL_LOCATION_ID || 'PvyvSAbJ5bJWe7LadYX4';

    const client = new GHLClient(apiKey, locationId);

    // Sync lead to GHL pipeline
    const result = await client.syncLeadToPipeline({
      email,
      phone,
      name: businessName,
      url_audited: url,
      audit_grade: grade,
      revenue_leak_estimate: leakEstimate,
      source: 'Audit Lead Capture',
    });

    return NextResponse.json({ 
      success: true, 
      leadId: result.contact.id,
      opportunityId: result.opportunity.id 
    });
  } catch (error: any) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to capture lead' 
    }, { status: 500 });
  }
}
