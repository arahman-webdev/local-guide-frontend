'use client'; // Make it a client component

import { useState, useEffect } from 'react';
import ManageUsers from '@/components/Admin/ManageUsers';
import { useRouter } from 'next/navigation';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      const userRole = localStorage.getItem('userRole');
      
      console.log('Token from localStorage:', token ? 'Found' : 'Not found');
      console.log('User role:', userRole);
      
      // Check if user is admin
      if (userRole !== 'ADMIN') {
        setError('Access denied. Admin privileges required.');
        return;
      }
      
      if (!token) {
        setError('Please login first');
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // credentials: "include", // Remove this for now
      });

      console.log('Response status:', res.status);
      
      if (res.status === 401) {
        // Clear storage and redirect to login
        localStorage.clear();
        sessionStorage.clear();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error: ${res.status}`);
      }

      const result = await res.json();
      console.log('API response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch users');
      }

      setUsers(result.data || []);
      
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Users</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchUsers}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Try Again
            </button>
            <a
              href="/dashboard/admin"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <ManageUsers users={users}  />;
}