// app/dashboard/page.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bell, Package, Users, CreditCard, Settings } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'TOURIST' | 'GUIDE'>('TOURIST');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Check user role from localStorage or API
    const role = localStorage.getItem('userRole') || 'tourist';
    setUserRole(role as 'TOURIST' | 'GUIDE');
  }, []);

  if (userRole === 'TOURIST') {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Tourist Dashboard</h1>
          {/* Tourist-specific content */}
        </div>
      </div>
    );
  }

  // Guide Dashboard
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Guide Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your tours, bookings, and requests all in one place
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">12</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Upcoming Tours</h3>
            <p className="text-sm text-gray-600">Next 30 days</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <Bell className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">5</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Pending Requests</h3>
            <p className="text-sm text-gray-600">Awaiting your response</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">8</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Active Listings</h3>
            <p className="text-sm text-gray-600">Available for booking</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <TabsList className="grid w-full lg:w-auto grid-cols-3">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Upcoming</span>
                <span className="sm:hidden">Upcoming</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Pending</span>
                <span className="sm:hidden">Pending</span>
              </TabsTrigger>
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">My Listings</span>
                <span className="sm:hidden">Listings</span>
              </TabsTrigger>
            </TabsList>

            {/* Quick Actions */}
            <div className="mt-4 lg:mt-0 flex gap-2">
              <button 
                onClick={() => router.push('/create-tour')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
              >
                + Create New Tour
              </button>
              <button 
                onClick={() => router.push('/dashboard/settings')}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-sm"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          <TabsContent value="upcoming" className="mt-0">
            {/* <UpcomingBookings /> */}
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            {/* <PendingRequests /> */}
          </TabsContent>

          <TabsContent value="listings" className="mt-0">
            {/* <MyTourListing tours={[]} />  */}
          </TabsContent>
        </Tabs>

        {/* Recent Activity Sidebar (Desktop) */}
        <div className="hidden lg:block mt-8">
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New booking confirmed</p>
                  <p className="text-sm text-gray-600">Old Dhaka Food Tour • 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payment received</p>
                  <p className="text-sm text-gray-600">$120.00 • 1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}