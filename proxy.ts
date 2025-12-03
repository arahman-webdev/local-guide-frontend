import { NextRequest, NextResponse } from "next/server";


export function proxy(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value

    console.log("token", token)

    const { pathname } = request.nextUrl // /dashboard, /login etc

    const protedPaths = ['/dashboard', '/profile', '/settings', '/appointments']

    const isProtectPath = protedPaths.some((path) => pathname.startsWith(path)) // to get single path using some that means map



    const authRoutes = ['/login', '/signup', '/forgot-password'] 

    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route)) // to get single path using some that means map



    if (isProtectPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }


    if(isAuthRoute && token){
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()

}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/forgot-password'],
}

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