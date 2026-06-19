import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

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
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || 'hey@sociallinus.com';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || sha256('sociallinus2026');

    // Admin authentication
    const isAdmin = email === adminEmail && sha256(password) === adminPasswordHash;

    // Client authentication (matches against known client emails)
    // Clients authenticate by email — password is their business name or "client123"
    const knownClients: Record<string, string> = {
      'sprucesalonaustin@gmail.com': 'spruce-salon',
      'info@beyondwow.com': 'beyond-wow',
      'client@example.com': 'sd-plumbing',
    };
    const isClient = !!knownClients[email] && (password === 'client123' || password === knownClients[email]);

    if (isAdmin || isClient) {
      const role = isAdmin ? 'admin' : 'client';
      const clientId = isAdmin ? null : knownClients[email];

      const sessionToken = signSession({
        email,
        role,
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

      return NextResponse.json({
        success: true,
        user: { email, role, clientId }
      });
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
