// app/dashboard/page.tsx - Updated with Real APIs
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bell, Package, Users, CreditCard, Settings, TrendingUp, Eye, Star, DollarSign, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'TOURIST' | 'GUIDE'>('TOURIST');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [stats, setStats] = useState({
    upcomingTours: 0,
    pendingRequests: 0,
    activeListings: 0,
    totalEarnings: 0,
    totalBookings: 0,
    averageRating: 4.8, // Default
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [myTours, setMyTours] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check user role from localStorage
    const role = localStorage.getItem('userRole') as 'TOURIST' | 'GUIDE';
    setUserRole(role || 'GUIDE');
    
    if (role === 'GUIDE') {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch guide dashboard data from real APIs
      const [myToursRes, bookingsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/my-tours`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-tours-booking`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      // Handle my-tours response
      let toursData = [];
      if (myToursRes.ok) {
        const result = await myToursRes.json();
        if (result.success) {
          toursData = result.data || [];
        } else {
          console.error('My tours API error:', result.message);
        }
      } else {
        console.error('Failed to fetch tours:', myToursRes.status);
      }

      // Handle bookings response
      let bookingsData = [];
      if (bookingsRes.ok) {
        const result = await bookingsRes.json();
        if (result.success) {
          bookingsData = result.data || [];
        } else {
          console.error('Bookings API error:', result.message);
        }
      } else {
        console.error('Failed to fetch bookings:', bookingsRes.status);
      }

      console.log('Fetched data:', {
        tours: toursData.length,
        bookings: bookingsData.length
      });

      // Calculate statistics from real data
      const activeListings = toursData.filter((tour: any) => 
        tour.isActive === true && tour.status !== 'INACTIVE'
      ).length;

      const upcomingBookingsList = bookingsData.filter((booking: any) => 
        booking.status === 'CONFIRMED' || booking.status === 'PENDING'
      );

      // Get upcoming tours (bookings with confirmed status)
      const upcomingToursCount = upcomingBookingsList.length;

      // Get pending requests (bookings with pending status)
      const pendingRequests = bookingsData.filter((booking: any) => 
        booking.status === 'PENDING'
      ).length;

      // Calculate total earnings from completed bookings
      const totalEarnings = bookingsData.reduce((sum: number, booking: any) => {
        if (booking.status === 'COMPLETED') {
          const amount = 
                    parseFloat(booking?.paymentStatus?.amount) || 0;
          return sum + amount;
        }
        return sum;
      }, 0);

      // Calculate total bookings
      const totalBookings = bookingsData.length;

      // Format upcoming bookings for display
      const formattedUpcomingBookings = upcomingBookingsList.slice(0, 5).map((booking: any) => ({
        id: booking.id || booking._id,
        tourName: booking.tourTitle || 'Unknown Tour',
        touristName: booking.tourist?.name || booking.touristName || 'Unknown Tourist',
        date: formatBookingDate(booking.startTime || booking.bookingDate || booking.createdAt),
        status: booking.status || 'PENDING',
        amount: parseFloat(booking.totalAmount) || parseFloat(booking?.paymentStatus?.amount) || 0,
      }));

      // Generate recent activity from tours and bookings
      const recentActivityList = generateRecentActivity(toursData, bookingsData);

      // Update state
      setStats({
        upcomingTours: upcomingToursCount,
        pendingRequests,
        activeListings,
        totalEarnings,
        totalBookings,
        averageRating: calculateAverageRating(toursData),
      });

      setMyTours(toursData);
      setUpcomingBookings(formattedUpcomingBookings);
      setRecentActivity(recentActivityList);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      
      // Fallback to mock data if API fails
      setStats({
        upcomingTours: 12,
        pendingRequests: 5,
        activeListings: 8,
        totalEarnings: 4250,
        totalBookings: 47,
        averageRating: 4.8,
      });
      
      setRecentActivity([
        { id: 1, type: 'booking', message: 'New booking for Mountain Adventure', time: '2 hours ago' },
        { id: 2, type: 'review', message: 'New 5-star review received', time: '1 day ago' },
        { id: 3, type: 'tour', message: 'City Tour marked as completed', time: '2 days ago' },
        { id: 4, type: 'payment', message: 'Payment received for Wildlife Safari', time: '3 days ago' },
        { id: 5, type: 'update', message: 'Tour schedule updated', time: '1 week ago' },
      ]);

      setUpcomingBookings([
        { id: 1, tourName: 'Mountain Adventure', touristName: 'Alex Johnson', date: 'Tomorrow, 9:00 AM', status: 'CONFIRMED', amount: 250 },
        { id: 2, tourName: 'City Exploration', touristName: 'Sarah Miller', date: 'Dec 15, 2:00 PM', status: 'CONFIRMED', amount: 180 },
        { id: 3, tourName: 'Food Tasting Tour', touristName: 'Mike Chen', date: 'Dec 18, 11:00 AM', status: 'PENDING', amount: 120 },
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  const formatBookingDate = (dateString: string) => {
    if (!dateString) return 'Date not set';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days from now`;
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateRecentActivity = (tours: any[], bookings: any[]) => {
    const activities:any = [];
    
    // Add recent bookings
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    recentBookings.forEach((booking, index) => {
      activities.push({
        id: `booking-${index}`,
        type: 'booking',
        message: `New booking for ${booking.tour?.title || 'a tour'}`,
        time: formatTimeAgo(booking.createdAt),
      });
    });

    // Add recent tour updates
    const recentTours = [...tours]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, 2);
    
    recentTours.forEach((tour, index) => {
      activities.push({
        id: `tour-${index}`,
        type: 'tour',
        message: `${tour.isActive ? 'Activated' : 'Deactivated'} ${tour.title}`,
        time: formatTimeAgo(tour.updatedAt || tour.createdAt),
      });
    });

    return activities.sort(() => Math.random() - 0.5).slice(0, 5);
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const calculateAverageRating = (tours: any[]) => {
    if (tours.length === 0) return 4.8;
    
    const totalRating = tours.reduce((sum, tour) => {
      return sum + (tour.averageRating || tour.rating || 0);
    }, 0);
    
    return Math.round((totalRating / tours.length) * 10) / 10;
  };

  if (userRole === 'TOURIST') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Tourist Dashboard</h1>
          {/* Tourist-specific content will go here */}
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Tourist Dashboard</h2>
            <p className="text-gray-600 mb-8">Your tourist dashboard is under development.</p>
            <button
              onClick={() => router.push('/tours')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all"
            >
              Explore Tours
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Guide Dashboard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                Guide Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your {stats.activeListings} tours, {stats.totalBookings} bookings, and {stats.pendingRequests} requests
              </p>
              {error && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    ⚠️ {error} (Showing demo data)
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard/guide/create-tour')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Create New Tour
              </button>
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="p-2.5 border border-blue-200 bg-white hover:bg-blue-50 rounded-xl font-medium text-sm transition-colors"
              >
                <Settings className="h-4 w-4 text-blue-600" />
              </button>
              <button
                onClick={fetchDashboardData}
                className="p-2.5 border border-blue-200 bg-white hover:bg-blue-50 rounded-xl font-medium text-sm transition-colors"
              >
                <Loader2 className={`h-4 w-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Stats Overview */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stats.upcomingTours}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Upcoming Tours</h3>
                <p className="text-sm text-gray-600">Confirmed bookings</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                    <Bell className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stats.pendingRequests}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Pending Requests</h3>
                <p className="text-sm text-gray-600">Awaiting your response</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stats.activeListings}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Active Listings</h3>
                <p className="text-sm text-gray-600">Available for booking</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${stats.totalEarnings}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Total Earnings</h3>
                <p className="text-sm text-gray-600">From completed tours</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalBookings}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Total Bookings</h3>
                <p className="text-sm text-gray-600">All time bookings</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-yellow-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Average Rating</h3>
                <p className="text-sm text-gray-600">Based on all reviews</p>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link 
                  href="/dashboard/guide/my-tours"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all border border-blue-200 group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Package className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Tours</h3>
                    <p className="text-xs text-gray-600">{stats.activeListings} active listings</p>
                  </div>
                </Link>

                <Link 
                  href="/dashboard/guide/bookings"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200 group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Calendar className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">View Bookings</h3>
                    <p className="text-xs text-gray-600">{stats.upcomingTours} upcoming</p>
                  </div>
                </Link>

                <Link 
                  href="/dashboard/guide/analytics"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all border border-purple-200 group"
                >
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Eye className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Analytics</h3>
                    <p className="text-xs text-gray-600">Performance insights</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                      activity.type === 'tour' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'booking' ? <Calendar className="h-3 w-3" /> :
                       activity.type === 'review' ? <Star className="h-3 w-3" /> :
                       activity.type === 'tour' ? <Package className="h-3 w-3" /> :
                       <DollarSign className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Bookings
            </h2>
            <Link 
              href="/dashboard/guide/bookings"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tour</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tourist</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{booking.tourName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-700">{booking.touristName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-700">{booking.date}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">${booking.amount}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                        {booking.status === 'PENDING' && (
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            Confirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {upcomingBookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No upcoming bookings found
              </div>
            )}
          </div>
        </div>

        {/* Recent Tours */}
        {myTours.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Your Recent Tours
              </h2>
              <Link 
                href="/dashboard/guide/my-tours"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tour Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Fee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {myTours.slice(0, 5).map((tour) => (
                    <tr key={tour.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{tour.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tour.category || 'OTHER'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">${tour.fee || 0}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tour.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {tour.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-700">{tour.totalBookings || 0} bookings</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Summary */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Summary</h2>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <p className="text-gray-600">Monitoring {stats.activeListings} active tours</p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${stats.totalEarnings}</div>
                  <div className="text-sm text-gray-600">Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}