import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
    .creds { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin: 20px 0; }
    .creds-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .creds-row:last-child { margin-bottom: 0; }
    .label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { color: #1E293B; font-family: monospace; font-size: 14px; font-weight: 600; }
    .warning { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-top: 20px; }
    .warning p { color: #92400e; font-size: 13px; margin: 0; }
    .footer { padding: 24px 32px; background: #f8fafc; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Social Linus Admin Access</h1>
      <p>Your admin portal credentials</p>
    </div>
    <div class="body">
      <p>Here are your admin credentials for the Social Linus auditor portal:</p>
      <div class="creds">
        <div class="creds-row">
          <span class="label">Email</span>
          <span class="value">support@sociallinus.com</span>
        </div>
        <div class="creds-row">
          <span class="label">Password</span>
          <span class="value">sociallinus2026</span>
        </div>
        <div class="creds-row">
          <span class="label">Portal URL</span>
          <span class="value">app.sociallinus.com</span>
        </div>
      </div>
      <div class="warning">
        <p><strong>⚠️ For security:</strong> Use a password manager. Change this password immediately using the "Forgot password" flow after your first login. Never share these credentials.</p>
      </div>
      <p style="margin-top: 24px;">You can also reset your password at any time using the <a href="https://app.sociallinus.com/forgot-password">forgot password</a> link on the login page.</p>
    </div>
    <div class="footer">
      <p>Social Linus — support@sociallinus.com</p>
    </div>
  </div>
</body>
</html>`;

const command = new SendEmailCommand({
  Source: 'support@sociallinus.com',
  Destination: { ToAddresses: ['support@sociallinus.com'] },
  Message: {
    Subject: { Data: '🔐 Your Social Linus Admin Credentials', Charset: 'UTF-8' },
    Body: { Html: { Data: htmlBody, Charset: 'UTF-8' } },
  },
});

try {
  const result = await client.send(command);
  console.log('Email sent! Message ID:', result.MessageId);
} catch (err) {
  console.error('Failed to send email:', err);
  process.exit(1);
}
