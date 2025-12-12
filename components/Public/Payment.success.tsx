// app/payment/success/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, Download, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from "framer-motion"
import Link from 'next/link';

// Loading fallback component
function PaymentLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-green-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading payment details...</p>
      </div>
    </div>
  );
}

// Main content component wrapped in Suspense
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const transactionId = searchParams.get('transactionId');
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' // Add this for dynamic data
      });

      const result = await response.json();
      if (result.success) {
        setBookingDetails(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch booking details');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    toast.info('Receipt download feature coming soon!');
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Booking Confirmation',
        text: `I've booked ${bookingDetails?.tour?.title} on TourHobe!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Booking link copied to clipboard!');
    }
  };

  if (loading) {
    return <PaymentLoading />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Your booking has been confirmed and payment is completed.
          </p>

          {/* Booking Details */}
          {bookingDetails ? (
            <div className="bg-green-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{bookingDetails.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour:</span>
                  <span className="font-medium">{bookingDetails.tour?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${bookingDetails.payment?.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">{transactionId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    CONFIRMED
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-xl p-6 mb-8 text-center">
              <p className="text-yellow-800">
                Booking details could not be loaded. Please check bookings email for confirmation.
              </p>
            </div>
          )}

       
       <Link href={'/dashboard/tourist/bookings'}>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 text-center"
            >
              <button className="
            inline-flex items-center gap-3
            px-8 py-4 rounded-xl font-semibold
            bg-linear-to-r from-gray-900 to-blue-900
            text-white hover:from-blue-900 hover:to-gray-900
            transition-all duration-300 shadow-lg hover:shadow-xl
            border border-gray-800
          ">
              
                View My Bookings
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
       </Link>
          



          {/* Back Button */}
          <div className="mt-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/tours')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse More Tours
            </Button>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@tourhobe.com" className="text-blue-600 hover:underline">
              support@tourhobe.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function PaymentSuccess() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

// Make the page dynamic to ensure searchParams work properly
export const dynamic = 'force-dynamic';