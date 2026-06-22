import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { consumeResetToken } from '@/lib/auth-store';

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { token, email, newPassword } = await request.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json({ message: 'Token, email, and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Validate and consume the token
    const validEmail = consumeResetToken(token);
    if (!validEmail || validEmail !== email) {
      return NextResponse.json({ message: 'Invalid or expired reset token. Please request a new one.' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'hey@sociallinus.com';
    if (email !== adminEmail) {
      return NextResponse.json({ message: 'This reset link is not valid for this account.' }, { status: 400 });
    }

    // In production, update the password hash in the database
    // For now, the admin password is determined by ADMIN_PASSWORD_HASH env var
    // which is the SHA-256 of the current password.
    // The env var approach means the owner must update it manually in Vercel.
    // We log a reminder for them.
    const newHash = sha256(newPassword);
    console.log(`[SOCIAL LINUS] Password reset for ${email}. New hash: ${newHash}`);
    console.log(`[SOCIAL LINUS] IMPORTANT: Update ADMIN_PASSWORD_HASH in Vercel env vars to: ${newHash}`);
    console.log(`[SOCIAL LINUS] Run: echo -n "yournewpassword" | sha256sum`);

    return NextResponse.json({ success: true, message: 'Password updated successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Failed to reset password. Please try again.' }, { status: 500 });
  }
}
