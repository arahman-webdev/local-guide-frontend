// hooks/useRouteGuard.ts
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Don't run on server side
    if (typeof window === 'undefined') return;

    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');

    console.log('RouteGuard checking:', { pathname, token, userRole });

    // Auth pages - redirect if logged in
    const authPages = ['/login', '/signup', '/register'];
    const isAuthPage = authPages.includes(pathname);

    if (token && isAuthPage) {
      console.log('Redirecting logged-in user from auth page');
      let redirectUrl = '/dashboard';
      if (userRole === 'ADMIN') redirectUrl = '/dashboard/admin';
      else if (userRole === 'GUIDE') redirectUrl = '/dashboard/guide';
      else if (userRole === 'TOURIST') redirectUrl = '/dashboard/tourist';
      
      router.replace(redirectUrl);
      return;
    }

    // Protected pages - redirect if not logged in
    const protectedPages = ['/dashboard', '/profile', '/settings'];
    const isProtectedPage = protectedPages.some(page => pathname.startsWith(page));

    if (!token && isProtectedPage) {
      console.log('Redirecting to login from protected page');
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    // Role-based protection for dashboard
    if (token && pathname.startsWith('/dashboard')) {
      if (userRole === 'ADMIN' && !pathname.startsWith('/dashboard/admin')) {
        router.replace('/dashboard/admin');
      } else if (userRole === 'GUIDE' && !pathname.startsWith('/dashboard/guide')) {
        router.replace('/dashboard/guide');
      } else if (userRole === 'TOURIST' && !pathname.startsWith('/dashboard/tourist')) {
        router.replace('/dashboard/profile');
      }
    }
  }, [pathname, router]);
}