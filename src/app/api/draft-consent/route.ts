import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// In-memory client store (replace with DB in production)
const CLIENT_ACCOUNTS: Record<string, { phone: string; email: string; businessName: string; createdAt: string }> = {};

function sha256(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function signSession(payload: object): string {
  const secret = process.env.SESSION_SECRET || 'fallback-secret';
  const data = JSON.stringify(payload);
  const sig = sha256(data + secret);
  return Buffer.from(JSON.stringify({ data, sig })).toString('base64');
}

export async function POST(request: Request) {
  try {
    const { phone, email, consent, clientId, businessName, source } = await request.json();

    if (!phone && !email) {
      return NextResponse.json({ success: false, message: 'Phone or email required' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ success: false, message: 'Consent is required' }, { status: 400 });
    }

    // 1. Create client account
    const clientKey = phone || email;
    if (!CLIENT_ACCOUNTS[clientKey]) {
      CLIENT_ACCOUNTS[clientKey] = {
        phone: phone || '',
        email: email || '',
        businessName: businessName || clientId,
        createdAt: new Date().toISOString(),
      };
    }

    // 2. Set session cookie so they can access the draft immediately
    const sessionToken = signSession({
      email: email || phone,
      role: 'client',
      clientId,
      expires: Date.now() + 24 * 60 * 60 * 1000,
    });
    const cookieStore = await cookies();
    cookieStore.set('auth-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    // 3. Push to GHL
    let ghlSuccess = false;
    const ghlApiBase = 'https://services.leadconnectorhq.com';
    const ghlToken = process.env.GHL_API_TOKEN;
    const ghlLocationId = process.env.GHL_LOCATION_ID || 'PvyvSAbJ5bJWe7LadYX4';

    if (ghlToken) {
      try {
        // Search for existing contact
        const searchUrl = `${ghlApiBase}/contacts/?locationId=${ghlLocationId}&query=${encodeURIComponent(clientKey)}`;
        const searchRes = await fetch(searchUrl, {
          headers: {
            'Authorization': `Bearer ${ghlToken}`,
            'Version': '2021-07-28',
            'Location-Id': ghlLocationId,
            'Content-Type': 'application/json',
          },
        });
        const searchData = await searchRes.json();
        const existingContact = searchData.contacts?.[0];

        const contactPayload = {
          locationId: ghlLocationId,
          email: email || undefined,
          phone: phone || undefined,
          source: 'Website Auditor',
          customFields: [
            { id: 'url_audited', value: clientId },
            { id: 'audit_grade', value: 'Draft Preview' },
            { id: 'revenue_leak_estimate', value: 0 },
            { id: 'business_niche', value: businessName },
          ].filter(f => f.value),
        };

        let contactId: string;
        if (existingContact) {
          contactId = existingContact.id;
          await fetch(`${ghlApiBase}/contacts/${contactId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${ghlToken}`,
              'Version': '2021-07-28',
              'Location-Id': ghlLocationId,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactPayload),
          });
        } else {
          const created = await fetch(`${ghlApiBase}/contacts/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ghlToken}`,
              'Version': '2021-07-28',
              'Location-Id': ghlLocationId,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactPayload),
          });
          const createdData = await created.json();
          contactId = createdData.contact?.id;
        }

        // Create opportunity in pipeline
        if (contactId) {
          const PIPELINE_ID = 'tpFymaPJZlMgt5d8RrAd';
          const STAGE_ID = '8bdb09ad-86d4-4bd1-829e-52daa933d294'; // New Leads
          await fetch(`${ghlApiBase}/opportunities/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ghlToken}`,
              'Version': '2021-07-28',
              'Location-Id': ghlLocationId,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pipelineId: PIPELINE_ID,
              locationId: ghlLocationId,
              contactId,
              name: `Draft Preview — ${businessName || clientId}`,
              status: 'open',
              pipelineStageId: STAGE_ID,
              source: 'Draft Preview Opt-In',
              customFields: [
                { id: 'contact.lead_source', value: 'Draft Preview Consent' },
              ],
            }),
          });
        }
        ghlSuccess = true;
      } catch (ghlErr) {
        console.error('GHL push failed:', ghlErr);
      }
    }

    // 4. In production, send SMS/email with the login link here
    // For now, we set the cookie so they can access immediately
    // SMS would use Twilio: await sendSMS(phone, `View your draft: app.sociallinus.com/delivery/${clientId}`)

    return NextResponse.json({
      success: true,
      ghlPushed: ghlSuccess,
      accessUrl: `/delivery/${clientId}`,
    });
  } catch (error) {
    console.error('Draft consent error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
