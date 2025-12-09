// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    console.log(`[Middleware] Path: ${pathname}`);
    
    // Public routes - always allow
    const publicRoutes = [
        '/',
        '/login',
        '/signup',
        '/about',
        '/contact',
        '/blog',
        '/tours',
        '/tours/[slug]',
        '/api/auth/login',
        '/api/auth/signup',
        '/api/auth/logout',
        '/_next/',
        '/public/'
    ];
    
    const isPublicRoute = publicRoutes.some(route => 
        pathname === route || pathname.startsWith(route)
    );
    
    if (isPublicRoute) {
        return NextResponse.next();
    }
    
    // Check for token in multiple places
    const token = 
        request.cookies.get('accessToken')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '') ||
        request.headers.get('x-access-token');
    
    console.log(`[Middleware] Token found: ${token ? 'YES' : 'NO'}`);
    
    // If no token and accessing protected route
    if (!token && pathname.startsWith('/dashboard')) {
        console.log(`[Middleware] Redirecting to login from ${pathname}`);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};