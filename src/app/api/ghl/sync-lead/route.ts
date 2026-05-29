import { NextRequest, NextResponse } from 'next/server';
import { GHLClient } from '@/lib/ghl';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, url, grade, leakEstimate, niche, name, phone } = body;

    if (!email || !url) {
      return NextResponse.json({ error: 'Email and URL are required' }, { status: 400 });
    }

    // In a real scenario, these would come from environment variables
    // The values below were provided by the lead
    const apiKey = process.env.GHL_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlB2eXZTQWJKNWJKV2U3TGFkWVg0IiwidmVyc2lvbiI6MSwiaWF0IjoxNzc3NDA5MzMwODMyLCJzdWIiOiJEdlpaVDFudWE2UFlHMGtmbG1HdCJ9.VRSspNlvwVrxoiniwzdu1aTCHCU53omX0kK4-LffpHQ';
    const locationId = process.env.GHL_LOCATION_ID || 'PVyvSAbJ5bJWe7LadYX4';

    const client = new GHLClient(apiKey, locationId);

    const result = await client.syncLeadToPipeline({
      email,
      url_audited: url,
      audit_grade: grade,
      revenue_leak_estimate: leakEstimate,
      business_niche: niche,
      name,
      phone,
      source: 'Auditor Form'
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
