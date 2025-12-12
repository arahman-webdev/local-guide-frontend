// components/RouteGuard.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function RouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Don't run on server side
    if (typeof window === 'undefined') return;

    // Get redirect parameter from URL without useSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');

    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');

    console.log('RouteGuard checking:', { 
      pathname, 
      token, 
      userRole,
      redirectParam 
    });

    // Auth pages that logged-in users shouldn't access
    const authPages = ['/login', '/signup', '/register'];
    const isAuthPage = authPages.includes(pathname);

    // If logged in and trying to access auth page
    if (token && isAuthPage) {
      console.log('Redirecting logged-in user from auth page');
      
      // If there's a redirect param, use it (decoded)
      if (redirectParam) {
        const decodedRedirect = decodeURIComponent(redirectParam);
        console.log('Using redirect param:', decodedRedirect);
        router.replace(decodedRedirect);
        return;
      }
      
      // Otherwise redirect based on role
      let redirectUrl = '/';
      if (userRole === 'ADMIN') redirectUrl = '/dashboard/admin';
      else if (userRole === 'GUIDE') redirectUrl = '/dashboard/guide';
      else if (userRole === 'TOURIST') redirectUrl = '/dashboard/profile';
      
      router.replace(redirectUrl);
      return;
    }

    // Protected pages that require login
    const protectedPages = ['/dashboard', '/profile', '/settings', '/account'];
    const isProtectedPage = protectedPages.some(page => 
      pathname.startsWith(page)
    );

    // If not logged in and trying to access protected page
    if (!token && isProtectedPage) {
      console.log('Redirecting to login from protected page');
      // Encode the pathname for URL
      const encodedPath = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${encodedPath}`);
      return;
    }

    // Role-based routing for dashboard
    if (token && pathname.startsWith('/dashboard')) {
      // Check if user is accessing their correct dashboard
      const shouldBeOnAdmin = userRole === 'ADMIN' && !pathname.startsWith('/dashboard/admin');
      const shouldBeOnGuide = userRole === 'GUIDE' && !pathname.startsWith('/dashboard/guide');
      const shouldBeOnTourist = userRole === 'TOURIST' && !pathname.startsWith('/dashboard/profile');
      
      if (shouldBeOnAdmin || shouldBeOnGuide || shouldBeOnTourist) {
        console.log('Redirecting to correct dashboard based on role');
        let correctDashboard = '/dashboard';
        if (userRole === 'ADMIN') correctDashboard = '/dashboard/admin';
        else if (userRole === 'GUIDE') correctDashboard = '/dashboard/guide';
        else if (userRole === 'TOURIST') correctDashboard = '/dashboard/profile';
        
        router.replace(correctDashboard);
        return;
      }
    }

  }, [pathname, router]); 

  return null;
}