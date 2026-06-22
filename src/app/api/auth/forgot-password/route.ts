import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { generateResetToken } from '@/lib/auth-store';

async function sendResetEmail(toEmail: string, resetUrl: string): Promise<void> {
  const region = process.env.AWS_SES_REGION || 'us-east-1';
  const client = new SESClient({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

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
    .body p { color: #475569; line-height: 1.6; margin: 0 0 16px; font-size: 15px; }
    .cta { display: inline-block; background: #1E3A5F; color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; margin: 24px 0; }
    .link { word-break: break-all; color: #3B82F6; font-size: 13px; }
    .footer { padding: 24px 32px; background: #f8fafc; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔑 Password Reset Request</h1>
      <p>Social Linus — Admin Portal</p>
    </div>
    <div class="body">
      <p>We received a request to reset your Social Linus admin password. Click the button below to set a new one. This link expires in <strong>1 hour</strong>.</p>
      <p style="text-align: center;"><a href="${resetUrl}" class="cta">Reset My Password →</a></p>
      <p class="link">Or copy and paste this link into your browser:<br>${resetUrl}</p>
      <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">If you didn't request a password reset, you can safely ignore this email. Someone may have entered your address by mistake.</p>
    </div>
    <div class="footer">
      <p>Social Linus Portal — support@sociallinus.com</p>
    </div>
  </div>
</body>
</html>`;

  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL || 'support@sociallinus.com',
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: '🔑 Reset Your Social Linus Password', Charset: 'UTF-8' },
      Body: { Html: { Data: htmlBody, Charset: 'UTF-8' } },
    },
  });

  await client.send(command);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'hey@sociallinus.com';
    const isKnownUser = email === adminEmail;

    // Always return success to prevent email enumeration attacks
    if (!isKnownUser) {
      return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const token = generateResetToken(email);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.sociallinus.com';
    const resetUrl = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await sendResetEmail(email, resetUrl);

    return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Failed to send reset email. Please try again.' }, { status: 500 });
  }
}
