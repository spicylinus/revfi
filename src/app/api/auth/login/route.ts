import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Known client accounts (in production, these come from a database)
const CLIENT_ACCOUNTS: Record<string, { passwordHash: string; role: 'client'; clientId: string }> = {};

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function getAdminHash(): string {
  // Hash of 'sociallinus2026' — update ADMIN_PASSWORD_HASH env var to change
  return process.env.ADMIN_PASSWORD_HASH || sha256('sociallinus2026');
}

function signSession(payload: object): string {
  const secret = process.env.SESSION_SECRET || 'fallback-secret-change-in-production';
  const data = JSON.stringify(payload);
  const sig = sha256(data + secret);
  return Buffer.from(JSON.stringify({ data, sig })).toString('base64');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const passwordHash = sha256(password);

    // Admin login
    if (email === (process.env.ADMIN_EMAIL || 'hey@sociallinus.com') && passwordHash === getAdminHash()) {
      const sessionToken = signSession({
        email,
        role: 'admin',
        clientId: null,
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
      return NextResponse.json({ success: true, user: { email, role: 'admin', clientId: null } });
    }

    // Client login
    const client = CLIENT_ACCOUNTS[email];
    if (client && client.passwordHash === passwordHash) {
      const sessionToken = signSession({
        email,
        role: 'client',
        clientId: client.clientId,
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
      return NextResponse.json({ success: true, user: { email, role: 'client', clientId: client.clientId } });
    }

    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
