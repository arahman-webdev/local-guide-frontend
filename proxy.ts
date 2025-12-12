// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// export async function proxy(request: NextRequest) {
//     const { pathname } = request.nextUrl;
    
//     console.log(`[Middleware] Path: ${pathname}`);
    
//     // Public routes - always allow
//     const publicRoutes = [
//         '/',
//         '/login',
//         '/signup',
//         '/about',
//         '/contact',
//         '/blog',
//         '/tours',
//         '/tours/[slug]',
//         '/api/auth/login',
//         '/api/auth/signup',
//         '/api/auth/logout',
//         '/_next/',
//         '/public/'
//     ];
    
//     const isPublicRoute = publicRoutes.some(route => 
//         pathname === route || pathname.startsWith(route)
//     );
    
//     if (isPublicRoute) {
//         return NextResponse.next();
//     }
    
//     // Check for token in multiple places
//     const token = 
//         request.cookies.get('accessToken')?.value ||
//         request.headers.get('authorization')?.replace('Bearer ', '') ||
//         request.headers.get('x-access-token');
    
//     console.log(`[Middleware] Token found: ${token ? 'YES' : 'NO'}`);

//     console.log("from proxy......................................................................", token)
    
//     // If no token and accessing protected route
//     if (!token && pathname.startsWith('/dashboard')) {
//         console.log(`[Middleware] Redirecting to login from ${pathname}`);
//         const loginUrl = new URL('/login', request.url);
//         loginUrl.searchParams.set('redirect', pathname);
//         return NextResponse.redirect(loginUrl);
//     }
    
//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico).*)',
//     ],
// };


// middleware.ts
// middleware.ts - SIMPLIFIED FOR LOCALSTORAGE
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    console.log(`[Middleware] Path: ${pathname}`);
    
    // ========== PUBLIC ROUTES (ALWAYS ALLOW) ==========
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
        '/api/tour',
        '/api/payment',
        '/_next/',
        '/public/',
        '/favicon.ico',
        '/payment/success'
    ];
    
    // Check if route is public
    const isPublicRoute = publicRoutes.some(route => {
        if (route === '/tours' && pathname.startsWith('/tours/')) {
            return true; // All tour detail pages
        }
        if (route === '/api/' && pathname.startsWith('/api/')) {
            return true; // API auth handled by backend
        }
        return pathname === route || pathname.startsWith(route);
    });
    
    if (isPublicRoute) {
        return NextResponse.next();
    }
    
    // ========== AUTH ROUTES ==========
    const authRoutes = ['/login', '/signup', '/register', '/forgot-password'];
    const isAuthRoute = authRoutes.includes(pathname);
    
    // ========== GET TOKEN FROM HEADERS ==========
    // Middleware can't read localStorage, so frontend must send token in headers
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.headers.get('x-access-token');
    
    // Get user role from headers
    const userRole = request.headers.get('x-user-role');
    
    console.log(`[Middleware] Token from headers: ${token ? 'YES' : 'NO'}`);
    console.log(`[Middleware] User role: ${userRole || 'NOT FOUND'}`);
    
    // ========== RULE 1: Block logged-in users from auth routes ==========
    if (token && isAuthRoute) {
        console.log(`[Middleware] Logged-in user trying to access ${pathname}, redirecting...`);
        
        // Redirect based on role
        let redirectUrl = '/dashboard';
        if (userRole === 'ADMIN') redirectUrl = '/dashboard/admin';
        if (userRole === 'GUIDE') redirectUrl = '/dashboard/guide';
        if (userRole === 'TOURIST') redirectUrl = '/dashboard/tourist';
        
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    
    // ========== RULE 2: Protect dashboard routes ==========
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            console.log(`[Middleware] No token for ${pathname}, redirecting to login`);
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
        
        // ========== RULE 3: Role-based access (optional) ==========
        // You can remove this if you don't need strict role separation
        if (userRole) {
            const isAdminRoute = pathname.startsWith('/dashboard/admin');
            const isGuideRoute = pathname.startsWith('/dashboard/guide');
            const isTouristRoute = pathname.startsWith('/dashboard/profile');
            
            // Basic role checks - customize as needed
            if (isAdminRoute && userRole !== 'ADMIN') {
                console.log(`[Middleware] Role mismatch for ${pathname}`);
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
    }
    
    // ========== ALLOW ALL OTHER REQUESTS ==========
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protect only specific routes
        '/dashboard/:path*',
        '/login',
        '/signup',
        '/register',
    ],
};