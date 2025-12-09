// utils/auth-header.ts
export const getAuthHeaders = () => {
    if (typeof window === 'undefined') {
        return {};
    }
    
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
    
    const headers: Record<string, string> = {};
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['X-Access-Token'] = token;
    }
    
    if (userRole) {
        headers['X-User-Role'] = userRole;
    }
    
    return headers;
};

// Usage in fetch calls
const response = await fetch('/api/something', {
    headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
    },
});