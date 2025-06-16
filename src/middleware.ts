import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/sign-in', '/sign-up'] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const memberUuid = request.cookies.get('memberUuid')?.value;

  const isPublicPath = publicPaths.some(
    (path) => path === pathname || pathname.startsWith(path + '/'),
  );

  if (isPublicPath) {
    if (accessToken && ['/sign-in', '/sign-up'].includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  if (memberUuid) {
    requestHeaders.set('X-Member-UUID', memberUuid);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
