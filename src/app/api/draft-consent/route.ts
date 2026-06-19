import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

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

// Build the draft preview URL
function buildPreviewUrl(clientId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://app.sociallinus.com';
  return `${base}/delivery/${clientId}`;
}

// Send email via AWS SES
async function sendEmail(toEmail: string, subject: string, htmlBody: string): Promise<boolean> {
  const region = process.env.AWS_SES_REGION || 'us-east-1';
  const client = new SESClient({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL || 'hey@sociallinus.com',
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: { Html: { Data: htmlBody, Charset: 'UTF-8' } },
    },
  });

  try {
    await client.send(command);
    return true;
  } catch (err) {
    console.error('SES send error:', err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { phone, email, consent, clientId, businessName } = await request.json();

    if (!phone && !email) {
      return NextResponse.json({ success: false, message: 'Phone or email required' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ success: false, message: 'Consent is required' }, { status: 400 });
    }

    const previewUrl = buildPreviewUrl(clientId);

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

    // 3. Send emails
    const emailResults: { email?: boolean; sms?: boolean } = {};

    if (email) {
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            .header { background: #1E3A5F; padding: 32px; text-align: center; }
            .header h1 { color: #ffffff; font-size: 24px; margin: 0 0 8px; }
            .header p { color: rgba(255,255,255,0.7); margin: 0; font-size: 14px; }
            .body { padding: 40px 32px; }
            .body h2 { color: #1E293B; font-size: 20px; margin: 0 0 16px; }
            .body p { color: #475569; line-height: 1.6; margin: 0 0 16px; font-size: 15px; }
            .cta { display: inline-block; background: #1E3A5F; color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; margin: 24px 0; }
            .footer { padding: 24px 32px; background: #f8fafc; text-align: center; }
            .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Your Draft Preview is Ready</h1>
              <p>Social Linus — Website Redesign</p>
            </div>
            <div class="body">
              <h2>Hi there,</h2>
              <p>Thanks for your interest in seeing your website redesign before it goes live. You can access your secure preview at any time using the button below.</p>
              <p style="text-align: center;"><a href="${previewUrl}" class="cta">View My Draft Preview →</a></p>
              <p>This link is personal to you and expires in 24 hours. If it has expired, just reply to this email and we'll send you a fresh one.</p>
              <p>Have questions? Reply to this email and we'll get back to you within one business day.</p>
            </div>
            <div class="footer">
              <p>You received this because you opted in to receive updates from Social Linus.<br>Stop receiving emails: reply with "unsubscribe."</p>
            </div>
          </div>
        </body>
        </html>
      `;
      emailResults.email = await sendEmail(email, '🔒 Your Draft Preview is Ready — Social Linus', htmlBody);
    }

    // 4. Push to GHL
    let ghlSuccess = false;
    const ghlApiBase = 'https://services.leadconnectorhq.com';
    const ghlToken = process.env.GHL_API_TOKEN;
    const ghlLocationId = process.env.GHL_LOCATION_ID || 'PvyvSAbJ5bJWe7LadYX4';

    if (ghlToken) {
      try {
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

        if (contactId) {
          const PIPELINE_ID = 'tpFymaPJZlMgt5d8RrAd';
          const STAGE_ID = '8bdb09ad-86d4-4bd1-829e-52daa933d294';
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

    return NextResponse.json({
      success: true,
      ghlPushed: ghlSuccess,
      emailSent: emailResults.email ?? false,
      accessUrl: previewUrl,
    });
  } catch (error) {
    console.error('Draft consent error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
