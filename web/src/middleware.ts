import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasRefreshToken = request.cookies.has('refresh_token');

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route),
    );

    if (!hasRefreshToken && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (hasRefreshToken && isPublicRoute) {
        return NextResponse.redirect(new URL('/library', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};