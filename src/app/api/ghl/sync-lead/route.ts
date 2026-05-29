import { NextRequest, NextResponse } from 'next/server';
import { GHLClient } from '@/lib/ghl';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, url, grade, leakEstimate, niche, name, phone, source, value } = body;

    if (!email || !url) {
      return NextResponse.json({ error: 'Email and URL are required' }, { status: 400 });
    }

    // In a real scenario, these would come from environment variables
    // The values below were updated to use the PIT token
    const apiKey = process.env.GHL_API_KEY || 'pit-60eefe1e-4c23-4c63-a3a8-82d77dac050c';
    const locationId = process.env.GHL_LOCATION_ID || 'PvyvSAbJ5bJWe7LadYX4';

    const client = new GHLClient(apiKey, locationId);

    const result = await client.syncLeadToPipeline({
      email,
      url_audited: url,
      audit_grade: grade,
      revenue_leak_estimate: leakEstimate,
      business_niche: niche,
      name,
      phone,
      source: source || 'Auditor Form',
      value: value
    });

    return NextResponse.json({ success: true, opportunityId: result.opportunity.id });
  } catch (error: any) {
    console.error('GHL Sync Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to sync lead to GHL' 
    }, { status: 500 });
  }
}
