import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Mock authentication logic
    // In a real app, you would check this against a database
    const isAdmin = email === 'owner@sociallinus.com' && password === 'sociallinus2026';
    
    // For clients, we could check if the email exists in our leads/customers
    // For this demonstration, we'll allow a mock client
    const isClient = email === 'client@example.com' && password === 'client123';

    if (isAdmin || isClient) {
      // Create a session token (in a real app, this should be a signed JWT)
      const sessionToken = btoa(JSON.stringify({ 
        email, 
        role: isAdmin ? 'admin' : 'client',
        clientId: isAdmin ? null : 'sd-plumbing',
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }));

      // Set auth cookie
      const cookieStore = await cookies();
      cookieStore.set('auth-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return NextResponse.json({ 
        success: true, 
        user: { 
          email, 
          role: isAdmin ? 'admin' : 'client',
          clientId: isAdmin ? null : 'sd-plumbing'
        } 
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
