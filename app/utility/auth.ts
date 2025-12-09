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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        })

        if (!res.ok) {
            throw new Error("Failed to log out")
        }

        return { success: true }

    } catch (err) {
        console.log(err)
        return { success: false, error: err }
    }
}