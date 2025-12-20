import AdminDashboard from '@/components/Dashboard/Admin/Dashboard'
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "Platform Management |  Admin Dahsboard- LocalGuide",
  description: "Admin panel for managing tours, users, bookings, and analytics. Monitor platform performance and manage content.",
};

export default function AdminDashboardPage() {
  return (
    <div>
        <AdminDashboard />
    </div>
  )
}
