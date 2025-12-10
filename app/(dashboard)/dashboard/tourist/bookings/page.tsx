'use client'; // Make it a client component

import MyBooking from "@/components/Dashboard/Tourist/MyBooking";
import { useRouter } from "next/navigation"
import { useState, useEffect } from 'react';

// Define the Booking interface to match what MyBooking expects
interface Booking {
  id: string;
  bookingCode: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  tour: {
    id: string;
    title: string;
        tourImages:{
      id:string
      imageUrl: string
    }[];
  };
  user?: {
    id: string;
    role: string;
  };
  hasReviewed?: boolean;
}

export default function TouristBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      const userRole = localStorage.getItem('userRole');
      
      // Check if user is tourist
      if (userRole !== 'TOURIST') {
        setError('Access denied. Tourist privileges required.');
        return;
      }
      
      if (!token) {
        setError('Please login first');
        router.push('/login');
        return;
      }

      console.log('Fetching bookings from:', `${process.env.NEXT_PUBLIC_API_URL}/bookings/my`);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log('Response status:', res.status);
      
      if (res.status === 401) {
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
        throw new Error(result.message || 'Failed to fetch bookings');
      }

      // Transform the data to match the expected format
      const transformedBookings = result.data.map((booking: any) => ({
        id: booking.id || '',
        bookingCode: booking.bookingCode || 'N/A',
        startTime: booking.startTime || new Date().toISOString(),
        endTime: booking.endTime || new Date().toISOString(),
        status: booking.status || 'PENDING',
        tour: {
          id: booking.tour?.id || '',
          title: booking.tour?.title || 'Unknown Tour',
          tourImages: booking.tour?.tourImages || []
        },
        user: {
          id: booking.user?.id || '',
          role: booking.user?.role || 'TOURIST'
        },
        hasReviewed: booking.hasReviewed || false
      }));

      console.log("Transformed bookings:", transformedBookings);
      setBookings(transformedBookings);
      
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Bookings</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchBookings}
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

  return <MyBooking bookings={bookings} />;
}