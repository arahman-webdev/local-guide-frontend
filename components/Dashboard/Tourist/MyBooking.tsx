// components/Dashboard/Tourist/MyBooking.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Star, XCircle, X, Calendar, Clock as ClockIcon, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Booking {
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
    location?: string;
  };
  user?: {
    id: string;
    role: string;
  };
  hasReviewed?: boolean;
}

export default function MyBooking({ bookings }: { bookings: Booking[] }) {
 
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  // Calculate statistics
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === "COMPLETED").length;
  const pendingBookings = bookings.filter(b => b.status === "PENDING").length;
  const reviewedBookings = bookings.filter(b => b.tour.id).length;

 console.log("from bookings", bookings)

  const canReviewBooking = (booking: Booking) => {
    if (booking.status !== "COMPLETED") return false;
    if (booking.hasReviewed) return false;
    if (booking.user?.role !== "TOURIST") return false;
    return true;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = getStatusColor(status);
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${colors}`}>
        {getStatusIcon(status)}
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const validateForm = () => {
    const newErrors: { rating?: string; comment?: string } = {};
    
    if (rating < 1 || rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }
    
    if (comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    }
    
    if (comment.trim().length > 500) {
      newErrors.comment = "Comment cannot exceed 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenReviewModal = (booking: Booking) => {
    if (!canReviewBooking(booking)) {
      if (booking.hasReviewed) {
        toast.info("You have already reviewed this tour");
      } else if (booking.status !== "COMPLETED") {
        toast.info("You can only review completed tours");
      }
      return;
    }
    
    setSelectedBooking(booking);
    
    setRating(5);
    setComment("");
    setErrors({});
    setShowReviewModal(true);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
    setRating(5);
    setComment("");
    setErrors({});
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBooking) {
      toast.error("No booking selected");
      return;
    }
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get token
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
      }

      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const reviewData = {
        rating: rating,
        comment: comment.trim(),
        bookingId: selectedBooking.id
      };


 console.log("seleceted tourid", selectedBooking)
      

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${selectedBooking.tour.id}`, {
        method: "POST",
        headers,
        body: JSON.stringify(reviewData),
      });

      const responseData = await res.json();

      

      if (!res.ok) {
        throw new Error(responseData.message || `Failed to submit review: ${res.status}`);
      }

      toast.success("🎉 Review submitted successfully!");
      handleCloseModal();
      
      // Refresh the page to update the booking status
      router.refresh();

    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showReviewModal) {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showReviewModal]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showReviewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReviewModal]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500 mb-2">
              My Tour Bookings
            </h1>
            <p className="text-gray-600">
              Manage your bookings and share your experiences with the community
            </p>
          </div>
          <Button
            onClick={() => router.push("/tours")}
            className="bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-lg font-semibold rounded-xl"
          >
            Book New Tour
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{completedBookings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingBookings}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Reviewed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{reviewedBookings}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-linear-to-r from-blue-50/80 to-cyan-50/80">
            <h2 className="text-xl font-semibold text-gray-800">Booking History</h2>
            <p className="text-gray-600 text-sm mt-1">All your tour bookings in one place</p>
          </div>

          {bookings?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-linear-to-r from-blue-50 to-cyan-50">
                  <TableRow className="border-b border-blue-100">
                    <TableHead className="font-semibold text-blue-700 py-4 text-lg">Tour Details</TableHead>
                    <TableHead className="font-semibold text-blue-700 py-4 text-lg">Booking Info</TableHead>
                    <TableHead className="font-semibold text-blue-700 py-4 text-lg">Schedule</TableHead>
                    <TableHead className="font-semibold text-blue-700 py-4 text-lg">Status</TableHead>
                    <TableHead className="font-semibold text-blue-700 py-4 text-lg text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200"
                    >
                      {/* Tour Column */}
                      <TableCell className="py-6">
                        <div className="flex items-start gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md">
                            <Image
                              src={booking?.tour?.tourImages?.[0]?.imageUrl  || "/default-tour.jpg"}
                              alt={booking.tour.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{booking.tour.title}</h3>
                            {booking.tour.location && (
                              <div className="flex items-center gap-1 mt-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{booking.tour.location}</span>
                              </div>
                            )}
                            <div className="mt-3">
                              <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                ID: {booking.id.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Booking Code */}
                      <TableCell>
                        <div className="space-y-2">
                          <div className="font-mono font-bold text-blue-700 bg-blue-50 px-4 py-3 rounded-xl inline-block border border-blue-200 shadow-sm">
                            {booking.bookingCode}
                          </div>
                          <p className="text-sm text-gray-500">Booking Reference</p>
                        </div>
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="font-medium text-gray-900">{formatDate(booking.startTime)}</div>
                              <div className="text-sm text-gray-500">Tour Date</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </div>
                              <div className="text-sm text-gray-500">Duration</div>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {getStatusBadge(booking.status)}
                        {booking.hasReviewed && booking.status === "COMPLETED" && (
                          <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                            <Star className="w-4 h-4" />
                            <span>Reviewed</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleOpenReviewModal(booking)}
                          disabled={!canReviewBooking(booking)}
                          variant={booking.hasReviewed ? "outline" : "default"}
                          className={`
                            transition-all duration-300 px-6 py-5 rounded-xl font-semibold
                            ${booking.hasReviewed 
                              ? "bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200" 
                              : "bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg"
                            }
                            ${!canReviewBooking(booking) && !booking.hasReviewed 
                              ? "opacity-50 cursor-not-allowed hover:shadow-none" 
                              : ""
                            }
                          `}
                        >
                          <Star className="w-5 h-5 mr-2" />
                          {booking.hasReviewed ? "Reviewed" : 
                           booking.status !== "COMPLETED" ? "Complete First" : 
                           "Leave Review"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-24 h-24 mx-auto bg-linear-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
                <IconUsers className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No Bookings Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Start your adventure by booking your first tour! Explore amazing destinations and create unforgettable memories.
              </p>
              <Button
                onClick={() => router.push("/tours")}
                className="bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Tours
              </Button>
            </div>
          )}

          {/* Footer */}
          {bookings.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-linear-to-r from-blue-50/50 to-cyan-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-gray-700">
                  Showing <span className="font-bold">{bookings.length}</span> {bookings.length === 1 ? 'booking' : 'bookings'}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">{completedBookings} completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">{pendingBookings} pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">{reviewedBookings} reviewed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Share Your Experience</h2>
                  <p className="text-gray-600 text-sm mt-1">Help others by reviewing this tour</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Tour Info Card */}
              <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={selectedBooking.tour.tourImages?.[0]?.imageUrl || "/default-tour.jpg"}
                      alt={selectedBooking.tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{selectedBooking.tour.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedBooking.endTime)}</span>
                      </div>
                      <div className="text-sm font-mono text-gray-600">
                        #{selectedBooking.bookingCode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Rating Section */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900 block">
                    How would you rate this tour? *
                  </label>
                  <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-2 hover:scale-125 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          <Star
                            className={`w-10 h-10 ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-gray-800">
                        {rating}
                        <span className="text-gray-500 text-lg">/5</span>
                      </span>
                      <p className="text-gray-600 text-sm mt-1">
                        {rating === 5 ? "Excellent!" : 
                         rating === 4 ? "Very Good" : 
                         rating === 3 ? "Good" : 
                         rating === 2 ? "Fair" : "Poor"}
                      </p>
                    </div>
                  </div>
                  {errors.rating && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{errors.rating}</p>
                  )}
                </div>

                {/* Comment Section */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900 block">
                    Share your experience *
                  </label>
                  <textarea
                    placeholder="Tell us about your tour experience. What did you like? What could be improved? (Minimum 10 characters)"
                    className="w-full min-h-[140px] p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      {errors.comment && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{errors.comment}</p>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      comment.length > 500 ? 'text-red-600' : 
                      comment.length < 10 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {comment.length}/500
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Your review will help other travelers make better decisions.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="px-8 py-6 text-lg font-semibold rounded-xl border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                        Submitting Review...
                      </>
                    ) : (
                      <>
                        <Star className="w-5 h-5 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}