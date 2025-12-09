export const getMyProfile = async () => {
    try {
        // Get token from multiple sources (cookie, localStorage, sessionStorage)
        let token:string | null = null;
        
       
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('accessToken') || 
                    sessionStorage.getItem('token') ||
                    getCookie('accessToken');
        }
        
        console.log('Fetching profile with token:', token ? 'Token found' : 'No token');

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Add authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            method: "GET",
            headers: headers,
            credentials: "include" // Still include cookies as backup
        });

        console.log('Profile response status:', res.status);

        if (!res.ok) {
            if (res.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userRole');
                sessionStorage.removeItem('token');
            }
            throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();
        console.log('Profile data:', data);

        return {
            isAuthenticated: true,
            data: data?.data,
            message: data?.message
        };

    } catch (err: any) {
        console.log('Profile fetch error:', err);
        return {
            isAuthenticated: false,
            data: null,
            error: err.message
        };
    }
};

// Helper function to get cookie
const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

// log out 

export const logOut = async () => {
    try {
        console.log('Logging out...');
        
        // 1. Call backend logout endpoint
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { // Fixed URL
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include" // Important for cookies
        });

        console.log('Logout response status:', res.status);

        // 2. Clear frontend storage regardless of backend response
        if (typeof window !== 'undefined') {
            // Clear localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('user');
            
            // Clear sessionStorage
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userRole');
            
            // Clear cookies
            document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            console.log('Frontend storage cleared');
        }

        // 3. Check backend response
        if (!res.ok) {
            console.warn('Backend logout failed, but frontend storage cleared');
            // Don't throw error here, we've already cleared frontend
        } else {
            const data = await res.json();
            console.log('Backend logout response:', data);
        }

        return { 
            success: true,
            message: 'Logged out successfully'
        };

    } catch (err: any) {
        console.error('Logout error:', err);
        
        // Still clear frontend storage even if there's an error
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
            // Clear auth-related cookies
            document.cookie.split(";").forEach(c => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        }
        
        return { 
            success: false, 
            error: err.message || 'Logout failed'
        };
    }
}