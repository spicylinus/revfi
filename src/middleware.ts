import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/delivery', '/projects', '/mockups'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for auth cookie
    const sessionToken = request.cookies.get('auth-session')?.value;

    if (!sessionToken) {
      // Redirect to login if no session token
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/delivery/:path*', '/projects/:path*', '/mockups/:path*'],
};
