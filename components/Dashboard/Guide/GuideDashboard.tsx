


// app/dashboard/guide/my-tours/page.tsx
"use client";

import MyTourListing from "@/components/Dashboard/Guide/MyTours";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function GuideDashboard() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      const userRole = localStorage.getItem('userRole');
      
      // Check if user is guide
      if (userRole !== 'GUIDE') {
        setError('Access denied. Guide privileges required.');
        return;
      }
      
      if (!token) {
        setError('Please login first');
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/my-tours`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        console.error('Failed to fetch tours:', res.status, res.statusText);
        throw new Error(`Failed to fetch tours: ${res.status}`);
      }

      const result = await res.json();
      console.log('API response:', result);
      
      // Handle case where API returns success: false
      if (!result.success) {
        console.error('API returned error:', result.message);
        setError(result.message || 'Failed to load tours');
        return;
      }

      const data = result?.data || [];
      console.log("My tours data:", data);
      setTours(data);
      
    } catch (error: any) {
      console.error('Error fetching tours:', error);
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tours...</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Tours</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchTours}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MyTourListing tours={tours} />
    </div>
  );
}