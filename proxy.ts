import { NextRequest, NextResponse } from "next/server";

// Role-based route protection
const ROLE_BASED_ROUTES = {
    ADMIN: [
        '/dashboard/admin',
        '/admin',
    ],
    GUIDE: [
        '/guide',
        '/dashboard/guide',
    ],
    TOURIST: [
        '/tourist',
        '/dashboard/tourist',
    ]
};

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const userRole = request.cookies.get('userRole')?.value; // Assuming you store role in cookie
    const { pathname } = request.nextUrl;

    console.log(`Middleware: ${pathname} | Token: ${token ? 'Yes' : 'No'} | Role: ${userRole || 'None'}`);

    // ALL protected paths (requires any authentication)
    const protectedPaths = [
        '/dashboard',
        '/profile',
        '/settings',
        '/appointments',
        '/admin',
        '/guide',
        '/tourist',
    ];

    // Authentication routes
    const authRoutes = [
        '/login',
        '/signup',
        '/register',
        '/forgot-password',
    ];

    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // 1. Check if user is trying to access auth route while logged in
    if (isAuthRoute && token) {
        console.log(`Auth route accessed while logged in: ${pathname}`);
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Check if user is trying to access protected route without auth
    if (isProtectedPath && !token) {
        console.log(`Protected route accessed without auth: ${pathname}`);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Optional: Role-based access control
    if (token && userRole) {
        // Check if user is trying to access admin routes without admin role
        if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
            console.log(`Non-admin trying to access admin route: ${userRole} on ${pathname}`);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Check if user is trying to access guide routes without guide role
        if (pathname.startsWith('/guide') && userRole !== 'GUIDE') {
            console.log(`Non-guide trying to access guide route: ${userRole} on ${pathname}`);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Check if user is trying to access tourist routes without tourist role
        if (pathname.startsWith('/tourist') && userRole !== 'TOURIST') {
            console.log(`Non-tourist trying to access tourist route: ${userRole} on ${pathname}`);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except static files
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};

// Configuration: role -> allowed route prefixes
// Keep prefixes minimal ("/admin", "/doctor", "/patient") so subpaths are covered
// ---------------------------

// const roleBasedRoutes:Record<string, string[]> = {
//     ADMIN: ["/admin"],
//     DOCTOR: ["/doctor"],
//     PATIENT: ["/patient"]
// }

// // routes used for authRoutes (public)

// const authRoutes = ["/login", "/register", "/forgot-password"];

// // utility to ridirect to login with a redirect query param

// function redirectToLogin(request: NextRequest) {
//     const { pathname } = request.nextUrl;
//     return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url))
// }


// //  middleware function 

// export async function proxy(request: NextRequest) {
//     const { pathname } = request.nextUrl;



//     // 2) Read tokens from cookies

//     const accessToken = request.cookies.get('accessToken')?.value
//     const refreshToken = request.cookies.get('refreshToken')?.value


//     if (!accessToken && !refreshToken && !authRoutes.includes(pathname)) {
//         return redirectToLogin(request)
//     }

//     if(accessToken && authRoutes.includes(pathname)){
//         return NextResponse.redirect(new URL('/', request.url))
//     }

//     console.log("from authroutes pathname:", authRoutes.includes(pathname))

//     let user:userInterface | null = null;

//     if (accessToken) {
//         try {
//             user = jwtDecode(accessToken)
//         } catch (err) {
//             console.log(err)
//         }
//     }

//     // refresh token x for now close


//     // 6. if we have a user, enforce role based routes

   


//     if (user) {
//         const allowedRoutes = user ? roleBasedRoutes[user.userRole] : [];
//         console.log("from allowed routes...................",allowedRoutes)
//         if (allowedRoutes && allowedRoutes.some((r) => pathname.startsWith(r))) {
             
//             return NextResponse.next();
//         } else {
//             return NextResponse.redirect(new URL(`/unauthorized`, request.url));
//         }
//     }

//      console.log("from authroutes pathname:", authRoutes.includes(pathname))

//     if (user && authRoutes.includes(pathname)) {
//         return NextResponse.redirect(new URL(`/`));
//     }


//     return NextResponse.next()

// }

// export const config = {
//   matcher: ["/admin/dashboard/:path*", "/login", "/register", "/forgot-password"],
// };