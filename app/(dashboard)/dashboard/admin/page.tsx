// app/dashboard/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, Package, CreditCard, TrendingUp,
    Activity, Shield, Settings, BarChart3,
    Globe, Calendar, Eye, Star, DollarSign,
    CheckCircle, XCircle, Clock, Filter,
    Download, Search, MoreVertical, ArrowUpRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTours: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingApprovals: 0,
        activeGuides: 0,
        activeTourists: 0,
        conversionRate: 0,
    });
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [pendingTours, setPendingTours] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
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

            // Check if user is admin
            const userRole = localStorage.getItem('userRole');
            if (userRole !== 'ADMIN') {
                router.push('/dashboard');
                return;
            }

            // Fetch data from all APIs
            const [usersRes, toursRes, bookingsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }),
            ]);

            // Handle users response
            if (!usersRes.ok) {
                throw new Error(`Failed to fetch users: ${usersRes.status}`);
            }
            const usersData = await usersRes.json();
            const allUsers = usersData.data || usersData.users || [];

            // Handle tours response
            if (!toursRes.ok) {
                throw new Error(`Failed to fetch tours: ${toursRes.status}`);
            }
            const toursData = await toursRes.json();
            const allTours = toursData.data || toursData.tours || [];

            // Handle bookings response
            if (!bookingsRes.ok) {
                throw new Error(`Failed to fetch bookings: ${bookingsRes.status}`);
            }
            const bookingsData = await bookingsRes.json();
            const allBookings = bookingsData.data || bookingsData.bookings || [];

            console.log('Fetched data:', {
                users: allUsers.length,
                tours: allTours.length,
                bookings: allBookings.length
            });

            // Calculate statistics
            const activeGuides = allUsers.filter((user: any) =>
                user.role === 'GUIDE' && user.isActive !== false
            ).length;

            const activeTourists = allUsers.filter((user: any) =>
                user.role === 'TOURIST' && user.isActive !== false
            ).length;

            const pendingToursList = allTours.filter((tour: any) =>
                tour.status === 'PENDING' || tour.approvalStatus === 'PENDING'
            );

            // Calculate total revenue from bookings
            const totalRevenue = allBookings.reduce((sum: number, booking: any) => {

                if (booking.status === 'COMPLETED' || booking.status === 'CONFIRMED') {
                    return sum + (parseFloat(booking.totalAmount) || parseFloat(booking?.tour.fee) || 0);
                }
                return sum;
            }, 0);

            // Calculate conversion rate (bookings per active tourist)
            const conversionRate = activeTourists > 0
                ? Math.round((allBookings.length / activeTourists) * 100) / 100
                : 0;

            // Get recent users (last 5)
            const sortedUsers = [...allUsers].sort((a: any, b: any) =>
                new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime()
            );
            const recentUsersList = sortedUsers.slice(0, 5).map((user: any) => ({
                id: user.id || user._id,
                name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
                email: user.email || 'No email',
                role: user.role || 'USER',
                status: user.isActive === false ? 'inactive' : user.status || 'active',
                joinDate: formatDate(user.createdAt || user.created_at),
            }));

            // Get recent bookings (last 5)
            const sortedBookings = [...allBookings].sort((a: any, b: any) =>
                new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime()
            );
            const recentBookingsList = sortedBookings.slice(0, 5).map((booking: any) => ({
                id: booking.id || booking._id,
                tourTitle: booking.tour?.title || 'Unknown Tour',
              
                tourist: booking.user?.name || booking.touristName || 'Unknown Tourist',
                guide: booking.guide?.name || booking.guideName || 'Unknown Guide',
                amount: parseFloat(booking.totalAmount) || parseFloat(booking.fee) || parseFloat(booking?.tour?.fee) || 0,
                status: booking.status || 'PENDING',
                date: formatDate(booking.createdAt || booking.created_at),
            }));

            // Get pending tours
            const pendingToursData = pendingToursList.slice(0, 5).map((tour: any) => ({
                id: tour.id || tour._id,
                title: tour.title || 'Untitled Tour',
                guide: tour.guide?.name || tour.user?.name || 'Unknown Guide',
                category: tour.category || 'OTHER',
                submitted: formatDate(tour.createdAt || tour.created_at),
            }));

            // Update state
            setStats({
                totalUsers: allUsers.length,
                totalTours: allTours.length,
                totalBookings: allBookings.length,
                totalRevenue,
                pendingApprovals: pendingToursList.length,
                activeGuides,
                activeTourists,
                conversionRate,
            });

            setRecentUsers(recentUsersList);
            setRecentBookings(recentBookingsList);
            setPendingTours(pendingToursData);

        } catch (error: any) {
            console.error('Error fetching admin data:', error);
            setError(error.message || 'Failed to load dashboard data');

            // Fallback to mock data if API fails
            setStats({
                totalUsers: 1247,
                totalTours: 356,
                totalBookings: 892,
                totalRevenue: 45230,
                pendingApprovals: 23,
                activeGuides: 189,
                activeTourists: 1058,
                conversionRate: 4.8,
            });

            setRecentUsers([
                { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'TOURIST', status: 'active', joinDate: '2 hours ago' },
                { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', role: 'GUIDE', status: 'pending', joinDate: '5 hours ago' },
                { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'TOURIST', status: 'active', joinDate: '1 day ago' },
                { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'GUIDE', status: 'active', joinDate: '2 days ago' },
                { id: 5, name: 'David Brown', email: 'david@example.com', role: 'TOURIST', status: 'inactive', joinDate: '3 days ago' },
            ]);

            setRecentBookings([
                { id: 1, tour: 'Mountain Adventure', tourist: 'Alex Johnson', guide: 'John Doe', amount: 250, status: 'completed', date: 'Today, 9:00 AM' },
                { id: 2, tour: 'City Exploration', tourist: 'Sarah Miller', guide: 'Jane Smith', amount: 180, status: 'confirmed', date: 'Today, 2:00 PM' },
                { id: 3, tour: 'Food Tasting Tour', tourist: 'Mike Chen', guide: 'Robert Brown', amount: 120, status: 'pending', date: 'Tomorrow, 11:00 AM' },
                { id: 4, tour: 'Wildlife Safari', tourist: 'Emma Wilson', guide: 'Lisa Wang', amount: 350, status: 'cancelled', date: 'Yesterday, 3:00 PM' },
                { id: 5, tour: 'Historical Walk', tourist: 'David Brown', guide: 'Tom Harris', amount: 95, status: 'completed', date: '2 days ago' },
            ]);

            setPendingTours([
                { id: 1, title: 'Night Photography Tour', guide: 'Sarah Miller', category: 'PHOTOGRAPHY', submitted: '2 hours ago' },
                { id: 2, title: 'Beach Yoga Retreat', guide: 'Emma Wilson', category: 'WELLNESS', submitted: '5 hours ago' },
                { id: 3, title: 'Vintage Car Tour', guide: 'John Doe', category: 'ADVENTURE', submitted: '1 day ago' },
            ]);

        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown';

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
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, trend, change }: any) => (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <ArrowUpRight className={`h-4 w-4 ${change > 0 ? '' : 'rotate-90'}`} />
                        {change}%
                    </div>
                )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            <p className="text-gray-600 text-sm">{title}</p>
        </div>
    );

    const StatusBadge = ({ status }: { status: string }) => {
        const config: any = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
            completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
            cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
            COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle },
        };

        const { color, icon: Icon } = config[status] || config.pending;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${color}`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (error && recentUsers.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={fetchDashboardData}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Monitoring {stats.totalUsers} users, {stats.totalTours} tours, and {stats.totalBookings} bookings
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button className="p-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-xl">
                                <Filter className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                                onClick={fetchDashboardData}
                                className="p-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-xl"
                            >
                                <Loader2 className={`h-4 w-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-700 text-sm">
                                ⚠️ {error} (Showing demo data)
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={Users}
                        color="from-indigo-500 to-blue-500"
                        trend="up"
                        change={12.5}
                    />

                    <StatCard
                        title="Total Tours"
                        value={stats.totalTours}
                        icon={Package}
                        color="from-emerald-500 to-teal-500"
                        trend="up"
                        change={8.2}
                    />

                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        icon={CreditCard}
                        color="from-amber-500 to-orange-500"
                        trend="up"
                        change={15.3}
                    />

                    <StatCard
                        title="Pending Approvals"
                        value={stats.pendingApprovals}
                        icon={Shield}
                        color="from-rose-500 to-pink-500"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
                                <p className="text-sm text-gray-600">Active users breakdown</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700">Active Tourists</span>
                                </div>
                                <span className="font-semibold text-gray-900">{stats.activeTourists}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700">Active Guides</span>
                                </div>
                                <span className="font-semibold text-gray-900">{stats.activeGuides}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700">Conversion Rate</span>
                                </div>
                                <span className="font-semibold text-gray-900">{stats.conversionRate}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
                                <p className="text-sm text-gray-600">Monthly performance</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">User Growth</span>
                                    <span className="font-medium text-gray-900">+{Math.round(stats.totalUsers * 0.1)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full h-2"
                                        style={{ width: `${Math.min(100, (stats.totalUsers / 2000) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Tour Growth</span>
                                    <span className="font-medium text-gray-900">+{Math.round(stats.totalTours * 0.15)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full h-2"
                                        style={{ width: `${Math.min(100, (stats.totalTours / 500) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Revenue Growth</span>
                                    <span className="font-medium text-gray-900">+{Math.round(stats.totalRevenue * 0.2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full h-2"
                                        style={{ width: `${Math.min(100, (stats.totalRevenue / 50000) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg">
                                <Activity className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                                <p className="text-sm text-gray-600">Platform management</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/dashboard/admin/users"
                                className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl border border-indigo-200 transition-all group"
                            >
                                <Users className="h-5 w-5 text-indigo-600 mb-2" />
                                <h4 className="font-medium text-gray-900 text-sm">Manage Users</h4>
                                <p className="text-xs text-gray-500">{stats.totalUsers} users</p>
                            </Link>
                            <Link
                                href="/dashboard/admin/tours"
                                className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl border border-emerald-200 transition-all group"
                            >
                                <Package className="h-5 w-5 text-emerald-600 mb-2" />
                                <h4 className="font-medium text-gray-900 text-sm">Tour Approvals</h4>
                                <p className="text-xs text-gray-500">{stats.pendingApprovals} pending</p>
                            </Link>
                            <Link
                                href="/dashboard/admin/bookings"
                                className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-xl border border-amber-200 transition-all group"
                            >
                                <CreditCard className="h-5 w-5 text-amber-600 mb-2" />
                                <h4 className="font-medium text-gray-900 text-sm">View Bookings</h4>
                                <p className="text-xs text-gray-500">{stats.totalBookings} bookings</p>
                            </Link>
                            <Link
                                href="/dashboard/admin/analytics"
                                className="p-3 bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 rounded-xl border border-violet-200 transition-all group"
                            >
                                <BarChart3 className="h-5 w-5 text-violet-600 mb-2" />
                                <h4 className="font-medium text-gray-900 text-sm">Analytics</h4>
                                <p className="text-xs text-gray-500">Detailed insights</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Recent Users */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                                        <p className="text-sm text-gray-600">New platform registrations</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/admin/users"
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'GUIDE'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={user.status} />
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">{user.joinDate}</td>
                                        </tr>
                                    ))}
                                    {recentUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                                        <p className="text-sm text-gray-600">Latest transactions</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/admin/bookings"
                                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                                    
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-medium text-gray-900">{booking.tourTitle}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {booking.tourist} → {booking.guide}
                                                    </div>
                                                </div>
                                            </td>
                                          
                                            <td className="py-4 px-6">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">{booking.date}</td>
                                        </tr>
                                    ))}
                                    {recentBookings.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-gray-500">
                                                No bookings found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pending Tour Approvals */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg">
                                    <Shield className="h-5 w-5 text-rose-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Pending Tour Approvals</h2>
                                    <p className="text-sm text-gray-600">{stats.pendingApprovals} tours awaiting review</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/admin/tours"
                                className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Title</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guide</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pendingTours.map((tour) => (
                                    <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{tour.title}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-gray-700">{tour.guide}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {tour.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{tour.submitted}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                                    Approve
                                                </button>
                                                <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
                                                    Reject
                                                </button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                    Preview
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pendingTours.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            No pending tour approvals
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Platform Status</h2>
                            <p className="text-indigo-100">Monitoring {stats.totalUsers} users and {stats.totalBookings} bookings</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">Live</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="h-5 w-5" />
                                <span className="text-sm font-medium">Total Users</span>
                            </div>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <div className="text-xs text-indigo-200">Registered</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Package className="h-5 w-5" />
                                <span className="text-sm font-medium">Total Tours</span>
                            </div>
                            <div className="text-2xl font-bold">{stats.totalTours}</div>
                            <div className="text-xs text-indigo-200">Listed</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="h-5 w-5" />
                                <span className="text-sm font-medium">Revenue</span>
                            </div>
                            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                            <div className="text-xs text-indigo-200">Total</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="h-5 w-5" />
                                <span className="text-sm font-medium">Bookings</span>
                            </div>
                            <div className="text-2xl font-bold">{stats.totalBookings}</div>
                            <div className="text-xs text-indigo-200">Completed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}